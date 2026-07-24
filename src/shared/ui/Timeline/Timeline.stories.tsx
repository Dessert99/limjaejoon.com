/** Timeline 상태 문서 — 경력(전체 필드)·학력(옵션 없는 최소 항목) 예시 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Timeline } from './Timeline';

const meta = {
  title: 'shared/ui/Timeline',
  component: Timeline,
} satisfies Meta<typeof Timeline>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Career: Story = {
  args: {
    title: '경력',
    items: [
      {
        title: 'PageLabs',
        subtitle: '프리랜서 · 프론트엔드 개발자',
        period: '2025.04 ~ 현재',
        description: 'ERP 서비스 개발',
        stack: ['Next.js', 'React.js'],
      },
    ],
  },
};

export const Education: Story = {
  args: {
    title: '학력',
    items: [
      {
        title: '한국외국어대학교',
        subtitle: '태국학과 · AI & SW 융합전공',
        period: '2023 ~ 2027',
      },
    ],
  },
};
