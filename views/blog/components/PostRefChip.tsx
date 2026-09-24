import siteIcon from '@/app/icon.png';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

/** 본문 속 다른 글 링크. 글자 사이에 끼는 칩이고, 누르면 지금 글 위에 그 글이 피크로 뜬다. #소제목이 붙으면 그 자리로 연다. */
export function PostRefChip({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    // inline이라 긴 제목도 글자처럼 줄바꿈되고, box-decoration-clone이 끊긴 줄마다 면·모서리를 다시 그린다
    // 글자색·밑줄의 !는 prose-post의 본문 링크 규칙(노란색·밑줄)이 선택자 우선순위로 칩을 덮는 걸 막는다
    // 면 zinc-700 위 크림 글자. 면을 검정으로 내리면 본문 사이에서 튀고, 옅히면 크림 글자가 묻힌다
    // scroll={false}는 Next가 #소제목을 문서에서 찾아 A의 같은 id로 스크롤하는 걸 끈다. 피크 안 스크롤은 PeekHashScroll이 맡는다
    <Link
      href={href}
      scroll={false}
      className='rounded-md bg-blog-chip box-decoration-clone px-1 py-0.5 text-[#f5f1e8]! no-underline! transition-colors hover:bg-blog-chip-hover'>
      {/* 1em이라 본문 글자 크기를 따라가고, -0.125em 내려야 한글 글자 몸통 가운데에 앉는다. 검은 로고라 invert로 뒤집어 어두운 면에서 보이게 한다 */}
      <Image
        src={siteIcon}
        alt=''
        className='mr-1 inline! size-[1em] align-[-0.125em] invert'
      />
      {children}
    </Link>
  );
}
