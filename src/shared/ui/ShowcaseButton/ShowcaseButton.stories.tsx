/** ShowcaseButton 스토리 — fill 이 올라오는 방향과 키보드 포커스에서의 같은 반응을 확인한다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { ShowcaseButton } from './ShowcaseButton';

/** args 에서 href 를 뺀다 — 판별 union 을 그대로 주면 Storybook 의 Args 추론이 never 로 접는다 */
type ShowcaseButtonStoryArgs = ComponentProps<'button'>;

const meta = {
  title: 'UI/ShowcaseButton',
  component: ShowcaseButton,
  decorators: [
    (Story) => {
      return (
        <div className='bg-background p-10 text-foreground'>
          <Story />
        </div>
      );
    },
  ],
  args: { children: '프로젝트 전체 보기' },
} satisfies Meta<ShowcaseButtonStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AsLink: Story = {
  render: () => {
    return (
      <ShowcaseButton href='mailto:dessert99@pagelab.site'>
        메일 보내기
      </ShowcaseButton>
    );
  },
};

/** Tab 으로 들어와도 hover 와 같은 fill 이 올라와야 한다 */
export const Keyboard: Story = {
  render: (args) => {
    return (
      <div className='flex flex-col items-start gap-4'>
        <p className='text-body-sm text-subtle'>
          Tab 을 눌러 두 버튼을 차례로 지나가 본다.
        </p>
        <div className='flex gap-4'>
          <ShowcaseButton {...args} />
          <ShowcaseButton href='#work'>링크 역할</ShowcaseButton>
        </div>
      </div>
    );
  },
};

/** 긴 라벨에서도 fill 이 라벨을 넘어가거나 모자라지 않아야 한다 */
export const LongLabel: Story = {
  args: {
    children: '지금까지 만든 프로젝트를 한 번에 훑어보기',
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** 두 surface 에서 fill 색과 라벨 대비를 같이 본다 */
export const Surfaces: Story = {
  globals: { surface: 'dark' },
  parameters: { layout: 'fullscreen' },
  render: (args) => {
    return (
      <div className='grid md:grid-cols-2'>
        <div className='bg-surface p-10'>
          <ShowcaseButton {...args} />
        </div>
        <div
          className='bg-surface p-10'
          data-surface='light'>
          <ShowcaseButton {...args} />
        </div>
      </div>
    );
  },
};
