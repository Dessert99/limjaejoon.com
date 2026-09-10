'use client';

import Giscus from '@giscus/react';

/** 주소나 제목이 바뀌어도 같은 글의 댓글을 유지한다. */
export function PostComments({ postId }: { postId: string }) {
  return (
    <section aria-label='댓글'>
      <h2 className='mb-6 text-xl font-semibold'>댓글</h2>
      <Giscus
        key={postId}
        repo='Dessert99/limjaejoon.com'
        repoId='R_kgDOQ0CbwQ'
        category='Announcements'
        categoryId='DIC_kwDOQ0Cbwc4DFSoJ'
        mapping='specific'
        term={`blog/${postId}`}
        strict='1'
        reactionsEnabled='1'
        emitMetadata='0'
        inputPosition='top'
        theme='light'
        lang='ko'
        loading='lazy'
      />
    </section>
  );
}
