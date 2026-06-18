import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AlertDialog } from './AlertDialog';

// 취소·확인을 강제하는 확인 대화 — 동작 검증용 공통 마크업
function renderAlert(onAction?: () => void) {
  return render(
    <AlertDialog.Root>
      <AlertDialog.Trigger>글 삭제</AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>정말 삭제할까요?</AlertDialog.Title>
        <AlertDialog.Description>되돌릴 수 없습니다.</AlertDialog.Description>
        <AlertDialog.Cancel>취소</AlertDialog.Cancel>
        <AlertDialog.Action onClick={onAction}>삭제</AlertDialog.Action>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

describe('AlertDialog', () => {
  it('트리거를 클릭하면 alertdialog가 열리고 Cancel에 기본 포커스가 간다', async () => {
    renderAlert();

    await userEvent.click(screen.getByRole('button', { name: '글 삭제' }));

    const dialog = screen.getByRole('alertdialog', {
      name: '정말 삭제할까요?',
    });
    expect(dialog).toHaveAccessibleDescription('되돌릴 수 없습니다.');
    expect(screen.getByRole('button', { name: '취소' })).toHaveFocus();
  });

  it('Cancel을 누르면 닫힌다', async () => {
    renderAlert();

    await userEvent.click(screen.getByRole('button', { name: '글 삭제' }));
    await userEvent.click(screen.getByRole('button', { name: '취소' }));

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  it('Action을 누르면 onClick이 불리고 닫힌다', async () => {
    const onAction = vi.fn();
    renderAlert(onAction);

    await userEvent.click(screen.getByRole('button', { name: '글 삭제' }));
    await userEvent.click(screen.getByRole('button', { name: '삭제' }));

    expect(onAction).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });
});
