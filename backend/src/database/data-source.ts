// CLI 컨텍스트(typeorm-ts-node-commonjs)에는 DI 컨테이너가 없으므로 dotenv를 직접 로드 — 루트 .env 단일 소스
import * as dotenv from 'dotenv';
import * as path from 'path';

import { DataSource } from 'typeorm';

// __dirname은 backend/src/database (또는 빌드 후 backend/dist/database) → 어느 쪽이든 ../../../.env가 레포 루트
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// CLI 마이그레이션과 앱 런타임이 같은 .env를 읽도록 정의된 DataSource — 마이그레이션 CLI에서만 import됨
export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  // CLI(typeorm-ts-node-commonjs) 마이그레이션 generate 시 스캔 — 앱 런타임은 autoLoadEntities로 따로 수집
  entities: ['src/**/*.entity.ts'],
  // 마이그레이션 파일 위치
  migrations: ['src/migrations/*.ts'],
  // 스키마 자동 동기화 금지 — 변경은 항상 마이그레이션으로 추적
  synchronize: false,
});
