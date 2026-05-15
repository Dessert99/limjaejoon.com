// 위시리스트 스키마 — wishlist 테이블 + (userId,contentId) UNIQUE + (userId,createdAt) 정렬 인덱스. users 마이그레이션 이후에 실행되어 FK 참조 가능
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitWishlist1714099300000 implements MigrationInterface {
  // up — wishlist 테이블 생성 후 두 인덱스 추가. 인덱스 순서는 동작에 무관하지만 의미상(중복 방지 → 조회 최적화) 자연스러움
  async up(queryRunner: QueryRunner): Promise<void> {
    // wishlist 테이블 — 외부 관광 데이터를 추가 시점 그대로 평탄화 저장(snapshot* 컬럼). users.id FK + CASCADE로 사용자 탈퇴 시 자동 정리
    await queryRunner.query(`
      CREATE TABLE "wishlist" (
        "id"                  UUID NOT NULL DEFAULT gen_random_uuid(),
        "userId"              UUID NOT NULL,
        "contentId"           VARCHAR(20) NOT NULL,
        "snapshotTitle"       VARCHAR(200) NOT NULL,
        "snapshotFirstImage"  VARCHAR(500),
        "snapshotAddr"        VARCHAR(300),
        "createdAt"           TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_wishlist_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_wishlist_userId"
          FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // (userId, contentId) UNIQUE — 같은 사용자가 같은 관광지를 두 번 못 넣게 차단(409 경로). 본인 항목 조회의 보조 인덱스 역할도 함
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_wishlist_user_content" ON "wishlist" ("userId", "contentId")
    `);

    // (userId, createdAt) — list 메서드의 createdAt DESC 정렬을 인덱스 스캔으로 처리해 풀스캔 방지
    await queryRunner.query(`
      CREATE INDEX "IDX_wishlist_user_created" ON "wishlist" ("userId", "createdAt")
    `);
  }

  // down — DROP TABLE만으로 충분(인덱스는 테이블 따라 자동 삭제, FK 자식이 없는 끝단 테이블이라 의존 순서 고려 불필요)
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "wishlist"`);
  }
}
