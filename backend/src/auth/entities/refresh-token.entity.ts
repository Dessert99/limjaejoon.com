// refresh_tokens 테이블 매핑 — refresh JWT의 jti 클레임을 행 식별자로 저장. JWT 자체는 DB에 안 남고, jti(uuid)만으로 폐기·만료 추적
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/user.entity';

@Entity('refresh_tokens')
// jti 유니크 인덱스 — RefreshTokenStrategy.validate가 jti로 단일 행 조회. 풀스캔 방지 + 중복 jti 차단
@Index('IDX_rt_jti', ['jti'], { unique: true })
export class RefreshToken {
  // PK는 row 식별자 — jti와는 별개(jti가 PK여도 되지만 표준 관례상 별도 PK)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 소유자 FK — users.id 참조. 사용자 삭제 시 cascade
  @Column({ type: 'uuid', nullable: false })
  userId!: string;

  // JWT의 jti 클레임 — RefreshTokenService.issue가 randomUUID로 생성해 JWT payload에 담고 동시에 이 컬럼에 저장
  @Column({ type: 'uuid', nullable: false, unique: true })
  jti!: string;

  // null = 활성, Date = 폐기됨. 회전 시 기존 행을 폐기하고 새 jti로 새 행 INSERT
  @Column({ type: 'timestamptz', nullable: true, default: null })
  revokedAt!: Date | null;

  // JWT_REFRESH_TTL 기반으로 issue 시점 계산 — JWT의 exp 클레임과 동일 시각, DB에서 한 번 더 검증
  @Column({ type: 'timestamptz', nullable: false })
  expiresAt!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  // 사용자 행 삭제 시 토큰도 자동 정리
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;
}
