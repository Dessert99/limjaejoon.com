'use client';
// 로그인 폼 — react-hook-form 기반, 클라 검증·서버 에러 모두 RHF errors로 통합
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import { useLogin } from '@/features/auth/hooks/useLogin';
import {
  EMAIL_RE,
  PASSWORD_MIN_LENGTH,
} from '@/features/auth/constants/validation';
import { safeReturnTo } from '@/lib/auth/safeReturnTo';
import type { LoginRequest } from '@/features/auth/types';

import { FormField } from './FormField';
import * as s from './LoginForm.css';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();

  // useForm — 도메인 타입 LoginRequest로 register·errors 자동 추론
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginRequest>();

  // submit — 서버 에러는 onError에서 setError로 RHF errors에 합류시킨다
  const onSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        // open redirect 방어 — safeReturnTo로 검증된 경로만 사용
        const returnTo = safeReturnTo(searchParams.get('returnTo'));
        router.push(returnTo);
      },
      onError: (error) => {
        // 401은 어느 필드 잘못인지 알 수 없으므로 root에 표시 (사용자 enumeration 방어)
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 401) {
            setError('root', {
              message: '이메일 또는 비밀번호가 올바르지 않습니다.',
            });
            return;
          }
          if (status === 400) {
            setError('root', { message: '입력값을 다시 확인해주세요.' });
            return;
          }
        }
        setError('root', {
          message: '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
        });
      },
    });
  };

  return (
    <div className={s.formContainer}>
      <h1 className={s.formTitle}>로그인</h1>

      {/* 폼 전체 에러 — root 키에 들어온 서버·네트워크 에러 표시 */}
      {errors.root && (
        <div
          role='alert'
          className={s.formError}>
          {errors.root.message}
        </div>
      )}

      {/* noValidate — 브라우저 기본 검증 끄고 RHF 검증만 사용 */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate>
        <div className={s.fieldStack}>
          <FormField
            id='login-email'
            label='이메일'
            type='email'
            autoComplete='email'
            required
            disabled={loginMutation.isPending}
            error={errors.email?.message}
            {...register('email', {
              required: '이메일을 입력해주세요.',
              pattern: {
                value: EMAIL_RE,
                message: '올바른 이메일 형식을 입력해주세요.',
              },
            })}
          />
          <FormField
            id='login-password'
            label='비밀번호'
            type='password'
            autoComplete='current-password'
            required
            disabled={loginMutation.isPending}
            error={errors.password?.message}
            {...register('password', {
              required: '비밀번호를 입력해주세요.',
              minLength: {
                value: PASSWORD_MIN_LENGTH,
                message: `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`,
              },
            })}
          />
        </div>

        {/* 제출 버튼 — pending 중 비활성화 + aria-busy로 스크린리더에 진행 상태 안내 */}
        <button
          type='submit'
          disabled={loginMutation.isPending}
          aria-busy={loginMutation.isPending}
          className={s.submitButton}>
          {loginMutation.isPending ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}
