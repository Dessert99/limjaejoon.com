/** Button 스토리 — variant×size 조합과 링크/버튼 역할 분기를 눈으로 확인한다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { Button, type ButtonStyleProps } from './Button';

/** args 에서 href 를 뺀다 — 판별 union 을 그대로 주면 Storybook 의 Args 추론이 never 로 접는다 */
type ButtonStoryArgs = ComponentProps<'button'> & ButtonStyleProps;

const meta = {
  title: 'UI/Button',
  component: Button,
  decorators: [
    (Story) => {
      return (
        <div className='bg-background p-10 text-foreground'>
          <Story />
        </div>
      );
    },
  ],
  args: { children: '프로젝트 보기' },
} satisfies Meta<ButtonStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const Sizes: Story = {
  render: (args) => {
    return (
      <div className='flex flex-wrap items-center gap-4'>
        <Button
          {...args}
          size='sm'
        />
        <Button
          {...args}
          size='md'
        />
        <Button
          {...args}
          size='sm'
          variant='outline'
        />
        <Button
          {...args}
          size='md'
          variant='outline'
        />
      </div>
    );
  },
};

/** href 가 있으면 role 이 link 가 된다 — 키보드 Enter 동작과 스크린리더 안내가 달라진다 */
export const AsLink: Story = {
  render: () => {
    return (
      <div className='flex flex-wrap items-center gap-4'>
        <Button href='#work'>프로젝트 보기</Button>
        <Button
          href='#work'
          variant='outline'>
          프로젝트 보기
        </Button>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** 두 surface 에서 accent 대비를 같이 본다 — outline 은 반전 때 테두리가 가장 얕아진다 */
export const Surfaces: Story = {
  globals: { surface: 'dark' },
  parameters: { layout: 'fullscreen' },
  render: (args) => {
    return (
      <div className='grid md:grid-cols-2'>
        <div className='flex gap-4 bg-surface p-10'>
          <Button {...args} />
          <Button
            {...args}
            variant='outline'
          />
        </div>
        <div
          className='flex gap-4 bg-surface p-10'
          data-surface='light'>
          <Button {...args} />
          <Button
            {...args}
            variant='outline'
          />
        </div>
      </div>
    );
  },
};
