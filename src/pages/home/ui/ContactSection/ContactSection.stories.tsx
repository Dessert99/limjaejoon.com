/** ContactSection 스토리 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ContactSection } from './ContactSection';

const meta = {
  title: 'Home/ContactSection',
  component: ContactSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '마지막 섹션만 밝게 뒤집어 페이지가 닫히는 느낌을 준다. mailto 가 동작하지 않는 환경을 위해 주소를 눈으로도 읽을 수 있게 남겼다.',
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
} satisfies Meta<typeof ContactSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: 'desktop' } } };
export const Tablet: Story = { globals: { viewport: { value: 'md' } } };
export const Mobile: Story = { globals: { viewport: { value: 'mobile' } } };
export const ReducedMotion: Story = { globals: { motion: 'reduced' } };
