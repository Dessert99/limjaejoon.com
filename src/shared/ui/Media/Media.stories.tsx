/** Media 스토리 — 실물 에셋이 없으므로 비율과 자리표시가 관찰 대상이다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Container } from '../Container/Container';
import { Media } from './Media';

const meta = {
  title: 'UI/Media',
  component: Media,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'aspect-ratio 와 object-fit 만 소유한다. transform·clip-path 는 MediaReveal 몫이라 한 엘리먼트가 둘을 같이 잡지 않는다. src 가 null 이면 비율만 맞춘 자리표시를 그린다 — 에셋 확보 전 레이아웃을 잡기 위한 상태다.',
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <div className='bg-background py-10 text-foreground'>
          <Container>
            <Story />
          </Container>
        </div>
      );
    },
  ],
  args: {
    src: null,
    alt: '아직 들어오지 않은 이미지',
    ratio: 'thumbnail',
  },
} satisfies Meta<typeof Media>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 자리표시 — 실물이 들어오면 src 만 채우고 레이아웃은 그대로다 */
export const Placeholder: Story = {};

/** 세 비율을 나란히 — 전부 가로다. 세로가 섞이면 Work Index 와 Gallery 높이가 통째로 흔들린다 */
export const Ratios: Story = {
  render: (args) => {
    return (
      <div className='flex flex-col gap-6'>
        {(['hero', 'thumbnail', 'gallery'] as const).map((ratio) => {
          return (
            <div key={ratio}>
              <p className='mb-2 text-label text-subtle uppercase'>{ratio}</p>
              <Media
                {...args}
                ratio={ratio}
              />
            </div>
          );
        })}
      </div>
    );
  },
};

/** 실물 이미지 — 저장소에 있는 유일한 에셋으로 object-cover 크롭을 확인한다 */
export const WithImage: Story = {
  args: {
    src: '/images/logo.png',
    alt: '사이트 로고',
    ratio: 'gallery',
  },
};

/** Work Index 그리드 가정 — 썸네일이 나란히 설 때 높이가 맞는지 */
export const ThumbnailGrid: Story = {
  render: (args) => {
    return (
      <div className='grid gap-grid-gap md:grid-cols-2'>
        {['첫째', '둘째', '셋째', '넷째'].map((label) => {
          return (
            <Media
              key={label}
              {...args}
              alt={`${label} 프로젝트 대표 이미지`}
              sizes='(min-width: 48rem) 50vw, 100vw'
            />
          );
        })}
      </div>
    );
  },
};
