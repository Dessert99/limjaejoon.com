'use client';
// 회원가입 폼 — react-hook-form 기반, 409(중복 이메일)는 email 필드에 매핑
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import { useSignup } from '@/features/auth/hooks/useSignup';
import {
  EMAIL_RE,
  PASSWORD_MIN_LENGTH,
} from '@/features/auth/constants/validation';
import type { SignupRequest } from '@/features/auth/types';

import { FormField } from './FormField';
import * as s from './SignupForm.css';

export function SignupForm() {
  const router = useRouter();
  const signupMutation = useSignup();

  // useForm — 도메인 타입 SignupRequest로 register·errors 자동 추론
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupRequest>();

  const onSubmit = (data: SignupRequest) => {
    signupMutation.mutate(data, {
      onSuccess: () => {
        // 가입 직후 returnTo는 무시하고 항상 /me로 이동 (PRD 정책)
        router.push('/me');
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          // 409 — 이메일 자체가 문제이므로 email 필드에 표시 (사용자가 즉시 수정 가능)
          if (status === 409) {
            setError('email', {
              message: '이미 가입된 이메일입니다.',
            });
            return;
          }
          if (status === 400) {
            setError('root', { message: '입력값을 다시 확인해주세요.' });
            return;
          }
        }
        setError('root', {
          message: '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.',
        });
      },
    });
  };

  return (
    <div className={s.formContainer}>
      <h1 className={s.formTitle}>회원가입</h1>

      {/* 폼 전체 에러 — root 키에 들어온 서버·네트워크 에러 표시 */}
      {errors.root && (
        <div
          role='alert'
          className={s.formError}>
          {errors.root.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate>
        <div className={s.fieldStack}>
          <FormField
            id='signup-email'
            label='이메일'
            type='email'
            autoComplete='email'
            disabled={signupMutation.isPending}
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
            id='signup-password'
            label='비밀번호'
            type='password'
            autoComplete='new-password'
            disabled={signupMutation.isPending}
            helper={`${PASSWORD_MIN_LENGTH}자 이상 입력해주세요.`}
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

        <button
          type='submit'
          disabled={signupMutation.isPending}
          className={s.submitButton}>
          {signupMutation.isPending ? '가입 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
}
