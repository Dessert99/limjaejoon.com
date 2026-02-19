// 404 화면에서 홈으로 이동할 링크를 만들기 위해 사용합니다.
import Link from 'next/link';

// 잘못된 slug/경로 접근 시 표시되는 공통 404 페이지입니다.
export default function NotFound() {
  return (
    <main className='mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4'>
      <div className='rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center'>
        <p className='text-xs uppercase tracking-[0.2em] text-zinc-500'>404</p>
        <h1 className='mt-3 text-3xl font-semibold text-zinc-100'>페이지를 찾을 수 없습니다</h1>
        <p className='mt-3 text-sm text-zinc-300'>카테고리가 제거되었거나 주소가 잘못되었습니다.</p>
        {/* 사용자가 즉시 정상 경로로 복귀할 수 있도록 홈 링크를 제공합니다. */}
        <Link
          href='/'
          className='mt-5 inline-block rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-blue-500 hover:text-blue-100'>
          홈으로 이동
        </Link>
      </div>
    </main>
  );
}
