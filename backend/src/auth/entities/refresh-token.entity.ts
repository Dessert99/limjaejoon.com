import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/user.entity';

// refresh_tokens 테이블 — ADR 0001 스키마 그대로. raw 토큰은 저장하지 않고 sha-256 해시만 보관
@Entity('refresh_tokens')
@Index('IDX_rt_token_hash', ['tokenHash'], { unique: true }) // 해시로 단일 토큰 조회 — atomic rotate 쿼리에 필수
@Index('IDX_rt_family_revoked', ['familyId', 'revokedAt']) // family 일괄 폐기 시 풀스캔 방지 — ADR 0001 필수 인덱스
@Index('IDX_rt_user_revoked', ['userId', 'revokedAt']) // 사용자별 활성 세션 조회용
export class RefreshToken {
  // UUID primary key
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 소유 사용자 FK — users.id 참조
  @Column({ type: 'uuid', nullable: false })
  userId!: string;

  // 로그인 1회 = 1 family. 재사용 감지 시 같은 family 전체를 일괄 폐기한다
  @Column({ type: 'uuid', nullable: false })
  familyId!: string;

  // sha-256(raw token) hex 64자 — raw는 절대 DB에 들어오지 않는다
  @Column({ type: 'char', length: 64, nullable: false, unique: true })
  tokenHash!: string;

  // null = 유효, not null = 폐기됨 — atomic UPDATE WHERE revokedAt IS NULL 로 중복 회전 방지
  @Column({ type: 'timestamptz', nullable: true, default: null })
  revokedAt!: Date | null;

  // 토큰 만료 시각 — 이 시각 이후에는 revokedAt 상태와 무관하게 거부한다
  @Column({ type: 'timestamptz', nullable: false })
  expiresAt!: Date;

  // 행 생성 시각 자동 기록
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  // 사용자 관계 — TypeORM 조인이 필요할 때를 위해 선언 (현재 쿼리는 userId 컬럼 직접 사용)
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;
}
