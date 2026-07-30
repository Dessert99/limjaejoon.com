/** Marquee 스토리 — 이음매·속도·정지가 관찰 대상이다. 툴바 Motion=Reduced 로도 멈춰야 한다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Marquee } from './Marquee';

const meta = {
  title: 'Effect/Marquee',
  component: Marquee,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => {
      return (
        <div className='bg-background py-section-sm text-foreground'>
          <Story />
        </div>
      );
    },
  ],
  args: {
    children: (
      <span className='text-project'>임재준 · Frontend Engineer ·</span>
    ),
  },
} satisfies Meta<typeof Marquee>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Rightward: Story = {
  args: { direction: 'right' },
};

export const Speeds: Story = {
  render: (args) => {
    return (
      <div className='flex flex-col gap-6'>
        {(['slow', 'normal', 'fast'] as const).map((speed) => {
          return (
            <Marquee
              key={speed}
              {...args}
              speed={speed}
            />
          );
        })}
      </div>
    );
  },
};

/** 두 줄이 반대로 흐르는 배치 — 5단계 Gallery 가 쓸 형태다 */
export const OppositeRows: Story = {
  render: (args) => {
    return (
      <div className='flex flex-col gap-6'>
        <Marquee {...args} />
        <Marquee
          {...args}
          direction='right'
        />
      </div>
    );
  },
};

/** 짧은 콘텐츠 — 한 벌이 화면보다 좁으면 이음매 사이에 빈 구간이 보인다 */
export const ShortContent: Story = {
  args: { children: <span className='text-body-lg'>짧다 ·</span> },
};

export const Paused: Story = {
  args: { paused: true },
};

/** 감쇠에서는 정지해야 한다 — 무한 애니메이션이 계속 도는 게 가장 큰 접근성 실패다 */
export const ReducedMotion: Story = {
  globals: { motion: 'reduced' },
};
