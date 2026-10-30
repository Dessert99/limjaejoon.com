import Link from 'next/link';

/** 없는 주소로 들어왔을 때. 어느 라우트에도 속하지 않아 라우트 토큰 없이 그린다. */
export default function RootNotFound() {
  return (
    <main className='grid min-h-svh place-items-center px-6 text-center'>
      <div>
        <h1 className='text-2xl font-semibold'>페이지를 찾을 수 없다</h1>
        <p className='mt-3 text-sm opacity-60'>
          주소가 바뀌었거나 없어진 페이지다.
        </p>
        <Link
          href='/'
          className='mt-8 inline-block text-sm underline underline-offset-4'>
          홈으로
        </Link>
      </div>
    </main>
  );
}
