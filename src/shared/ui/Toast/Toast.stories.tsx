/** Toast 상태 문서 — 버튼으로 알림을 띄운다 (Provider+Viewport는 앱 루트에 한 번) */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Button } from '../Button/Button';
import { Toast } from './Toast';

const meta = { title: 'shared/ui/Toast' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** 데모 — 훅을 쓰려면 render가 아니라 대문자 컴포넌트여야 한다(rules-of-hooks) */
function ToastDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Toast.Provider>
      <Button
        variant='outline'
        onClick={() => {
          setOpen(true);
        }}>
        저장 알림 띄우기
      </Button>
      <Toast.Root
        open={open}
        onOpenChange={setOpen}>
        <Toast.Title>저장됨</Toast.Title>
        <Toast.Description>변경사항이 저장되었습니다.</Toast.Description>
        <Toast.Close asChild>
          <Button variant='ghost'>닫기</Button>
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport />
    </Toast.Provider>
  );
}

export const Default: Story = {
  render: () => {
    return <ToastDemo />;
  },
};
