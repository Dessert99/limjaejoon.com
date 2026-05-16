'use client';
// 회원가입 폼 — react-hook-form + zod resolver, 409(중복 이메일)는 email 필드에 매핑
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import { useSignupMutate } from '@/features/auth/hooks/mutations/useSignupMutate';
import { PASSWORD_MIN_LENGTH } from '@/features/auth/constants/validation';
import {
  signupSchema,
  type SignupFormValues,
} from '@/features/auth/schemas/signup';

import { FormField } from '@/features/auth/components/FormField/FormField';
import * as s from './SignupForm.css';

export function SignupForm() {
  const router = useRouter();
  const signupMutation = useSignupMutate();

  // useForm — zodResolver가 signupSchema로 검증, 타입은 z.infer 단일 진실원
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormValues) => {
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
            required
            disabled={signupMutation.isPending}
            error={errors.email?.message}
            {...register('email')}
          />
          <FormField
            id='signup-password'
            label='비밀번호'
            type='password'
            autoComplete='new-password'
            required
            disabled={signupMutation.isPending}
            helper={`${PASSWORD_MIN_LENGTH}자 이상 입력해주세요.`}
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        {/* aria-busy로 스크린리더에 가입 진행 상태 announce */}
        <button
          type='submit'
          disabled={signupMutation.isPending}
          aria-busy={signupMutation.isPending}
          className={s.submitButton}>
          {signupMutation.isPending ? '가입 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
}
