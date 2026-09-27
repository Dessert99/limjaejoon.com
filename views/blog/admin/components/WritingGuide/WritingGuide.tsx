/** 제목·설명·본문을 검색과 AI 인용에 잘 걸리게 쓰는 규칙과 예시를 접었다 펴는 안내. */
export function WritingGuide() {
  return (
    <details
      open
      className='rounded-lg border border-blog-border px-4 py-3 text-sm'>
      <summary className='cursor-pointer font-medium'>
        작성 가이드 — 검색·AI 인용에 잘 걸리게 쓰기
      </summary>

      <dl className='mt-3 flex flex-col gap-3'>
        <div>
          <dt className='font-medium'>제목</dt>
          <dd className='text-blog-muted-foreground'>
            검색어 + 글이 답하는 내용 순서로. 기술 이름을 앞에 두고 35자 안팎.
          </dd>
          <dd className='text-blog-muted-foreground'>
            예){' '}
            <span className='text-blog-foreground'>
              Next.js 하이드레이션(Hydration) 원리: renderToString부터
              hydrateRoot까지
            </span>
          </dd>
        </div>

        <div>
          <dt className='font-medium'>설명</dt>
          <dd className='text-blog-muted-foreground'>
            첫 문장은 「X는 ~이다」 답, 둘째 문장은 다루는 범위. 「~를
            정리한다」로만 끝내지 않는다.
          </dd>
          <dd className='text-blog-muted-foreground'>
            예){' '}
            <span className='text-blog-foreground'>
              Zod는 TypeScript 타입이 사라지는 런타임에 외부 데이터를 스키마로
              검증하는 라이브러리다. z.object부터 refine·transform·pipe까지 주요
              API를 예시로 정리한다.
            </span>
          </dd>
        </div>

        <div>
          <dt className='font-medium'>본문</dt>
          <dd className='text-blog-muted-foreground'>
            # 대신 ##부터. 소제목은 질문형, 그 아래 첫 문장이 답. 공식 문서
            링크와 버전을 적는다.
          </dd>
          <dd>
            <pre className='mt-1 rounded-lg bg-blog-muted px-3 py-2 font-mono text-xs whitespace-pre-wrap'>
              {
                '## CNAME을 루트 도메인에 쓸 수 없는 이유\n루트 도메인에는 SOA·NS 레코드가 있어야 하는데, CNAME은 다른 레코드와 함께 둘 수 없기 때문이다.'
              }
            </pre>
          </dd>
        </div>
      </dl>
    </details>
  );
}
