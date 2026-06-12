import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import type { StorybookConfig } from '@storybook/nextjs-vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

const storybookDir = fileURLToPath(new URL('.', import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    return mergeConfig(config, {
      plugins: [vanillaExtractPlugin()],
      resolve: {
        alias: {
          '@': resolve(storybookDir, '../src'),
        },
      },
    });
  },
};

export default config;
