// 초기 인증 스키마 — users + refresh_tokens 두 테이블을 한 번에 만든다. typeorm-ts-node-commonjs CLI가 schema 적용 시 이 파일을 실행
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitAuth1714099200000 implements MigrationInterface {
  // up — migration:run 시 호출. FK가 users를 참조하므로 users 먼저, refresh_tokens 나중 순서가 중요
  async up(queryRunner: QueryRunner): Promise<void> {
    // users 테이블 — gen_random_uuid()는 PostgreSQL 13+ 내장(uuid-ossp 확장 불필요)
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

    // 이메일 유니크 인덱스 — DB 레벨 중복 가입 차단. 동시 INSERT 두 건이 와도 SQLSTATE 23505로 한쪽만 실패
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email")
    `);

    // refresh_tokens 테이블 — JWT의 jti 클레임을 행 식별자로. userId FK + ON DELETE CASCADE로 사용자 삭제 시 토큰도 자동 정리
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
        "userId"      UUID NOT NULL,
        "jti"         UUID NOT NULL,
        "revokedAt"   TIMESTAMPTZ DEFAULT NULL,
        "expiresAt"   TIMESTAMPTZ NOT NULL,
        "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_refresh_tokens_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_refresh_tokens_userId"
          FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // jti 유니크 인덱스 — RefreshTokenStrategy.validate가 jti로 단일 행 조회. 풀스캔 방지 + jti 중복 차단
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_rt_jti" ON "refresh_tokens" ("jti")
    `);
  }

  // down — migration:revert 시 호출. up의 역순(자식 테이블 → 부모 테이블)으로 삭제해야 FK 위반 안 남
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
