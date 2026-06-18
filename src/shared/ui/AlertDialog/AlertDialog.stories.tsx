/** AlertDialog 상태 문서 — 바깥클릭으로 안 닫히고 취소/삭제 선택을 강제하는 확인 모달 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../Button/Button';
import { AlertDialog } from './AlertDialog';

const meta = { title: 'shared/ui/AlertDialog' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <Button variant='outline'>글 삭제</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>정말 삭제할까요?</AlertDialog.Title>
          <AlertDialog.Description>
            삭제한 글은 복구할 수 없습니다.
          </AlertDialog.Description>
          <AlertDialog.Cancel asChild>
            <Button variant='ghost'>취소</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button variant='solid'>삭제</Button>
          </AlertDialog.Action>
        </AlertDialog.Content>
      </AlertDialog.Root>
    );
  },
};
