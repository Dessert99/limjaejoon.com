import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

/** 블로그 쪽에서 글이나 책을 찾지 못했을 때. 위 레이아웃의 배색은 그대로 두고 본문 자리만 바꾼다. */
export default function BlogNotFound() {
  return (
    <main className='mx-auto flex w-full max-w-blog flex-1 flex-col justify-center px-blog-gutter py-24'>
      <h1 className='text-blog-statement'>글을 찾을 수 없다</h1>
      <p className='mt-4 text-lg text-blog-muted-foreground'>
        주소가 바뀌었거나 지운 글이다.
      </p>
      <div className='mt-8'>
        <Link
          href='/library'
          className={buttonVariants({ variant: 'outline' })}>
          서재로
        </Link>
      </div>
    </main>
  );
}
