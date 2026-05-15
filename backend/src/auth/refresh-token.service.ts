// refresh JWT 발급·회전·폐기 — JWT 서명은 JwtService가, DB 영속화는 Repository가 담당. RefreshTokenStrategy.validate가 jti로 활성 검증을 위해 assertActive를 호출
import * as crypto from 'crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

// 발급 결과 — raw는 쿠키로(서명된 JWT 문자열), expiresAt은 프론트 만료 계산용, jti는 회전 시 인자
export interface IssuedToken {
  raw: string;
  expiresAt: Date;
  userId: string;
  jti: string;
}

// @Injectable — Nest DI 컨테이너에 등록하는 출입증, 이게 있어야 다른 클래스가 이 서비스를 주입받을 수 있다
@Injectable()
export class RefreshTokenService {
  // 생성자 인자에 private readonly를 붙이면 TypeScript가 동일 이름의 클래스 필드를 자동 생성 + Nest가 인스턴스를 주입한다
  constructor(
    // @InjectRepository(RefreshToken) — TypeOrmModule.forFeature([RefreshToken])이 만든 Repository<RefreshToken>을 주입, 이걸로 refresh_tokens 테이블 CRUD
    @InjectRepository(RefreshToken)
    private readonly rtRepo: Repository<RefreshToken>,
    // ConfigService — .env + process.env를 Joi 검증 후 노출하는 단일 창구, 직접 process.env 읽지 않는 이유는 검증된 값임을 보장하기 위함
    private readonly cs: ConfigService,
    // JwtService — @nestjs/jwt가 제공, sign/verify 호출로 JWT 문자열을 만들고 검증한다
    private readonly jwt: JwtService
  ) {}

  // issue(userId) — 새 jti(UUID) 생성 → DB INSERT → {sub, jti}로 JWT 서명 → 클라가 쿠키로 받을 raw JWT 문자열 반환. signup·login·rotate 모두 마지막에 이 함수를 호출
  async issue(userId: string): Promise<IssuedToken> {
    // crypto.randomUUID() — Node 표준 v4 UUID(외부 의존 0). 추측 불가능한 jti가 폐기 추적의 키, 짧은 sequence id면 도둑이 다음 토큰 jti를 추측 가능
    const jti = crypto.randomUUID();
    // 환경 변수 미설정 시 '1d' fallback — Joi가 이미 형식을 검증하지만 안전망. ttlStr 형태: "1d" / "15m" / "30s" 같은 문자열
    const ttlStr = this.cs.get<string>('JWT_REFRESH_TTL') ?? '1d';
    // 문자열 → 절대 Date(미래 시각)로 변환 — DB의 expiresAt 컬럼은 timestamptz라 Date 객체가 필요
    const expiresAt = parseTtlToDate(ttlStr);

    // DB 행 INSERT 먼저 — JWT 서명 후 INSERT가 실패하면 클라엔 토큰이 가 있는데 DB엔 행이 없는 좀비 상태 발생, 순서를 INSERT → sign으로 고정해 사고 차단
    // create()는 메모리 객체 생성, save()가 실제 INSERT — TypeORM 표준 패턴
    await this.rtRepo.save(this.rtRepo.create({ userId, jti, expiresAt }));

    // 라이브러리 'ms'의 StringValue 타입 단언 — JwtSignOptions의 expiresIn이 string|number 둘 다 받지만 정확한 단위 문자열 형식만 허용
    const expiresIn = ttlStr as JwtSignOptions['expiresIn'];
    // JwtService.sign({payload}, {options}) — payload를 base64url로 인코드하고 SECRET으로 HMAC 서명해 'header.payload.signature' 문자열 반환
    // sub=userId, jti=토큰식별자 두 클레임만 담는다 — 이메일·권한 같은 민감 정보는 평문 노출되니 절대 금지
    const raw = this.jwt.sign(
      { sub: userId, jti },
      {
        // refresh 전용 SECRET — access와 다른 키여야 한쪽 유출 시 다른 쪽 위조가 불가능
        secret: this.cs.getOrThrow<string>('JWT_REFRESH_SECRET'),
        // expiresIn 문자열을 라이브러리가 파싱해 exp 클레임 자동 추가 — 우리가 직접 계산할 필요 없음
        expiresIn,
      }
    );

    return { raw, expiresAt, userId, jti };
  }

  // assertActive(jti) — JWT 서명·만료 검증(Passport)을 통과한 뒤에도 DB가 살아있는지 다시 확인하는 stateful 검증. RefreshTokenStrategy.validate가 호출
  // 왜 이중 검증? — 순수 JWT는 stateless라 한 번 발급되면 만료 전엔 못 막음. 강제 폐기/로그아웃을 가능케 하려면 DB의 revokedAt이 필요
  async assertActive(jti: string): Promise<void> {
    // jti로 DB 행 1건 조회 — SELECT * FROM refresh_tokens WHERE jti = $1 LIMIT 1
    const row = await this.rtRepo.findOne({ where: { jti } });
    // 미존재(jti 위조·삭제) 또는 revokedAt 세팅됨(폐기) — 두 경우 모두 동일 401 메시지로 단서 노출 차단
    if (!row || row.revokedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    // JWT의 exp가 통과했어도 DB의 expiresAt으로 한 번 더 — 서버·발급 머신 시계 어긋남이나 DB 직접 수정 케이스 방어
    if (row.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }
  }

  // rotate(jti, userId) — 가드 통과 후 호출. 기존 jti를 즉시 폐기하고 새 jti+JWT 한 쌍을 발급(refresh rotation), 도둑이 훔친 토큰을 1회만 쓰게 하는 핵심 보안 패턴
  async rotate(jti: string, userId: string): Promise<IssuedToken> {
    const row = await this.rtRepo.findOne({ where: { jti } });
    // strategy에서 이미 통과했지만 그 사이 다른 회전이 끼어들어 폐기됐을 수 있어 race 보강 — 동시 두 요청이 같은 jti를 회전하려는 시나리오
    if (!row || row.revokedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    // 새 토큰 발급 전에 기존 행을 먼저 폐기 — 순서가 거꾸로면 옛 jti가 잠시 살아있는 시점이 생겨 도둑이 다시 쓸 수 있음
    row.revokedAt = new Date();
    await this.rtRepo.save(row);
    // issue를 재사용해 jti·INSERT·sign 흐름 동일하게 유지 — 발급 로직 단일 출처
    return this.issue(userId);
  }

  // revoke(jti) — 로그아웃 호출. 미존재·이미 폐기 모두 throw 없음(멱등) — 사용자가 두 번 클릭하거나 위조 토큰을 보내도 응답이 동일해야 사용성·보안 양쪽이 안전
  async revoke(jti: string): Promise<void> {
    const row = await this.rtRepo.findOne({ where: { jti } });
    // 행이 있고 아직 살아있을 때만 폐기 — 이미 폐기된 토큰을 다시 save하면 revokedAt 시각이 갱신돼 감사 로그가 흐트러짐
    if (row && !row.revokedAt) {
      row.revokedAt = new Date();
      await this.rtRepo.save(row);
    }
  }
}

// "15m"·"1d" → 미래 Date 변환. env.validation의 Joi 패턴이 형식을 사전 보장하지만 직접 호출 케이스(테스트)도 있어 한 번 더 방어
// 정규식: 숫자(\d+) + 단위문자([smhd]) — "15m" 매치, "abc"·"15min"·"15"는 거부
const TTL_RE = /^(\d+)([smhd])$/;
// 단위 → 밀리초 환산 테이블 — switch 대신 객체로 두면 단위 추가 시 한 줄만 늘리면 됨
const TTL_UNIT_MS: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

function parseTtlToDate(ttl: string): Date {
  const match = TTL_RE.exec(ttl);
  // 형식 위반은 즉시 throw — env 오설정을 부팅 직후 발견하지 않으면 토큰 발급 시점에 예외가 터져 전체 인증 흐름이 무너짐
  if (!match) {
    throw new Error(`Invalid TTL format: "${ttl}"`);
  }
  // match[1] = 숫자 부분("15"), match[2] = 단위 문자("m") — 정규식의 캡처 그룹 인덱스
  const ms = TTL_UNIT_MS[match[2]] * parseInt(match[1], 10);
  // 현재 시각 + ms 미래 = DB에 저장할 만료 시각
  return new Date(Date.now() + ms);
}
