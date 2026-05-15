// 로그인 폼 zod 스키마 — RHF zodResolver의 입력. 폼 값 타입의 단일 진실원
import { z } from 'zod';

import {
  EMAIL_RE,
  PASSWORD_MIN_LENGTH,
} from '@/features/auth/constants/validation';

// 정적 검증(필수/형식/최소길이)을 한 곳에 모은다 — register validate / rules는 사용 금지
export const loginSchema = z.object({
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
export type LoginFormValues = z.infer<typeof loginSchema>;
