import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AlertDialog } from './AlertDialog';

function renderAlertDialog() {
  return render(
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Content className='alert-panel'>
        <AlertDialog.Header className='alert-header'>
          <AlertDialog.Title className='alert-title'>
            정말 삭제할까요?
          </AlertDialog.Title>
          <AlertDialog.Description className='alert-description'>
            되돌릴 수 없습니다.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer
          layout='single'
          className='alert-footer'>
          <AlertDialog.Action>삭제</AlertDialog.Action>
        </AlertDialog.Footer>
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
    expect(screen.getByText('정말 삭제할까요?').parentElement).toHaveClass(
      'alert-header'
    );
    expect(screen.getByText('삭제').parentElement).toHaveClass('alert-footer');
    expect(screen.getByText('삭제').parentElement).toHaveAttribute(
      'data-layout',
      'single'
    );
  });

  it('Footer의 기본 layout은 natural이다', () => {
    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Content>
          <AlertDialog.Title>주의</AlertDialog.Title>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>취소</AlertDialog.Cancel>
            <AlertDialog.Action>확인</AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    );

    expect(screen.getByText('취소').parentElement).toHaveAttribute(
      'data-layout',
      'natural'
    );
  });
});
