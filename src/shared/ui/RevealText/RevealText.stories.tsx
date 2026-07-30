/** RevealText 스토리 — 트리거가 스크롤이라 무대가 필요하다. 페이지 대신 상자를 굴려 반복해서 본다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { RevealText } from './RevealText';

/** 상자 안에서만 스크롤한다 — 화면 안에서 시작하면 관찰자가 곧장 in 으로 보고해 등장이 아예 없다 */
function ScrollStage({ children }: { children: ReactNode }) {
  return (
    <div className='h-80 overflow-y-auto rounded-lg border border-border bg-surface'>
      <div className='flex h-full items-end justify-center pb-4'>
        <p className='text-body-sm text-subtle'>이 상자 안에서 스크롤 ↓</p>
      </div>
      <div className='px-6'>{children}</div>
      <div className='h-full' />
    </div>
  );
}

const meta = {
  title: 'Effect/RevealText',
  component: RevealText,
  parameters: {
    docs: {
      description: {
        component:
          '문장을 줄·어절·글자로 쪼개 조각마다 마스크를 씌우고 배수만큼 늦게 출발시킨다. 조각은 전부 aria-hidden 이고 원문은 sr-only 사본이 한 번만 읽힌다. stagger 간격은 CSS 의 `--ds-duration-100` 배수라 수치를 바꾸려면 motion.css 의 `stagger-delay` 를 고친다.',
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <div className='bg-background p-6 text-foreground'>
          <Story />
        </div>
      );
    },
  ],
  render: (args) => {
    return (
      <ScrollStage>
        <RevealText {...args} />
      </ScrollStage>
    );
  },
  args: {
    // 왕복하며 몇 번이고 다시 봐야 조각 간격을 판단할 수 있다
    once: false,
    className: 'text-statement',
    children: '브라우저가 이미 할 수 있는 일을\n라이브러리 없이 다시 세운다',
  },
} satisfies Meta<typeof RevealText>;

export default meta;

type Story = StoryObj<typeof meta>;

/** line — 개행 기준. 실제 줄바꿈 위치가 아니라 작성자가 나눈 줄이다 */
export const Line: Story = {};

/** word — 볼 것: 조각 간격이 지루하거나 뭉치지 않는지 */
export const Word: Story = {
  args: { unit: 'word' },
};

/** character — 조각 사이에 줄바꿈 기회가 없다. 한 줄에 들어가는 문구에만 쓴다 */
export const Character: Story = {
  args: { unit: 'character', className: 'text-hero', children: '임재준' },
};

/** 긴 한글 문장 — 어절 줄바꿈이 자연스러운지, 마지막 조각이 하염없이 밀리지 않는지 */
export const LongKorean: Story = {
  args: {
    unit: 'word',
    className: 'text-body-lg',
    children:
      '스크롤 구동 애니메이션과 IntersectionObserver 만으로 어디까지 되는지 확인하면서 런타임 패키지를 늘리지 않는 선을 지켰다. 브라우저가 이미 하는 일을 다시 만들지 않는 것이 목표다.',
  },
};

/** 좁은 폭 — character 가 왜 짧은 문구 전용인지 여기서 드러난다 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
  args: { unit: 'word' },
};

/** 감쇠 — 굴려도 움직임 없이 제자리에 있어야 하고, 글자가 사라지면 안 된다 */
export const ReducedMotion: Story = {
  globals: { motion: 'reduced' },
  args: { unit: 'word' },
};
