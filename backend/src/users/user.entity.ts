import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// users 테이블 엔티티 — 이메일/해시만 보관하고 raw 비밀번호는 절대 저장하지 않는다
@Entity('users')
@Index('IDX_users_email', ['email'], { unique: true }) // 이메일 유니크 인덱스 — 중복 가입 방지
export class User {
  // UUID primary key — 순차 노출 방지를 위해 uuid 사용
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 이메일 — 로그인 식별자, 유니크 제약 추가
  @Column({ type: 'varchar', unique: true, nullable: false })
  email!: string;

  // bcrypt 해시만 저장 — raw 비밀번호는 절대 컬럼에 들어오지 않는다
  @Column({ type: 'varchar', nullable: false })
  passwordHash!: string;

  // 행 생성 시각 자동 기록
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  // 행 갱신 시각 자동 기록
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
