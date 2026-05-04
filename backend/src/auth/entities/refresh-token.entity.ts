// refresh_tokens 테이블 매핑 — RefreshTokenService가 이 entity로 row를 만들고 Repository<RefreshToken>가 SQL을 추상화
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/user.entity';

// @Entity('refresh_tokens') — 이 클래스를 'refresh_tokens' 테이블로 매핑. autoLoadEntities가 자동 수집
@Entity('refresh_tokens')
// @Index — tokenHash 유니크 인덱스. rotate/revoke가 hash로 단일 행을 조회하므로 풀스캔 방지 + 중복 hash 차단
@Index('IDX_rt_token_hash', ['tokenHash'], { unique: true })
export class RefreshToken {
  // @PrimaryGeneratedColumn('uuid') — DB가 gen_random_uuid()로 자동 생성, 순차 정수 PK는 사용자 수 추측을 가능케 해 회피
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 소유자 FK — users.id 참조. 사용자 삭제 시 cascade로 같이 사라짐(아래 ManyToOne의 onDelete)
  @Column({ type: 'uuid', nullable: false })
  userId!: string;

  // sha-256(raw) → hex 64자. CHAR(64)로 고정 길이 — raw는 절대 DB에 들어오지 않음
  @Column({ type: 'char', length: 64, nullable: false, unique: true })
  tokenHash!: string;

  // null = 활성, Date = 폐기됨. UPDATE로 세팅, 한 번 폐기되면 재활성화 안 함(rotate가 매번 새 raw로 INSERT)
  @Column({ type: 'timestamptz', nullable: true, default: null })
  revokedAt!: Date | null;

  // 만료 시각 — JWT_REFRESH_TTL 기반으로 issue 시점에 계산해 저장. 이 시각 이후엔 revokedAt 상태와 무관하게 거부
  @Column({ type: 'timestamptz', nullable: false })
  expiresAt!: Date;

  // @CreateDateColumn — INSERT 시 DB의 default now()로 자동 채움. 추후 디버깅·청소 작업의 기준 시각
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  // ManyToOne(() => User, {onDelete:'CASCADE'}) — 한 user에 여러 토큰. 사용자 행 삭제 시 PostgreSQL이 토큰 행도 같이 삭제
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;
}
