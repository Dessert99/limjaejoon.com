// wishlist 테이블 매핑 — 외부 관광 데이터를 "추가 시점 그대로" 평탄화해 저장(snapshot 컬럼). 외부 API 데이터가 변해도 사용자 화면이 흔들리지 않게 함
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('wishlist')
export class Wishlist {
  // uuid PK — 순차 정수 PK는 사용자 항목 수 추정 가능, 노출 회피
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 소유자 FK — 외래키 제약은 migration에서 raw SQL로 정의(엔티티는 컬럼 메타만 선언)
  @Column({ type: 'uuid', name: 'userId' })
  userId!: string;

  // 외부 KorService2 contentId — 숫자 문자열, 길이 20자 여유. (userId, contentId) UNIQUE는 migration에서 정의
  @Column({ type: 'varchar', length: 20, name: 'contentId' })
  contentId!: string;

  // 추가 시점의 관광지명 — 외부에서 이름이 바뀌어도 사용자 화면엔 추가 당시 이름이 유지됨
  @Column({ type: 'varchar', length: 200, name: 'snapshotTitle' })
  snapshotTitle!: string;

  // 추가 시점 대표 이미지 URL 스냅샷 — 외부 이미지 교체에 영향 안 받음
  @Column({
    type: 'varchar',
    length: 500,
    name: 'snapshotFirstImage',
    nullable: true,
  })
  snapshotFirstImage!: string | null;

  // 추가 시점 주소 스냅샷 — 외부 데이터 갱신과 분리
  @Column({
    type: 'varchar',
    length: 300,
    name: 'snapshotAddr',
    nullable: true,
  })
  snapshotAddr!: string | null;

  // INSERT 시 자동 채움 — list 메서드의 DESC 정렬 기준
  @CreateDateColumn({ type: 'timestamptz', name: 'createdAt' })
  createdAt!: Date;
}
