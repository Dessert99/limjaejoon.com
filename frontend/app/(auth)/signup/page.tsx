// 회원가입 라우트 — SignupForm을 그대로 렌더하는 thin 진입점
import { SignupForm } from '@/features/auth/components/SignupForm';

export const metadata = {
  title: '회원가입',
  description: '이메일과 비밀번호로 회원가입합니다.',
};

export default function SignupPage() {
  return <SignupForm />;
}
