import '@/shared/styles/global.css';
import type { Preview } from '@storybook/nextjs-vite'; // TypeScript 타입 체크용

const preview: Preview = {
  decorators: [
    (Story) => {
      // 앱 기본값과 같은 dark 테마를 Storybook iframe 에도 명시한다
      document.documentElement.dataset.theme = 'dark';

      return <Story />;
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      codePanel: true, // 코드 패널 켜기
    },
  },
};

export default preview;
