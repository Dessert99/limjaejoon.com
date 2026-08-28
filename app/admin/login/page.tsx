import { AdminLoginForm } from '@/views/blog/admin/components/AdminLoginForm/AdminLoginForm';
import type { Metadata } from 'next';

/** 어드민 화면은 검색에 걸리면 안 돼서 색인을 막는다. */
export const metadata: Metadata = {
  title: '어드민 로그인',
  robots: { index: false, follow: false },
};

/** 어드민 로그인 화면. 관문 밖에 있어야 로그인하러 들어올 수 있다. */
export default function AdminLoginPage() {
  return (
    <div className='flex min-h-svh flex-col justify-center bg-blog-background text-blog-foreground scheme-light'>
      <main className='py-blog-section'>
        <div className='mx-auto max-w-sm px-blog-gutter'>
          <h1 className='text-blog-statement'>어드민</h1>
          <AdminLoginForm />
        </div>
      </main>
    </div>
  );
}
