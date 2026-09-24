import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  // 블로그 홈이던 방이 /library로 옮겨 갔다. 이미 퍼진 /blog 링크와 ?book= 공유 주소를 살린다
  redirects: async () => {
    return [{ source: '/blog', destination: '/library', permanent: true }];
  },
};

export default nextConfig;
