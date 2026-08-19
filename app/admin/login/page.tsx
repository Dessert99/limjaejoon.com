import { AdminLoginForm } from '@/views/blog/admin/components/AdminLoginForm/AdminLoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '어드민 로그인',
  robots: { index: false, follow: false },
};

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
