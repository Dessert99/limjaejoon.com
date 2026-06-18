import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PasswordToggleField } from './PasswordToggleField';

// 입력 + 보기/숨기기 토글 — 동작 검증용 공통 마크업
function renderField() {
  return render(
    <PasswordToggleField.Root>
      <PasswordToggleField.Input aria-label='비밀번호' />
      <PasswordToggleField.Toggle>
        <PasswordToggleField.Slot
          visible='숨기기'
          hidden='보기'
        />
      </PasswordToggleField.Toggle>
    </PasswordToggleField.Root>
  );
}

describe('PasswordToggleField', () => {
  it('기본은 password 타입이고 토글을 누르면 text로 바뀐다', async () => {
    renderField();

    const input = screen.getByLabelText('비밀번호');
    expect(input).toHaveAttribute('type', 'password');

    // Slot 텍스트가 있으면 Radix가 aria-label을 안 걸어 접근명=보이는 텍스트('보기')
    await userEvent.click(screen.getByRole('button', { name: '보기' }));

    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: '숨기기' })).toBeInTheDocument();
  });

  it('Slot이 가시성 상태에 따라 라벨 텍스트를 바꾼다', async () => {
    renderField();
    expect(screen.getByText('보기')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '보기' }));

    expect(screen.getByText('숨기기')).toBeInTheDocument();
  });
});
