/** admin 로그인 page 조립 — 로그인 폼을 단독 화면으로 보여준다 */
import { LoginForm } from '@/features/auth';
import * as s from './AdminLoginPage.css';

/** 관리자 로그인 화면 */
export function AdminLoginPage() {
  return (
    <main className={s.main}>
      <h1 className={s.title}>관리자 로그인</h1>
      <LoginForm />
    </main>
  );
}
