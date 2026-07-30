/** SectionHeading 스토리 — 한글 줄바꿈과 긴 제목에서 계층이 무너지지 않는지 본다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Container } from '../Container/Container';
import { SectionHeading } from './SectionHeading';

const meta = {
  title: 'UI/SectionHeading',
  component: SectionHeading,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => {
      return (
        <div className='min-h-svh bg-background py-10 text-foreground'>
          <Container>
            <Story />
          </Container>
        </div>
      );
    },
  ],
  args: {
    label: 'Work',
    title: '선택한 작업',
    description: '최근에 만든 것들 가운데 설명할 거리가 있는 것만 골랐다.',
  },
} satisfies Meta<typeof SectionHeading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 제목만 — label·description 이 없을 때 여백이 남지 않아야 한다 */
export const TitleOnly: Story = {
  args: { label: undefined, description: undefined },
};

export const LevelThree: Story = {
  args: { level: 3 },
};

/** 긴 한글 제목 — 어절 중간에서 끊기지 않는지가 관찰 대상 */
export const LongTitle: Story = {
  args: {
    title: '브라우저가 이미 할 수 있는 일을 라이브러리 없이 다시 세우기',
    description:
      '스크롤 구동 애니메이션과 IntersectionObserver 만으로 어디까지 되는지 확인하면서, 런타임 패키지를 늘리지 않는 선을 지켰다.',
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
  args: {
    title: '브라우저가 이미 할 수 있는 일을 라이브러리 없이 다시 세우기',
  },
};

/** 두 surface 에서 label·description 의 대비를 같이 본다 — subtle·muted 는 반전 때 가장 얕아진다 */
export const Surfaces: Story = {
  globals: { theme: 'dark' },
  render: (args) => {
    return (
      <div className='flex flex-col gap-10'>
        <div className='bg-surface p-8'>
          <SectionHeading {...args} />
        </div>
        <div
          className='bg-surface p-8'
          data-surface='light'>
          <SectionHeading {...args} />
        </div>
      </div>
    );
  },
};
