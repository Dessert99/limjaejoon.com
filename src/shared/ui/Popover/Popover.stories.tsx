/** Popover 상태 문서 — 클릭으로 여는 비모달 패널, side/align으로 트리거 기준 위치 지정 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Popover } from './Popover';

const meta = { title: 'shared/ui/Popover' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <Popover.Root>
        <Popover.Trigger>알림 설정</Popover.Trigger>
        <Popover.Content>새 글이 올라오면 메일로 알려드릴까요?</Popover.Content>
      </Popover.Root>
    );
  },
};

export const Positioned: Story = {
  render: () => {
    return (
      <Popover.Root>
        <Popover.Trigger>오른쪽에 열기</Popover.Trigger>
        <Popover.Content
          side='right'
          align='start'>
          side·align으로 트리거 기준 위치를 정합니다.
        </Popover.Content>
      </Popover.Root>
    );
  },
};
