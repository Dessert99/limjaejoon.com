/** AdminLoginPage 테스트 — 제출이 로그인을 시도하고, 실패는 폼에 머무는지 검증한다 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminLoginPage } from './AdminLoginPage';

const push = vi.fn();
const signInWithPassword = vi.fn();

vi.mock('next/navigation', () => {
  return {
    useRouter: () => {
      return { push };
    },
  };
});

// browser client 를 갈아 끼워 실제 signIn·useSignIn 을 그대로 태운다
vi.mock('@/shared/api/supabase/client', () => {
  return {
    createSupabaseBrowserClient: () => {
      return { auth: { signInWithPassword } };
    },
  };
});

const fillAndSubmit = async () => {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText('이메일'), 'admin@example.com');
  await user.type(screen.getByLabelText('비밀번호'), 'secret');
  await user.click(screen.getByRole('button', { name: '로그인' }));
};

describe('AdminLoginPage', () => {
  beforeEach(() => {
    push.mockReset();
    signInWithPassword.mockReset();
  });

  it('입력한 이메일·비밀번호로 로그인을 시도한다', async () => {
    signInWithPassword.mockResolvedValue({ error: null });

    render(<AdminLoginPage />);
    await fillAndSubmit();

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'admin@example.com',
      password: 'secret',
    });
  });

  it('로그인에 성공하면 어드민 홈으로 보낸다', async () => {
    signInWithPassword.mockResolvedValue({ error: null });

    render(<AdminLoginPage />);
    await fillAndSubmit();

    expect(push).toHaveBeenCalledWith('/blog');
  });

  it('실패하면 폼에 머물고 사유를 보여준다', async () => {
    signInWithPassword.mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    });

    render(<AdminLoginPage />);
    await fillAndSubmit();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Invalid login credentials'
    );
    expect(push).not.toHaveBeenCalled();
  });
});
