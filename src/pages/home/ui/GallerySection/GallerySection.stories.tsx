/** GallerySection 스토리 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GallerySection } from './GallerySection';

const meta = {
  title: 'Home/GallerySection',
  component: GallerySection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'rail 두 줄이 반대로 흐른다. 세로 스크롤 진행률이 가로 이동으로 바뀔 뿐 스크롤을 가로채지 않는다. overflow-x-auto 라 애니메이션이 꺼져도 좌우로 직접 훑을 수 있다 — 감쇠에서 정보가 빠지지 않는다.',
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
} satisfies Meta<typeof GallerySection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: 'desktop' } } };
export const Tablet: Story = { globals: { viewport: { value: 'md' } } };
export const Mobile: Story = { globals: { viewport: { value: 'mobile' } } };
export const ReducedMotion: Story = { globals: { motion: 'reduced' } };
