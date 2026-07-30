/** MaskReveal 스토리 — 트리거가 스크롤이라 무대가 필요하다. 페이지 대신 상자를 굴려 반복해서 본다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { MaskReveal } from './MaskReveal';

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
  title: 'Effect/MaskReveal',
  component: MaskReveal,
  parameters: {
    docs: {
      description: {
        component:
          '바깥 트랙이 overflow 를, 안쪽 층이 translate 를 소유한다. 안쪽이 트랙 아래에 내려가 있다가 제자리로 올라오면서 잘려 있던 글자가 드러난다. duration·easing 은 CSS 가 단독 소유하므로 수치를 바꾸려면 MaskReveal.tsx 의 `duration-slow`·`ease-reveal` 을 고치고 HMR 로 이 상자를 다시 굴린다.',
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
        <MaskReveal {...args} />
      </ScrollStage>
    );
  },
  args: {
    // 스토리 기본을 once=false 로 둔다 — 왕복하며 몇 번이고 다시 봐야 타이밍을 판단할 수 있다
    once: false,
    className: 'text-statement',
    children: '가려졌다가 아래에서 올라온다',
  },
} satisfies Meta<typeof MaskReveal>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 볼 것 — 올라오는 속도, 도착 직전 감속(ease-reveal), 글자 윗동이 미리 비치지 않는지 */
export const Default: Story = {};

/** 운영 기본값 — 한 번 등장하면 끝이다. 되감아도 다시 숨지 않는 걸 확인한다 */
export const Once: Story = {
  args: { once: true },
};

/** 디센더 — 트랙 테두리(outline) 아래로 g·j·p·q·y 꼬리가 잘리지 않아야 한다 */
export const Descenders: Story = {
  args: {
    className: 'text-section outline outline-border-strong',
    children: 'Typography gjpqy',
  },
};

/** 크기 클래스는 MaskReveal 에 건다 — 오버행이 em 기준이라 자식에 걸면 잘린다 */
export const Hero: Story = {
  args: {
    className: 'text-hero',
    children: '임재준',
  },
};

/** 순서 있는 등장 — 네 줄이 같은 순간에 들어오지만 배수만큼 늦게 출발한다 */
export const Staggered: Story = {
  render: (args) => {
    return (
      <ScrollStage>
        <div className='flex flex-col gap-4'>
          {['첫 번째', '두 번째', '세 번째', '네 번째'].map((label, index) => {
            return (
              <MaskReveal
                key={label}
                {...args}
                staggerIndex={index}>
                {label}
              </MaskReveal>
            );
          })}
        </div>
      </ScrollStage>
    );
  },
};

/** 감쇠 — 굴려도 움직임 없이 제자리에 있어야 하고, 글자가 사라지면 안 된다 */
export const ReducedMotion: Story = {
  globals: { motion: 'reduced' },
};
