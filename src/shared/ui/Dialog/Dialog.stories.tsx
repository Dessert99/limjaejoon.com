/** Dialog 상태 문서 — 트리거로 여는 모달, 포커스 트랩·스크롤 잠금은 Radix가 (Trigger/Close는 asChild로 Button) */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../Button/Button';
import { Dialog } from './Dialog';

const meta = { title: 'shared/ui/Dialog' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant='outline'>글 삭제</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>글을 삭제할까요?</Dialog.Title>
          <Dialog.Description>
            삭제한 글은 복구할 수 없습니다.
          </Dialog.Description>
          <Dialog.Close asChild>
            <Button variant='solid'>삭제</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    );
  },
};
