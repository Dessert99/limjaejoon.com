import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Dialog } from './Dialog';

// 제목·설명·닫기 버튼을 갖춘 다이얼로그 — 동작 검증용 공통 마크업
function renderDialog() {
  return render(
    <Dialog.Root>
      <Dialog.Trigger>열기</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>글 삭제</Dialog.Title>
        <Dialog.Description>이 작업은 되돌릴 수 없습니다.</Dialog.Description>
        <Dialog.Close>닫기</Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
}

describe('Dialog', () => {
  it('트리거를 클릭하면 제목·설명이 aria로 연결된 다이얼로그가 열린다', async () => {
    renderDialog();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '열기' }));

    const dialog = screen.getByRole('dialog', { name: '글 삭제' });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAccessibleDescription('이 작업은 되돌릴 수 없습니다.');
  });

  it('Close 버튼을 누르면 닫힌다', async () => {
    renderDialog();

    await userEvent.click(screen.getByRole('button', { name: '열기' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '닫기' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('Esc 키를 누르면 닫힌다', async () => {
    renderDialog();

    await userEvent.click(screen.getByRole('button', { name: '열기' }));
    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
