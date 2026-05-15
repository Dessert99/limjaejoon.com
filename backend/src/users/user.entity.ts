// users 테이블 매핑 — UsersService의 Repository<User>가 이 클래스로 row를 다룬다
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
// 이메일 유니크 인덱스 — DB 레벨 중복 가입 방어. signup 시 race condition으로 두 요청이 동시에 INSERT해도 한쪽만 성공
@Index('IDX_users_email', ['email'], { unique: true })
export class User {
  // uuid PK — 순차 정수 PK는 사용자 수 추정·열거를 가능케 해 회피, gen_random_uuid()로 DB가 생성
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 로그인 식별자 — varchar + unique. 길이 제약 없음(이메일은 RFC상 254자까지 가능)
  @Column({ type: 'varchar', unique: true, nullable: false })
  email!: string;

  // bcrypt 해시 문자열만 저장 — raw 비밀번호는 절대 컬럼에 들어오지 않음
  @Column({ type: 'varchar', nullable: false })
  passwordHash!: string;

  // INSERT 시 자동 채움 — 가입 시각 추적
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  // UPDATE마다 자동 갱신 — 비밀번호 변경 등 추후 기능에서 사용
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
