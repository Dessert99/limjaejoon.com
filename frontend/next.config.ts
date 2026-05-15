import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import type { NextConfig } from 'next';

const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: {
    mode: 'auto', // Next 버전이 16.0.0 이상일 경우에만 Turbopack 설정을 활성화
  },
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  // next/image는 보안상 화이트리스트 호스트만 허용 — 외부 도메인은 여기에 명시해야 <Image>로 로드 가능
  images: {
    remotePatterns: [
      // 한국관광공사 TourAPI 이미지 — 항목별로 http/https가 섞여 옴(공공 API의 비일관성)이라 두 protocol 모두 허용
      { protocol: 'http', hostname: 'tong.visitkorea.or.kr' },
      { protocol: 'https', hostname: 'tong.visitkorea.or.kr' },
    ],
  },
};

export default withVanillaExtract(nextConfig);
