// TypeORM CLI(typeorm-ts-node-commonjs)가 마이그레이션 generate/run 시 사용하는 DataSource — 앱 런타임은 app.module.ts의 forRootAsync 경로를 쓰고 이 파일은 안 거친다
// CLI 컨텍스트엔 NestJS DI 컨테이너가 없어 ConfigService를 주입받을 수 없으므로 dotenv를 직접 로드
import * as dotenv from 'dotenv';
import * as path from 'path';

import { DataSource } from 'typeorm';

// __dirname은 backend/src/database (또는 빌드 후 backend/dist/database) — 어느 쪽에서 실행해도 ../../../.env가 레포 루트의 .env로 해석되도록 절대화
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// CLI와 앱 런타임이 같은 .env 한 곳을 읽도록 동일한 접속 정보로 정의
export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  // entities glob — migration:generate가 entity 변경 사항을 감지해 SQL diff를 만들 때 스캔
  entities: ['src/**/*.entity.ts'],
  // migrations glob — migration:run이 적용할 파일 목록
  migrations: ['src/migrations/*.ts'],
  // synchronize:false — entity 변경이 곧바로 ALTER TABLE로 흘러가는 사고 방지, 모든 스키마 변경은 이 디렉토리의 마이그레이션 파일을 통해서만
  synchronize: false,
});
