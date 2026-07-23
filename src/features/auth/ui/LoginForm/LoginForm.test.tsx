import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const push = vi.fn();
vi.mock('next/navigation', () => {
  return {
    useRouter: () => {
      return { push };
    },
  };
});
const signIn = vi.fn();
vi.mock('../../api/signIn', () => {
  return {
    signIn: (...args: unknown[]) => {
      return signIn(...args);
    },
  };
});

import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('로그인 성공 시 /admin/posts 로 이동한다', async () => {
    signIn.mockResolvedValueOnce({ error: null });
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText('이메일'), 'a@x.com');
    await userEvent.type(screen.getByLabelText('비밀번호'), 'pw');
    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    expect(push).toHaveBeenCalledWith('/admin/posts');
  });

  it('실패하면 에러 메시지를 보여준다', async () => {
    signIn.mockResolvedValueOnce({ error: '잘못된 로그인' });
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText('이메일'), 'a@x.com');
    await userEvent.type(screen.getByLabelText('비밀번호'), 'x');
    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByText('잘못된 로그인')).toBeInTheDocument();
  });
});
