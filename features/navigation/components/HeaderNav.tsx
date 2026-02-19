// 메뉴 링크 렌더를 위해 Next Link를 사용합니다.
import Link from 'next/link';

// 메뉴 타입과 재사용성을 맞추기 위해 NavItem 타입을 import 합니다.
import type { NavItem } from '@/features/navigation/types';

interface HeaderNavProps {
  // 렌더할 메뉴 항목 배열입니다.
  items: NavItem[];
  // 현재 pathname입니다.
  pathname: string;
}

// 단일 메뉴 항목이 현재 경로에서 활성화 상태인지 계산합니다.
function isNavItemActive(item: NavItem, pathname: string) {
  if (item.matchMode === 'exact') {
    // exact 매칭은 현재 경로가 완전히 같을 때만 활성화합니다.
    return pathname === item.href;
  }
  // prefix 매칭은 기준 경로 또는 하위 경로일 때 활성화합니다.
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

// 헤더 중앙 영역에 노출되는 전역 메뉴 컴포넌트입니다.
export function HeaderNav({ items, pathname }: HeaderNavProps) {
  return (
    <nav aria-label='주요 메뉴'>
      <ul className='flex items-center justify-center gap-3 md:gap-6'>
        {/* 메뉴 항목을 순회하며 링크 버튼을 렌더합니다. */}
        {items.map((item) => {
          // 현재 메뉴의 active 상태를 계산합니다.
          const isActive = isNavItemActive(item, pathname);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[
                  // 공통 메뉴 형태를 정의합니다.
                  'inline-flex items-center rounded-[10px] border border-transparent px-2.5 py-1 text-sm font-semibold md:text-base',
                  // 활성 메뉴는 그린 계열로 강조하고, 비활성 메뉴는 보조 텍스트 톤을 사용합니다.
                  isActive
                    ? 'border-(--line-strong) bg-(--accent-green-soft) text-(--accent-green-strong)'
                    : 'text-(--text-secondary) transition-colors hover:text-(--text-primary)',
                ].join(' ')}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
