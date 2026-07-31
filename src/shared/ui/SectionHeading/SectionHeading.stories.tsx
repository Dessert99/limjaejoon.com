/** SectionHeading 스토리 — 한글 줄바꿈과 부품 조립 자유도를 본다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Container } from '../Container/Container';
import { SectionHeading } from './SectionHeading';

// compound 는 args 로 조립이 표현되지 않는다 — component 를 Root 로 두고 본문은 render 가 그린다
const meta = {
  title: 'UI/SectionHeading',
  component: SectionHeading.Root,
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
} satisfies Meta<typeof SectionHeading.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <SectionHeading.Root>
        <SectionHeading.Label>Work</SectionHeading.Label>
        <SectionHeading.Title>선택한 작업</SectionHeading.Title>
        <SectionHeading.Description>
          최근에 만든 것들 가운데 설명할 거리가 있는 것만 골랐다.
        </SectionHeading.Description>
      </SectionHeading.Root>
    );
  },
};

/** 제목만 — 고르지 않은 부품이 여백을 남기지 않아야 한다 */
export const TitleOnly: Story = {
  render: () => {
    return (
      <SectionHeading.Root>
        <SectionHeading.Title>선택한 작업</SectionHeading.Title>
      </SectionHeading.Root>
    );
  },
};

export const LevelThree: Story = {
  render: () => {
    return (
      <SectionHeading.Root>
        <SectionHeading.Label>Work</SectionHeading.Label>
        <SectionHeading.Title level={3}>선택한 작업</SectionHeading.Title>
      </SectionHeading.Root>
    );
  },
};

/** 긴 한글 제목 — 어절 중간에서 끊기지 않는지가 관찰 대상 */
export const LongTitle: Story = {
  render: () => {
    return (
      <SectionHeading.Root>
        <SectionHeading.Label>Work</SectionHeading.Label>
        <SectionHeading.Title>
          브라우저가 이미 할 수 있는 일을 라이브러리 없이 다시 세우기
        </SectionHeading.Title>
        <SectionHeading.Description>
          스크롤 구동 애니메이션과 IntersectionObserver 만으로 어디까지 되는지
          확인하면서, 런타임 패키지를 늘리지 않는 선을 지켰다.
        </SectionHeading.Description>
      </SectionHeading.Root>
    );
  },
};

/** 비대칭 배치 — Introduction 이 실제로 쓰는 조립이다. 슬롯 props 로는 불가능했다 */
export const AsymmetricGrid: Story = {
  render: () => {
    return (
      <SectionHeading.Root className='grid gap-grid-gap md:grid-cols-12'>
        <SectionHeading.Label className='md:col-span-4'>
          About
        </SectionHeading.Label>
        <SectionHeading.Title className='text-statement md:col-span-8'>
          쓰는 사람이 걸리지 않는 화면을 만든다
        </SectionHeading.Title>
      </SectionHeading.Root>
    );
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
  render: () => {
    return (
      <SectionHeading.Root>
        <SectionHeading.Label>Work</SectionHeading.Label>
        <SectionHeading.Title>
          브라우저가 이미 할 수 있는 일을 라이브러리 없이 다시 세우기
        </SectionHeading.Title>
      </SectionHeading.Root>
    );
  },
};

/** 두 surface 에서 라벨·부연의 대비를 같이 본다 — subtle·muted 는 반전 때 가장 얕아진다 */
export const Surfaces: Story = {
  globals: { theme: 'dark' },
  render: () => {
    return (
      <div className='flex flex-col gap-10'>
        <div className='bg-surface p-8'>
          <SectionHeading.Root>
            <SectionHeading.Label>Work</SectionHeading.Label>
            <SectionHeading.Title>선택한 작업</SectionHeading.Title>
            <SectionHeading.Description>
              최근에 만든 것들 가운데 설명할 거리가 있는 것만 골랐다.
            </SectionHeading.Description>
          </SectionHeading.Root>
        </div>
        <div
          className='bg-surface p-8'
          data-surface='light'>
          <SectionHeading.Root>
            <SectionHeading.Label>Work</SectionHeading.Label>
            <SectionHeading.Title>선택한 작업</SectionHeading.Title>
            <SectionHeading.Description>
              최근에 만든 것들 가운데 설명할 거리가 있는 것만 골랐다.
            </SectionHeading.Description>
          </SectionHeading.Root>
        </div>
      </div>
    );
  },
};
