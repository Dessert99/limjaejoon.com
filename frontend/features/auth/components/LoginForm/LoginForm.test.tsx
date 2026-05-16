// LoginForm 컴포넌트 테스트 — RHF 검증 + a11y(aria-invalid·role=alert) + 401 에러 매핑
// React Testing Library: 사용자 관점에서 DOM을 쿼리·조작 (구현 디테일 X, 동작 검증 O)
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// next/navigation: 라우터·쿼리스트링 mock
const pushMock = vi.fn();
const searchParamsMock = new URLSearchParams();
vi.mock('next/navigation', () => {
  return {
    useRouter: () => {
      return { push: pushMock };
    },
    useSearchParams: () => {
      return searchParamsMock;
    },
  };
});

// useLoginMutate hook 자체를 mock — LoginForm은 mutate/isPending만 쓰면 충분
const mutateMock = vi.fn();
vi.mock('@/features/auth/hooks/mutations/useLoginMutate', () => {
  return {
    useLoginMutate: () => {
      return {
        mutate: mutateMock,
        isPending: false,
        isError: false,
        isSuccess: false,
        error: null,
      };
    },
  };
});

import { LoginForm } from '@/features/auth/components/LoginForm/LoginForm';

// QueryClientProvider로 감싸 렌더 — useLoginMutate 내부의 useQueryClient가 동작하도록
function renderForm() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
  return render(<LoginForm />, { wrapper });
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('접근성 (a11y)', () => {
    it('이메일 input과 label이 htmlFor+id로 연결되어 있다', () => {
      renderForm();

      // getByLabelText — label 텍스트로 input을 찾을 수 있다는 것 자체가 연결 검증
      const emailInput = screen.getByLabelText(/이메일/);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput.tagName).toBe('INPUT');
    });

    it('비밀번호 input과 label도 연결되어 있다', () => {
      renderForm();

      const passwordInput = screen.getByLabelText(/비밀번호/);
      expect(passwordInput).toBeInTheDocument();
      expect((passwordInput as HTMLInputElement).type).toBe('password');
    });

    it('초기 상태에는 aria-invalid가 false다', () => {
      renderForm();

      const emailInput = screen.getByLabelText(/이메일/);
      // boolean attribute — aria-invalid="false" 또는 미지정 (Boolean(undefined)=false)
      expect(emailInput.getAttribute('aria-invalid')).toBe('false');
    });
  });

  describe('클라이언트 검증', () => {
    it('잘못된 이메일 형식 → aria-invalid=true + role="alert" 에러 표시', async () => {
      renderForm();

      // Arrange — 이메일 잘못 입력
      const emailInput = screen.getByLabelText(/이메일/);
      fireEvent.change(emailInput, { target: { value: 'not-an-email' } });

      // 비밀번호는 정상 입력 (다른 검증 충돌 방지)
      const passwordInput = screen.getByLabelText(/비밀번호/);
      fireEvent.change(passwordInput, { target: { value: 'pw12345678' } });

      // Act — submit
      const form = emailInput.closest('form');
      fireEvent.submit(form!);

      // Assert — 에러가 비동기로 표시될 수 있음
      await waitFor(() => {
        expect(emailInput.getAttribute('aria-invalid')).toBe('true');
      });

      // role=alert로 스크린리더에 즉시 전달되는 영역에 한국어 메시지
      const alerts = screen.getAllByRole('alert');
      expect(
        alerts.some((el) => {
          return el.textContent?.includes('올바른 이메일');
        })
      ).toBe(true);

      // 검증 실패 시 mutate는 호출되지 않아야 함
      expect(mutateMock).not.toHaveBeenCalled();
    });

    it('짧은 비밀번호 → 비밀번호 필드에 에러 표시', async () => {
      renderForm();

      fireEvent.change(screen.getByLabelText(/이메일/), {
        target: { value: 'a@b.c' },
      });
      const passwordInput = screen.getByLabelText(/비밀번호/);
      fireEvent.change(passwordInput, { target: { value: 'short' } });

      fireEvent.submit(passwordInput.closest('form')!);

      await waitFor(() => {
        expect(passwordInput.getAttribute('aria-invalid')).toBe('true');
      });

      expect(mutateMock).not.toHaveBeenCalled();
    });
  });

  describe('정상 흐름', () => {
    it('정상 입력 후 submit → useLoginMutate().mutate가 email/password로 호출된다', async () => {
      renderForm();

      fireEvent.change(screen.getByLabelText(/이메일/), {
        target: { value: 'a@b.c' },
      });
      fireEvent.change(screen.getByLabelText(/비밀번호/), {
        target: { value: 'pw12345678' },
      });
      fireEvent.click(screen.getByRole('button', { name: /로그인/ }));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
      });

      // 첫 호출의 첫 인자(variables)가 입력값과 일치해야 함
      expect(mutateMock.mock.calls[0][0]).toEqual({
        email: 'a@b.c',
        password: 'pw12345678',
      });
    });
  });

  describe('서버 에러 매핑', () => {
    it('401 응답 시 폼 상단에 root 에러 메시지가 표시된다', async () => {
      // Arrange — mutate가 호출되면 onError 콜백을 401 axios 에러로 즉시 실행
      mutateMock.mockImplementation((_data, options) => {
        const axiosError = new Error('Unauthorized') as Error & {
          isAxiosError: boolean;
          response: { status: number };
        };
        axiosError.isAxiosError = true;
        axiosError.response = { status: 401 };
        // axios.isAxiosError 가드를 통과시키기 위한 hack — 실 환경에선 axios가 던짐
        vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);
        options?.onError?.(axiosError);
      });

      renderForm();

      fireEvent.change(screen.getByLabelText(/이메일/), {
        target: { value: 'a@b.c' },
      });
      fireEvent.change(screen.getByLabelText(/비밀번호/), {
        target: { value: 'pw12345678' },
      });
      fireEvent.click(screen.getByRole('button', { name: /로그인/ }));

      // Assert — '이메일 또는 비밀번호가 올바르지 않습니다.' 메시지 등장
      await waitFor(() => {
        const alerts = screen.getAllByRole('alert');
        expect(
          alerts.some((el) => {
            return el.textContent?.includes('이메일 또는 비밀번호가 올바르지');
          })
        ).toBe(true);
      });
    });
  });
});
