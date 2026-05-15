// 회원가입 폼 zod 스키마 — RHF zodResolver의 입력. 폼 값 타입의 단일 진실원
import { z } from 'zod';

import {
  EMAIL_RE,
  PASSWORD_MIN_LENGTH,
} from '@/features/auth/constants/validation';

// 회원가입은 새 비밀번호 정책(최소 길이)을 명시적으로 적용 — 로그인 스키마와 분리 (도메인 구분)
export const signupSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .regex(EMAIL_RE, '올바른 이메일 형식을 입력해주세요.'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요.')
    .min(
      PASSWORD_MIN_LENGTH,
      `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`
    ),
});

// z.infer로 폼 값 타입 도출 — interface 별도 선언 금지 (단일 진실원)
export type SignupFormValues = z.infer<typeof signupSchema>;
