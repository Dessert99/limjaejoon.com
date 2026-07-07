/** Divider 상태 문서 — 가로, 세로, inset */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Divider } from './Divider';

const meta = {
  title: 'shared/ui/Divider',
  component: Divider,
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => {
    return (
      <div style={{ width: 240 }}>
        <p>위 문단</p>
        <Divider />
        <p>아래 문단</p>
      </div>
    );
  },
};

export const Vertical: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '0.75rem', height: 24 }}>
        <span>홈</span>
        <Divider
          as='div'
          role='separator'
          orientation='vertical'
        />
        <span>소개</span>
      </div>
    );
  },
};

export const Inset: Story = {
  render: () => {
    return (
      <div style={{ width: 280 }}>
        <p>그룹 안 콘텐츠</p>
        <Divider inset />
        <p>같은 그룹의 다음 콘텐츠</p>
      </div>
    );
  },
};
