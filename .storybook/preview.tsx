import type { Preview } from '@storybook/nextjs-vite';
import '@/shared/styles/global.css';
import { defaultThemeClass } from '@/shared/styles/theme.css';

const preview: Preview = {
  decorators: [
    (Story) => {
      document.documentElement.classList.add(defaultThemeClass);

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
      codePanel: true,
    },
  },
};

export default preview;
