'use client';

// /blog 결합 검색 입력부. 평소엔 아이콘으로 접혀 있다 클릭 시 검색창으로 펼쳐진다.
// 검색어를 URL ?q= 에 써서 BlogList 가 태그와 함께 읽는다("필터=URL" 모델).
// 호출처: blog/page.tsx 헤더 영역.
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2';
import * as s from './SearchBox.css';

export function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 접힘 ⇔ 검색어 없음 모델: 진입 시 ?q= 가 있으면 펼친 상태로 시작(공유 링크 대응)
  const [expanded, setExpanded] = useState(() => {
    return Boolean(searchParams.get('q'));
  });
  // 스핀(아이콘 회전) 진행 플래그 — 끝나면 펼침으로 넘어간다(2단계 시퀀싱)
  const [spinning, setSpinning] = useState(false);
  // 입력 표시는 로컬 state로 즉시 반영(타이핑 끊김 방지). 단일 출처는 URL
  const [value, setValue] = useState(searchParams.get('q') ?? '');
  // startTransition: URL 갱신을 비긴급으로 표시해 입력 응답성 유지
  const [, startTransition] = useTransition();
  // 펼칠 때 입력으로 포커스를 옮기기 위한 참조
  const inputRef = useRef<HTMLInputElement>(null);

  // 입력 → 로컬 즉시 반영 + ?q= 동기화. tags 파라미터 보존, replace+scroll:false
  const handleChange = (next: string) => {
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
  };

  // 펼침과 같은 프레임에 동기 포커스 — 첫 페인트부터 :focus-within(보더 accent)이
  // 켜져 hover-accent → focus-accent 가 끊김 없이 이어진다(중립 깜박임 제거).
  // preventScroll: 원래 rAF 로 피하던 스크롤 점프를 동기 포커스에서도 유지
  const focusInput = () => {
    inputRef.current?.focus({ preventScroll: true });
  };

  // 아이콘 클릭 → 스핀 단계 시작. 펼침은 스핀이 끝나는 onAnimationEnd 에서 결정.
  // 동작 줄이기 모드는 스핀(=animationend)이 없어 갇히므로 즉시 펼침으로 분기
  const handleExpand = () => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduceMotion) {
      setExpanded(true);
      focusInput();
      return;
    }
    setSpinning(true);
  };

  // 스핀 애니메이션 종료 → 비로소 펼침(width 확장). 시퀀싱의 두 번째 단계
  const handleSpinEnd = () => {
    setSpinning(false);
    setExpanded(true);
    focusInput();
  };

  // 닫기(X)(또는 Esc) → 접힘 = 검색 초기화. ?q= 만 제거, tags 는 보존
  const handleCollapse = () => {
    setExpanded(false);
    setValue('');
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('q');
      const qs = params.toString();
      router.replace(qs ? `/blog?${qs}` : '/blog', { scroll: false });
    });
  };

  return (
    <div
      className={s.root}
      data-expanded={expanded || undefined}
      data-spinning={spinning || undefined}>
      {/* 접힘일 땐 펼침 트리거, 펼침일 땐 선두 아이콘. 펼침 시 탭 순서에서 제외.
          onAnimationEnd: 스핀 keyframe 종료 시점에 펼침으로 전환 */}
      <button
        type='button'
        className={s.searchBtn}
        onClick={handleExpand}
        onAnimationEnd={handleSpinEnd}
        aria-label='검색 열기'
        aria-expanded={expanded}
        tabIndex={expanded ? -1 : 0}>
        <HiOutlineMagnifyingGlass aria-hidden />
      </button>

      <input
        ref={inputRef}
        className={s.input}
        type='search'
        placeholder='제목, 설명, 태그로 검색...'
        value={value}
        onChange={(e) => {
          return handleChange(e.target.value);
        }}
        onKeyDown={(e) => {
          // Esc = 닫기 버튼과 동일 (접힘 + 검색 초기화)
          if (e.key === 'Escape') {
            handleCollapse();
          }
        }}
        aria-label='블로그 검색'
        aria-hidden={!expanded}
        tabIndex={expanded ? 0 : -1}
      />

      {/* 닫기(X) — 펼침일 때만 조작 가능(접힘 시 CSS로 비활성) */}
      <button
        type='button'
        className={s.collapseBtn}
        onClick={handleCollapse}
        aria-label='검색 닫기'
        tabIndex={expanded ? 0 : -1}>
        <HiOutlineXMark aria-hidden />
      </button>
    </div>
  );
}
