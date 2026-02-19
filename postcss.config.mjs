// PostCSS 플러그인 구성을 한곳에서 관리합니다.
const config = {
  // Tailwind v4 PostCSS 플러그인을 활성화합니다.
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

// 빌드 단계에서 사용할 PostCSS 설정을 내보냅니다.
export default config;
