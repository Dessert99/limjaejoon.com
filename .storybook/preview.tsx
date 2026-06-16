import '@/shared/styles/global.css';
import { afternoonThemeClass } from '@/shared/styles/theme.css';
import type { Preview } from '@storybook/nextjs-vite'; // TypeScript 타입 체크용

const preview: Preview = {
  decorators: [
    (Story) => {
      document.documentElement.classList.add(afternoonThemeClass);

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
