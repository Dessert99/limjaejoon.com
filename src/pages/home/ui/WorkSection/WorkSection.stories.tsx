/** WorkSection 스토리 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { WorkSection } from './WorkSection';

const meta = {
  title: 'Home/WorkSection',
  component: WorkSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Work Index — hover 없이도 설명·기여가 늘 보인다. 커서 추적 preview 를 쓰지 않는 이유다. 제목 길이가 2·4·8·17자로 흩어져 있어 긴 제목이 레이아웃을 깨는지가 이 섹션의 관찰 대상이다.',
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
} satisfies Meta<typeof WorkSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: 'desktop' } } };
export const Tablet: Story = { globals: { viewport: { value: 'md' } } };
export const Mobile: Story = { globals: { viewport: { value: 'mobile' } } };
export const ReducedMotion: Story = { globals: { motion: 'reduced' } };
