/** Toggle 상태 문서 — 기본, 눌림 기본값, 비활성 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Toggle } from './Toggle';

const meta = {
  title: 'shared/ui/Toggle',
  component: Toggle,
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'B', 'aria-label': '굵게' } };

export const Pressed: Story = {
  args: { children: 'B', 'aria-label': '굵게', defaultPressed: true },
};

export const Disabled: Story = {
  args: { children: 'B', 'aria-label': '굵게', disabled: true },
};
