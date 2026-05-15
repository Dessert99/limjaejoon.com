'use client';

// /blog 결합 검색의 입력부. 검색어를 URL ?q= 에 써서 BlogList가 태그와 함께 읽게 한다
// (태그 ?tags= 패턴과 동일한 "필터=URL" 모델). 호출처: blog/page.tsx 헤더 영역.
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import * as s from './SearchBox.css';

export function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 입력 표시는 로컬 state로 즉시 반영(타이핑 끊김 방지). URL은 뒤에서 동기화 — 단일 출처는 URL
  const [value, setValue] = useState(searchParams.get('q') ?? '');
  // startTransition: URL 갱신을 비긴급으로 표시해 입력 응답성을 유지
  const [, startTransition] = useTransition();

  // 입력 → 로컬 즉시 반영 + ?q= 동기화. tags 파라미터는 보존, replace+scroll:false로
  // 히스토리 누적·스크롤 점프 없이 갱신
  function handleChange(next: string) {
    setValue(next);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = next.trim();
      if (trimmed.length > 0) {
        params.set('q', trimmed);
      } else {
        params.delete('q');
      }
      const qs = params.toString();
      router.replace(qs ? `/blog?${qs}` : '/blog', { scroll: false });
    });
  }

  return (
    <input
      className={s.input}
      type='search'
      placeholder='제목, 설명, 태그로 검색...'
      value={value}
      onChange={(e) => {
        return handleChange(e.target.value);
      }}
      aria-label='블로그 검색'
    />
  );
}
