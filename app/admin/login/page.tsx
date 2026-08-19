import { AdminLoginForm } from '@/views/blog/admin/components/AdminLoginForm/AdminLoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '어드민 로그인',
  robots: { index: false, follow: false },
};

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
