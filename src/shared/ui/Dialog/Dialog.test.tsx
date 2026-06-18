import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dialog } from './Dialog';

function renderDialog() {
  return render(
    <Dialog.Root defaultOpen>
      <Dialog.Content className='dialog-panel'>
        <Dialog.Title className='dialog-title'>글 삭제</Dialog.Title>
        <Dialog.Description className='dialog-description'>
          이 작업은 되돌릴 수 없습니다.
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  );
}

describe('Dialog', () => {
  it('Content가 Portal과 Overlay를 내장하고 외부 className을 병합한다', () => {
    renderDialog();

    const dialog = screen.getByRole('dialog', { name: '글 삭제' });
    expect(dialog).toHaveClass('dialog-panel');
    expect(dialog).toHaveAccessibleDescription('이 작업은 되돌릴 수 없습니다.');
    expect(screen.getByText('글 삭제')).toHaveClass('dialog-title');
    expect(screen.getByText('이 작업은 되돌릴 수 없습니다.')).toHaveClass(
      'dialog-description'
    );
  });
});
