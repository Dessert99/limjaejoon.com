import { MigrationInterface, QueryRunner } from 'typeorm';

// wishlist 테이블 + 인덱스 생성 — users.id FK는 ON DELETE CASCADE로 사용자 탈퇴 시 자동 정리 (ADR 0003)
export class InitWishlist1714099300000 implements MigrationInterface {
  // 마이그레이션 적용 — 테이블 생성 후 (userId, contentId) UNIQUE / (userId, createdAt) 인덱스 추가
  async up(queryRunner: QueryRunner): Promise<void> {
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

    // (userId, contentId) UNIQUE — 중복 추가 방지 + 본인 항목 조회 인덱스 역할
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_wishlist_user_content" ON "wishlist" ("userId", "contentId")
    `);

    // (userId, createdAt) — 위시리스트 페이지 createdAt DESC 정렬 조회 최적화
    await queryRunner.query(`
      CREATE INDEX "IDX_wishlist_user_created" ON "wishlist" ("userId", "createdAt")
    `);
  }

  // 마이그레이션 롤백 — 테이블만 삭제하면 인덱스도 함께 제거됨
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "wishlist"`);
  }
}
