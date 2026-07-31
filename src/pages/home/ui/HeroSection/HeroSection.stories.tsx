/** HeroSection 스토리 — 등장은 로드 시점이라 새로고침(스토리 전환)해야 다시 본다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeroSection } from './HeroSection';

const meta = {
  title: 'Home/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '등장 트리거가 뷰포트가 아니라 **로드**다. Hero 는 늘 화면 맨 위라 IntersectionObserver 로는 곧장 in 이 보고돼 아무 일도 일어나지 않는다. CSS 애니메이션이라 JS 상태가 없고, 스크립트가 죽어도 최종 위치에 선다. 배경 미디어는 실물 에셋이 없어 자리표시다.',
      },
    },
  },
} satisfies Meta<typeof HeroSection>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 볼 것 — 보조문 → 제목 → 지역 순서, 제목이 화면을 넘치지 않는지 */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
};

export const Tablet: Story = {
  globals: { viewport: { value: 'md' } },
};

/** text-hero 가 clamp 하한(3.5rem)으로 내려온다 — 여기서 제목이 세 줄이 되면 문구를 줄인다 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
};

/** 감쇠 — 애니메이션이 꺼져 처음부터 최종 위치에 있어야 하고, 글자가 사라지면 안 된다 */
export const ReducedMotion: Story = {
  globals: { motion: 'reduced' },
};
