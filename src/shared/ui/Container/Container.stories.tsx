/** Container 스토리 — 폭 경계가 눈에 보여야 하므로 배경과 테두리를 깔고 전시한다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Container } from './Container';

const meta = {
  title: 'UI/Container',
  component: Container,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => {
      return (
        <div className='min-h-svh bg-background py-10 text-foreground'>
          <Story />
        </div>
      );
    },
  ],
  args: {
    children: (
      <div className='rounded-md bg-surface p-6'>
        <p className='text-body'>이 블록의 좌우 끝이 컨테이너 경계다.</p>
      </div>
    ),
  },
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Wide: Story = {
  args: { size: 'wide' },
};

/** bleed-gutter — 컨테이너 안에 있으면서 좌우 gutter 만 되짚어 나가는 자식 */
export const Bleed: Story = {
  args: {
    children: (
      <>
        <p className='text-body'>위: 일반 자식</p>
        <div className='bleed-gutter my-4 bg-accent p-6 text-accent-foreground'>
          bleed-gutter — gutter 폭만큼 좌우로 넓어진다
        </div>
        <p className='text-body'>아래: 일반 자식</p>
      </>
    ),
  },
};

/** 좁은 폭에서 gutter 가 콘텐츠를 화면 끝에 붙이지 않는지 본다 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
};
