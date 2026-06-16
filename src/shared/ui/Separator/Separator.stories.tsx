/** Separator 상태 문서 — 가로, 세로 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Separator } from './Separator';

const meta = {
  title: 'shared/ui/Separator',
  component: Separator,
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <p>위 문단</p>
      <Separator />
      <p>아래 문단</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', height: 24 }}>
      <span>홈</span>
      <Separator orientation='vertical' />
      <span>소개</span>
    </div>
  ),
};
