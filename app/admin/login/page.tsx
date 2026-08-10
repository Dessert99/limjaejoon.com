import { AdminLoginForm } from '@/views/blog/admin/components/AdminLoginForm/AdminLoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '어드민 로그인',
  // robots.txt 와 별개로 페이지 자체도 색인을 거부한다
  robots: { index: false, follow: false },
};

/** 어드민 로그인 — /admin/login 은 (protected) 밖이라 밝은 바탕을 이 페이지가 직접 건다 */
export default function AdminLoginPage() {
  return (
    <div
      data-surface='light'
      className='flex min-h-svh flex-col justify-center bg-background text-foreground'>
      <main className='py-section'>
        <div className='mx-auto max-w-sm px-gutter'>
          <h1 className='text-statement'>어드민</h1>
          <AdminLoginForm />
        </div>
      </main>
    </div>
  );
}
