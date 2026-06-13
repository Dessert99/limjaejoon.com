import type { Preview } from '@storybook/nextjs-vite';
import { useEffect } from 'react';
import '@/shared/styles/global.css';
import {
  seasonMeta,
  seasonThemes,
  type Season,
} from '@/shared/styles/themes/index.css';

const seasonOptions = Object.keys(seasonThemes) as Season[];

function getSeason(value: unknown): Season {
  return seasonOptions.includes(value as Season) ? (value as Season) : 'spring';
}

const preview: Preview = {
  globalTypes: {
    season: {
      description: 'Preview season theme',
      defaultValue: 'spring',
      toolbar: {
        title: 'Season',
        icon: 'paintbrush',
        items: seasonOptions.map((season) => {
          return {
            value: season,
            title: seasonMeta[season].ko,
          };
        }),
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const season = getSeason(context.globals.season);

      useEffect(() => {
        const root = document.documentElement;

        Object.values(seasonThemes).forEach((className) => {
          root.classList.remove(className);
        });
        root.classList.add(seasonThemes[season]);

        return () => {
          root.classList.remove(seasonThemes[season]);
        };
      }, [season]);

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
