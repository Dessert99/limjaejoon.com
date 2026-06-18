/** HoverCard 상태 문서 — 링크에 hover/focus하면 뜨는 보조 정보 카드, openDelay로 지연 조절 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HoverCard } from './HoverCard';

const meta = { title: 'shared/ui/HoverCard' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <HoverCard.Root>
        <HoverCard.Trigger href='https://github.com/Dessert99'>
          @Dessert99
        </HoverCard.Trigger>
        <HoverCard.Content>
          임재준 · 프론트엔드를 배우는 백엔드 개발자
        </HoverCard.Content>
      </HoverCard.Root>
    );
  },
};

export const Instant: Story = {
  render: () => {
    return (
      <HoverCard.Root openDelay={0}>
        <HoverCard.Trigger href='https://github.com/Dessert99'>
          지연 없이 열기
        </HoverCard.Trigger>
        <HoverCard.Content>openDelay=0이면 즉시 펼쳐집니다.</HoverCard.Content>
      </HoverCard.Root>
    );
  },
};
