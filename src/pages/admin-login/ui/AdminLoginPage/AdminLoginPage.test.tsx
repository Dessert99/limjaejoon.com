import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/auth', () => {
  return {
    LoginForm: () => {
      return <div>login-form</div>;
    },
  };
});

import { AdminLoginPage } from './AdminLoginPage';

describe('AdminLoginPage', () => {
  it('제목과 로그인 폼을 렌더한다', () => {
    render(<AdminLoginPage />);
    expect(
      screen.getByRole('heading', { name: '관리자 로그인' })
    ).toBeInTheDocument();
    expect(screen.getByText('login-form')).toBeInTheDocument();
  });
});
