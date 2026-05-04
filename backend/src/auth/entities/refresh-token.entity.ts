import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/user.entity';

// refresh_tokens 테이블 — raw 토큰은 저장하지 않고 sha-256 해시만 보관
@Entity('refresh_tokens')
@Index('IDX_rt_token_hash', ['tokenHash'], { unique: true })
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 소유 사용자 FK — users.id 참조
  @Column({ type: 'uuid', nullable: false })
  userId!: string;

  // sha-256(raw token) hex 64자 — raw는 절대 DB에 들어오지 않는다
  @Column({ type: 'char', length: 64, nullable: false, unique: true })
  tokenHash!: string;

  // null = 유효, not null = 폐기됨
  @Column({ type: 'timestamptz', nullable: true, default: null })
  revokedAt!: Date | null;

  // 토큰 만료 시각 — 이 시각 이후에는 거부한다
  @Column({ type: 'timestamptz', nullable: false })
  expiresAt!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  // 사용자 관계 — 사용자 삭제 시 토큰도 cascade 삭제
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;
}
