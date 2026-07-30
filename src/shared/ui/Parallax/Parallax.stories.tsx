/** Parallax 스토리 — view timeline 은 가장 가까운 스크롤 영역을 본다. 상자가 그 역할을 겸한다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { Parallax } from './Parallax';

/** 상자 자체가 스크롤 영역이라 animation-timeline: view() 가 이 상자를 기준으로 돈다 */
function ScrollStage({ children }: { children: ReactNode }) {
  return (
    <div className='h-80 overflow-y-auto rounded-lg border border-border bg-surface'>
      <div className='flex h-full items-end justify-center pb-4'>
        <p className='text-body-sm text-subtle'>
          이 상자 안에서 천천히 스크롤 ↓
        </p>
      </div>
      <div className='px-6'>{children}</div>
      <div className='h-full' />
    </div>
  );
}

const meta = {
  title: 'Effect/Parallax',
  component: Parallax,
  parameters: {
    docs: {
      description: {
        component:
          '스크롤 위치에 연속으로 물리는 층이라 JS 가 없다. 요소가 스크롤 영역을 통과하는 동안 CSS view timeline 이 translate 를 이어서 움직인다. 등장(reveal)과 달리 되감으면 같이 되감긴다.',
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
        <Parallax {...args} />
      </ScrollStage>
    );
  },
  args: {
    children: (
      <p className='rounded-md bg-surface-raised p-10 text-statement'>
        느리게 따라오는 층
      </p>
    ),
  },
} satisfies Meta<typeof Parallax>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 본문 텍스트에 허용되는 유일한 강도 */
export const Subtle: Story = {
  args: { strength: 'subtle' },
};

export const Normal: Story = {};

export const Strong: Story = {
  args: { strength: 'strong' },
};

/** 세 강도를 나란히 굴린다 — 어느 정도가 어지러운지는 비교해야 판단된다 */
export const Compared: Story = {
  render: (args) => {
    return (
      <div className='grid gap-4 md:grid-cols-3'>
        {(['subtle', 'normal', 'strong'] as const).map((strength) => {
          return (
            <div key={strength}>
              <p className='mb-2 text-label text-subtle uppercase'>
                {strength}
              </p>
              <ScrollStage>
                <Parallax
                  {...args}
                  strength={strength}
                />
              </ScrollStage>
            </div>
          );
        })}
      </div>
    );
  },
};

/** 오버스캔 — 부모가 overflow-hidden, 자식이 부모보다 커야 이동한 쪽 끝에 빈 띠가 생기지 않는다 */
export const OverscannedMedia: Story = {
  render: () => {
    return (
      <ScrollStage>
        <div className='relative h-48 overflow-hidden rounded-lg'>
          <Parallax
            strength='strong'
            className='absolute inset-x-0 -inset-y-10'>
            <div className='h-full bg-accent' />
          </Parallax>
        </div>
      </ScrollStage>
    );
  },
};

/** 감쇠 — 이동이 0 이어야 한다. 밀린 채 굳으면 레이아웃이 어긋난 것처럼 보인다 */
export const ReducedMotion: Story = {
  globals: { motion: 'reduced' },
  args: { strength: 'strong' },
};
