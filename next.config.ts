import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import type { NextConfig } from 'next';

const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: {
    mode: 'auto', // Next 버전이 16.0.0 이상일 경우에만 Turbopack 설정을 활성화
  },
});

const nextConfig: NextConfig = {};

export default withVanillaExtract(nextConfig);
