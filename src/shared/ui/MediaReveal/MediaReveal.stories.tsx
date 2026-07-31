/** MediaReveal 스토리 — 스크롤이 트리거라 상자 안에서 굴린다(Effect 스토리와 같은 무대) */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { Media } from '../Media/Media';
import { MediaReveal } from './MediaReveal';

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
  title: 'Effect/MediaReveal',
  component: MediaReveal,
  parameters: {
    docs: {
      description: {
        component:
          '덮개(clip-path)가 아래로 열리는 동안 안쪽 미디어(scale)가 제자리로 조여든다. 두 프로퍼티를 서로 다른 층이 나눠 가져서, 나중에 Parallax 가 translate 를 얹어도 앞의 것을 덮지 않는다. 마스크 타이밍과 스케일 배율은 **실물 에셋이 들어온 뒤** 확정한다 — 지금은 자리표시로 기구만 확인한다.',
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
        <MediaReveal {...args} />
      </ScrollStage>
    );
  },
  args: {
    // 왕복하며 몇 번이고 봐야 마스크 속도를 판단할 수 있다
    once: false,
    children: (
      <Media
        src={null}
        alt='자리표시'
        ratio='gallery'
      />
    ),
  },
} satisfies Meta<typeof MediaReveal>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 볼 것 — 덮개가 열리는 속도, 안쪽이 조여드는 정도, 둘의 시작이 어긋나지 않는지 */
export const Default: Story = {};

/** 실물 이미지 — 자리표시로는 scale 이 안 보인다. 무늬가 있어야 조여드는 게 눈에 띈다 */
export const WithImage: Story = {
  args: {
    children: (
      <Media
        src='/images/logo.png'
        alt='사이트 로고'
        ratio='gallery'
      />
    ),
  },
};

/** 운영 기본값 — 한 번 열리면 끝이다 */
export const Once: Story = {
  args: { once: true },
};

/** 여러 장이 순서대로 — Gallery 와 Work Index 가 이 배수를 쓴다 */
export const Staggered: Story = {
  render: (args) => {
    return (
      <ScrollStage>
        <div className='flex flex-col gap-4'>
          {[0, 1, 2].map((index) => {
            return (
              <MediaReveal
                key={index}
                {...args}
                staggerIndex={index}
              />
            );
          })}
        </div>
      </ScrollStage>
    );
  },
};

/** 감쇠 — 굴려도 덮개가 열린 채 제자리에 있어야 하고, 이미지가 사라지면 안 된다 */
export const ReducedMotion: Story = {
  globals: { motion: 'reduced' },
};
