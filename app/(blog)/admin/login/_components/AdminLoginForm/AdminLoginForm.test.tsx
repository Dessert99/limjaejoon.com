import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminLoginForm } from './AdminLoginForm';

const push = vi.fn();
const signIn = vi.fn();

vi.mock('next/navigation', () => {
  return {
    useRouter: () => {
      return { push };
    },
  };
});

vi.mock('@/lib/auth/signIn', () => {
  return {
    signIn: (input: unknown) => {
      return signIn(input);
    },
  };
});

const fillAndSubmit = async () => {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText('이메일'), 'admin@example.com');
  await user.type(screen.getByLabelText('비밀번호'), 'secret');
  await user.click(screen.getByRole('button', { name: '로그인' }));
};

describe('AdminLoginForm', () => {
  beforeEach(() => {
    push.mockReset();
    signIn.mockReset();
  });

  it('입력한 이메일·비밀번호로 로그인을 시도한다', async () => {
    signIn.mockResolvedValue({ error: null });

    render(<AdminLoginForm />);
    await fillAndSubmit();

    expect(signIn).toHaveBeenCalledWith({
      email: 'admin@example.com',
      password: 'secret',
    });
  });

  it('로그인에 성공하면 어드민 홈으로 보낸다', async () => {
    signIn.mockResolvedValue({ error: null });

    render(<AdminLoginForm />);
    await fillAndSubmit();

    expect(push).toHaveBeenCalledWith('/admin');
  });

  it('실패하면 폼에 머물고 사유를 보여준다', async () => {
    signIn.mockResolvedValue({ error: 'Invalid login credentials' });

    render(<AdminLoginForm />);
    await fillAndSubmit();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Invalid login credentials'
    );
    expect(push).not.toHaveBeenCalled();
  });
});
