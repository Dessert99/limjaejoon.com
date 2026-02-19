'use client';

// 스크롤 상태 관리를 위해 React 훅을 사용합니다.
import { useEffect, useRef, useState } from 'react';
// 현재 경로를 읽어 active 메뉴와 홈 전용 동작을 제어합니다.
import { usePathname } from 'next/navigation';
// 좌측 로고 클릭 시 홈으로 이동하기 위해 Link를 사용합니다.
import Link from 'next/link';
// 헤더 로고 이미지를 최적화 렌더링하기 위해 Image를 사용합니다.
import Image from 'next/image';

// 전역 메뉴 설정값을 가져옵니다.
import { HeaderNav } from '@/features/navigation/components/HeaderNav';
import { HomeSearchShell } from '@/features/navigation/components/HomeSearchShell';
import { navItems } from '@/features/navigation/config/navItems';

// 블로그 헤더가 축소 상태로 전환되는 스크롤 기준(px)입니다.
const BLOG_COLLAPSE_SCROLL_Y = 72;

// 앱 전역 헤더 컴포넌트입니다.
export function SiteHeader() {
  // 현재 URL 경로를 읽어 페이지별 헤더 모드를 결정합니다.
  const pathname = usePathname();
  // 블로그 스크롤에 따라 nav 축소 여부를 저장합니다.
  const [isCollapsed, setIsCollapsed] = useState(false);
  // 스크롤 이벤트마다 이전 축소 상태를 저장해 불필요한 리렌더를 줄입니다.
  const collapsedRef = useRef(false);
  // 검색창 입력값을 확장/축소 두 상태에서 동일하게 유지합니다.
  const [searchQuery, setSearchQuery] = useState('');
  // 블로그 여부를 계산해 검색 행 렌더/스크롤 로직 적용 범위를 제한합니다.
  const isBlogRoute = pathname === '/blog';
  // 블로그에서만 nav 축소를 허용해 다른 페이지 동작을 단순화합니다.
  const shouldCollapseNav = isBlogRoute && isCollapsed;

  useEffect(() => {
    if (!isBlogRoute) {
      // 블로그 외 페이지에서는 블로그 전용 스크롤 전환 로직을 비활성화합니다.
      return;
    }

    // 스크롤 이벤트 시 임계값 기준으로 축소 여부를 즉시 스냅 전환합니다.
    const handleScroll = () => {
      // 현재 세로 스크롤 값을 읽습니다.
      const currentScrollY = window.scrollY;
      // 단일 임계값을 넘었는지 계산해 축소 여부를 결정합니다.
      const nextCollapsed = currentScrollY >= BLOG_COLLAPSE_SCROLL_Y;

      if (collapsedRef.current === nextCollapsed) {
        // 이전 축소 상태와 동일하면 상태 업데이트를 생략합니다.
        return;
      }

      // 변경된 축소 상태를 ref/state에 동기화합니다.
      collapsedRef.current = nextCollapsed;
      setIsCollapsed(nextCollapsed);
    };

    // 첫 렌더 직후에도 현재 스크롤 위치를 반영합니다.
    handleScroll();
    // 스크롤 이벤트를 구독해 실시간으로 헤더 상태를 갱신합니다.
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      // 컴포넌트 언마운트/경로 전환 시 리스너를 정리합니다.
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isBlogRoute]);

  return (
    <header className='fixed top-0 right-0 left-0 z-50 border-b border-(--line-soft) bg-(--bg-page)'>
      <div className='mx-auto w-full max-w-[1200px] px-4 md:px-6'>
        <div
          className={[
            // 헤더 1행은 좌측 로고 / 중앙 nav(or 검색) / 우측 유틸 3열 구조를 사용합니다.
            'grid h-[72px] items-center gap-x-4',
            // 좌측 로고는 50px 고정, 중앙은 유동 폭, 우측은 내용 폭에 맞춥니다.
            'grid-cols-[50px_minmax(0,1fr)_auto]',
          ].join(' ')}>
          <Link
            // 로고를 누르면 홈으로 이동합니다.
            href='/'
            // 링크 용도를 스크린 리더에 전달합니다.
            aria-label='홈으로 이동'
            className='col-start-1 row-start-1 inline-flex h-[50px] w-[50px] overflow-hidden rounded-full border border-(--line-soft) bg-(--bg-soft)'>
            <Image
              // 사용자가 지정한 public 이미지 경로를 로고로 사용합니다.
              src='/images/logo.png'
              // 로고 대체 텍스트입니다.
              alt='프로필 로고'
              // 요청사항에 맞게 50px 고정 크기를 사용합니다.
              width={50}
              height={50}
              // 원형 프레임을 꽉 채우도록 커버 모드를 적용합니다.
              className='h-[50px] w-[50px] object-cover'
              // 헤더 핵심 자산이므로 우선 로드합니다.
              priority
            />
          </Link>

          <div
            className={[
              'col-start-2 row-start-1 min-w-0',
              // 축소 상태에서는 중앙 컬럼을 가득 사용해 compact 검색바가 실제로 넓어지게 합니다.
              shouldCollapseNav
                ? 'w-full justify-self-stretch'
                : 'justify-self-center',
            ].join(' ')}>
            {isBlogRoute && shouldCollapseNav ? (
              <HomeSearchShell
                // 축소 상태에서는 검색창이 네비 자리(1행 중앙)를 차지합니다.
                compact
                // 검색 입력값은 헤더 내부 상태로 유지합니다.
                value={searchQuery}
                // 입력 변경 이벤트를 상태 변경 함수로 연결합니다.
                onChange={setSearchQuery}
              />
            ) : (
              <HeaderNav
                items={navItems}
                pathname={pathname}
              />
            )}
          </div>

          <div className='col-start-3 row-start-1 justify-self-end flex items-center gap-2 md:gap-3'>
            {/* 우측 슬롯은 향후 CTA/프로필 등을 넣기 위한 고정 자리입니다. */}
            <div
              aria-hidden='true'
              className='h-9 w-9 rounded-full border border-(--line-soft) bg-(--bg-soft) md:h-10 md:w-10'
            />
            <div
              aria-hidden='true'
              className='h-9 w-9 rounded-full border border-(--line-soft) bg-(--bg-soft) md:h-10 md:w-10'
            />
            <div
              aria-hidden='true'
              className='h-9 w-9 rounded-full border border-(--line-soft) bg-(--bg-soft) md:h-10 md:w-10'
            />
          </div>
        </div>

        {isBlogRoute && !shouldCollapseNav ? (
          <div className='border-t border-(--line-soft) pt-3 pb-4'>
            <HomeSearchShell
              // 확장 상태에서는 2행 검색창을 크게 노출합니다.
              compact={false}
              // 검색 입력값은 헤더 내부 상태로 유지합니다.
              value={searchQuery}
              // 입력 변경 이벤트를 상태 변경 함수로 연결합니다.
              onChange={setSearchQuery}
            />
          </div>
        ) : null}
      </div>
    </header>
  );
}
