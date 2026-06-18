import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PasswordToggleField } from './PasswordToggleField';

function renderField() {
  return render(
    <PasswordToggleField.Root>
      <PasswordToggleField.Input
        aria-label='비밀번호'
        className='password-input'
      />
      <PasswordToggleField.Toggle className='password-toggle'>
        <PasswordToggleField.Slot
          visible='숨기기'
          hidden='보기'
        />
      </PasswordToggleField.Toggle>
    </PasswordToggleField.Root>
  );
}

describe('PasswordToggleField', () => {
  it('Input과 Toggle에 외부 className을 병합한다', () => {
    renderField();

    expect(screen.getByLabelText('비밀번호')).toHaveClass('password-input');
    expect(screen.getByRole('button', { name: '보기' })).toHaveClass(
      'password-toggle'
    );
  });
});
