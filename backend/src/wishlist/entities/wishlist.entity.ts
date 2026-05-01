import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// 위시리스트 엔티티 — 사용자가 즐겨찾기한 관광지 스냅샷을 평탄화 컬럼으로 저장 (ADR 0003)
@Entity('wishlist')
export class Wishlist {
  // UUID PK — 순차 노출 방지
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 소유자 — FK는 migration에서 raw SQL로 정의, 엔티티는 컬럼 메타만 선언
  @Column({ type: 'uuid', name: 'userId' })
  userId!: string;

  // 외부 KorService2 관광지 식별자 — 숫자 문자열, 최대 20자
  @Column({ type: 'varchar', length: 20, name: 'contentId' })
  contentId!: string;

  // 추가 시점의 관광지명 스냅샷 — 외부 데이터 변경에 무관하게 원본 유지
  @Column({ type: 'varchar', length: 200, name: 'snapshotTitle' })
  snapshotTitle!: string;

  // 추가 시점의 대표 이미지 URL 스냅샷 — 없으면 null
  @Column({
    type: 'varchar',
    length: 500,
    name: 'snapshotFirstImage',
    nullable: true,
  })
  snapshotFirstImage!: string | null;

  // 추가 시점의 주소 스냅샷 — 없으면 null
  @Column({
    type: 'varchar',
    length: 300,
    name: 'snapshotAddr',
    nullable: true,
  })
  snapshotAddr!: string | null;

  // 추가 시각 — DB default now(), DESC 정렬 기준
  @CreateDateColumn({ type: 'timestamptz', name: 'createdAt' })
  createdAt!: Date;
}
