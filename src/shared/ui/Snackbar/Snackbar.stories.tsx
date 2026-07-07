/** Snackbar 상태 문서 — 짧은 결과 피드백과 optional action */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Button } from '../Button/Button';
import { Snackbar } from './Snackbar';

const meta = { title: 'shared/ui/Snackbar' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** 데모 — 훅을 쓰려면 render가 아니라 대문자 컴포넌트여야 한다(rules-of-hooks) */
function SnackbarDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Snackbar.Provider>
      <Button
        variant='neutralOutline'
        onClick={() => {
          setOpen(true);
        }}>
        저장 알림 띄우기
      </Button>
      <Snackbar.Root
        open={open}
        onOpenChange={setOpen}
        message='변경사항이 저장되었습니다.'
        actionLabel='되돌리기'
        onAction={() => {
          setOpen(false);
        }}
      />
      <Snackbar.Viewport />
    </Snackbar.Provider>
  );
}

export const Default: Story = {
  render: () => {
    return <SnackbarDemo />;
  },
};
