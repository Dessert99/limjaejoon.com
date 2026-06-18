/** DropdownMenu 상태 문서 — 버튼 트리거로 여는 액션 메뉴 (Trigger는 asChild로 Button 합성) */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../Button/Button';
import { DropdownMenu } from './DropdownMenu';

const meta = { title: 'shared/ui/DropdownMenu' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant='outline'>글 관리</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>이 글</DropdownMenu.Label>
          <DropdownMenu.Item>편집</DropdownMenu.Item>
          <DropdownMenu.Item>복제</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>삭제</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  },
};
