import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dialog } from './Dialog';

function renderDialog() {
  return render(
    <Dialog.Root defaultOpen>
      <Dialog.Content className='dialog-panel'>
        <Dialog.Header className='dialog-header'>
          <Dialog.Title className='dialog-title'>프로필 수정</Dialog.Title>
          <Dialog.Description className='dialog-description'>
            이름과 소개를 바꿀 수 있습니다.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className='dialog-body'>본문</Dialog.Body>
        <Dialog.Footer className='dialog-footer'>
          <Dialog.Close
            asChild
            className='dialog-close'>
            <button type='button'>닫기</button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

describe('Dialog', () => {
  it('Content가 Portal과 Overlay를 내장하고 일반 dialog aria와 className을 연결한다', () => {
    renderDialog();

    const dialog = screen.getByRole('dialog', { name: '프로필 수정' });
    expect(dialog).toHaveClass('dialog-panel');
    expect(dialog).toHaveAccessibleDescription(
      '이름과 소개를 바꿀 수 있습니다.'
    );
    expect(screen.getByText('프로필 수정')).toHaveClass('dialog-title');
    expect(screen.getByText('이름과 소개를 바꿀 수 있습니다.')).toHaveClass(
      'dialog-description'
    );
    expect(screen.getByText('본문')).toHaveClass('dialog-body');
    expect(screen.getByText('닫기').parentElement).toHaveClass('dialog-footer');
    expect(screen.getByRole('button', { name: '닫기' })).toHaveClass(
      'dialog-close'
    );
  });

  it('Footer의 기본 layout은 natural이고 single layout을 명시할 수 있다', () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>설정</Dialog.Title>
          <Dialog.Description>설정을 변경합니다.</Dialog.Description>
          <Dialog.Footer
            layout='single'
            className='single-footer'>
            <Dialog.Close>확인</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    );

    expect(screen.getByText('확인').parentElement).toHaveAttribute(
      'data-layout',
      'single'
    );
    expect(screen.getByText('확인').parentElement).toHaveClass('single-footer');
  });
});
