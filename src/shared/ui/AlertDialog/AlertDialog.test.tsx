import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AlertDialog } from './AlertDialog';

function renderAlertDialog() {
  return render(
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Content className='alert-panel'>
        <AlertDialog.Title className='alert-title'>
          정말 삭제할까요?
        </AlertDialog.Title>
        <AlertDialog.Description className='alert-description'>
          되돌릴 수 없습니다.
        </AlertDialog.Description>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

describe('AlertDialog', () => {
  it('Content가 Portal과 Overlay를 내장하고 외부 className을 병합한다', () => {
    renderAlertDialog();

    const dialog = screen.getByRole('alertdialog', {
      name: '정말 삭제할까요?',
    });
    expect(dialog).toHaveClass('alert-panel');
    expect(dialog).toHaveAccessibleDescription('되돌릴 수 없습니다.');
    expect(screen.getByText('정말 삭제할까요?')).toHaveClass('alert-title');
    expect(screen.getByText('되돌릴 수 없습니다.')).toHaveClass(
      'alert-description'
    );
  });
});
