import { MigrationInterface, QueryRunner } from 'typeorm';

// 초기 마이그레이션 — users + refresh_tokens 테이블과 인덱스를 한 번에 생성한다
export class InitAuth1714099200000 implements MigrationInterface {
  // 마이그레이션 적용 — users를 먼저 만들고 FK가 있는 refresh_tokens를 이어서 생성
  async up(queryRunner: QueryRunner): Promise<void> {
    // users 테이블 생성
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"           UUID NOT NULL DEFAULT gen_random_uuid(),
        "email"        VARCHAR NOT NULL,
        "passwordHash" VARCHAR NOT NULL,
        "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    // 이메일 유니크 인덱스 — 중복 가입 DB 레벨 방어
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email")
    `);

    // refresh_tokens 테이블 생성 — users.id FK 포함
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
        "userId"      UUID NOT NULL,
        "tokenHash"   CHAR(64) NOT NULL,
        "revokedAt"   TIMESTAMPTZ DEFAULT NULL,
        "expiresAt"   TIMESTAMPTZ NOT NULL,
        "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_refresh_tokens_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_refresh_tokens_userId"
          FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // tokenHash 유니크 인덱스 — refresh 회전 시 단일 행 조회용
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_rt_token_hash" ON "refresh_tokens" ("tokenHash")
    `);
  }

  // 마이그레이션 롤백 — FK 의존 순서를 역으로, refresh_tokens 먼저 삭제
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
