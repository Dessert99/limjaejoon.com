/** IntroductionSection 스토리 — 밝은 섹션이라 대비 확인이 이 섹션의 핵심 축이다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IntroductionSection } from './IntroductionSection';

const meta = {
  title: 'Home/IntroductionSection',
  component: IntroductionSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '`data-surface="light"` 로 밝게 뒤집는 섹션이다. 컴포넌트는 자기가 밝은 곳에 있는지 모르고 `bg-surface text-foreground` 만 쓴다. 등장이 뷰포트 트리거라 **스크롤해서 들어와야** 보인다 — 위쪽 여백을 지나 아래로 굴린다.',
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <div className='bg-background text-foreground'>
          <div className='flex h-svh items-end justify-center pb-12'>
            <p className='text-body-sm text-subtle'>아래로 스크롤 ↓</p>
          </div>
          <Story />
          <div className='h-svh' />
        </div>
      );
    },
  ],
} satisfies Meta<typeof IntroductionSection>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 볼 것 — 라벨 4 / 본문 8 비대칭이 어색하지 않은지, 어절 등장 간격 */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
};

export const Tablet: Story = {
  globals: { viewport: { value: 'md' } },
};

/** 단일 열로 떨어진다 — 라벨이 본문 위에 얹히는 모양이 자연스러운지 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
};

/** 대비 — a11y 패널에서 muted·subtle 이 밝은 배경 위에서 기준을 넘는지 확인한다 */
export const Contrast: Story = {
  globals: { viewport: { value: 'desktop' } },
};

export const ReducedMotion: Story = {
  globals: { motion: 'reduced' },
};
