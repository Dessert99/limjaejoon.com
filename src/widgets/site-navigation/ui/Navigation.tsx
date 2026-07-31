'use client';

/** 내비게이션 부품 — 데스크톱 목록과 모바일 dialog 가 같은 부품을 골라 쓴다 */
import { useRef, type ComponentPropsWithRef, type ReactNode } from 'react';
import { Container } from '@/shared/ui';
import {
  NavigationContext,
  useNavigation,
  type NavItem,
} from '../model/navigationContext';

// hover·focus 에서 같이 커지는 점 — 색만 바꾸면 어느 항목을 짚었는지가 얕게 읽힌다
const LINK_CLASS =
  'group inline-flex items-center gap-2 text-body text-muted transition-colors duration-quick ease-standard hover:text-foreground focus-visible:text-foreground';

const DOT_CLASS =
  'size-1.5 scale-0 rounded-full bg-accent transition-transform duration-quick ease-standard group-hover:scale-100 group-focus-visible:scale-100';

type ProviderProps = {
  items: readonly NavItem[];
  children: ReactNode;
};

// 목록을 렌더 함수로 받는다 — 부품이 데이터를 내려주는 경우라 children 보다 render prop 이 맞다
type MenuProps = Omit<ComponentPropsWithRef<'ul'>, 'children'> & {
  renderItem: (item: NavItem) => ReactNode;
};

type LinkProps = {
  item: NavItem;
};

/** dialog 참조와 열고·닫고·이동 세 동작을 소유한다 */
function NavigationProvider({ items, children }: ProviderProps) {
  const menuRef = useRef<HTMLDialogElement | null>(null);

  // 콜백 ref 로 넘긴다 — RefObject 를 context 에 실으면 소비 쪽 ref={...} 가 "렌더 중 ref 접근" 으로 걸린다
  const attachDialog = (element: HTMLDialogElement | null): void => {
    menuRef.current = element;
  };

  // showModal 이라야 Escape 닫기와 포커스 가둠을 브라우저가 대신 해준다(show 는 안 해준다)
  const open = (): void => {
    menuRef.current?.showModal();
  };

  const close = (): void => {
    menuRef.current?.close();
  };

  // 메뉴를 닫고 목적지로 포커스까지 옮긴다 — 화면만 스크롤되면 포커스가 뒤에 남아 눈과 손이 갈린다
  const navigate = (href: string): void => {
    close();
    const target = document.querySelector(href);

    if (target instanceof HTMLElement) {
      target.focus();
    }
  };

  return (
    <NavigationContext
      value={{
        state: { items },
        actions: { open, close, navigate },
        meta: { attachDialog },
      }}>
      {children}
    </NavigationContext>
  );
}

/** 상단 고정 골격 — fixed 다. Hero 가 min-h-svh 라 sticky 면 첫 화면을 다 지나야 나타난다 */
/* Bar 와 MenuDialog 를 형제로 받는다 — dialog 는 header 안이되 Container 밖이어야 전체 화면을 덮는다 */
function NavigationRoot({ children }: { children: ReactNode }) {
  return (
    <header className='fixed inset-x-0 top-0 z-(--ds-z-navigation)'>
      {children}
    </header>
  );
}

/** 헤더 한 줄 — 높이를 토큰으로 고정한다. global.css 의 scroll-padding-top 이 같은 값을 본다 */
function NavigationBar({ children }: { children: ReactNode }) {
  return (
    <Container
      size='wide'
      className='flex h-header items-center justify-between'>
      {children}
    </Container>
  );
}

/** 홈으로 돌아가는 사이트 이름 */
function NavigationBrand({ children }: { children: ReactNode }) {
  return (
    <a
      href='#top'
      className='text-body font-medium text-foreground'>
      {children}
    </a>
  );
}

/** 항목 목록 — ul·li·key 배선을 소유하고 링크 표현만 넘긴다. 순회가 여기 한 번뿐이다 */
function NavigationMenu({ renderItem, ...rest }: MenuProps) {
  const { state } = useNavigation();

  return (
    <ul {...rest}>
      {state.items.map((item) => {
        return <li key={item.href}>{renderItem(item)}</li>;
      })}
    </ul>
  );
}

/** 데스크톱 항목 링크 — 앵커 기본 동작에 맡긴다 */
function NavigationLink({ item }: LinkProps) {
  return (
    <a
      href={item.href}
      className={LINK_CLASS}>
      <span
        aria-hidden='true'
        className={DOT_CLASS}
      />
      {item.label}
    </a>
  );
}

/** 모바일 메뉴 여는 버튼 */
function NavigationMenuTrigger({ children }: { children: ReactNode }) {
  const { actions } = useNavigation();

  return (
    <button
      type='button'
      onClick={actions.open}
      className='text-body text-muted transition-colors duration-quick ease-standard hover:text-foreground md:hidden'>
      {children}
    </button>
  );
}

/** 네이티브 dialog — Escape·포커스 가둠·backdrop 을 브라우저가 처리해 Radix 가 필요 없다 */
function NavigationMenuDialog({ children }: { children: ReactNode }) {
  const { actions, meta } = useNavigation();

  return (
    <dialog
      // 인라인 콜백이라야 한다 — context 에서 꺼낸 값을 그대로 ref 에 주면 react-hooks/refs 가 막는다
      ref={(element) => {
        meta.attachDialog(element);
      }}
      // dialog 자체에 이름을 준다 — 안쪽 nav 의 이름은 모달의 이름으로 쓰이지 않는다
      aria-label='모바일 메뉴'
      className='h-svh max-h-none w-full max-w-none bg-surface text-foreground backdrop:bg-background/80'>
      <Container
        size='wide'
        className='flex h-full flex-col'>
        <div className='flex h-header items-center justify-end'>
          <button
            type='button'
            onClick={actions.close}
            className='text-body text-muted'>
            메뉴 닫기
          </button>
        </div>
        {children}
      </Container>
    </dialog>
  );
}

/** 모바일 항목 링크 — 같은 문서 앵커라 이동해도 dialog 가 저절로 닫히지 않는다 */
function NavigationMenuLink({ item }: LinkProps) {
  const { actions } = useNavigation();

  return (
    <a
      href={item.href}
      onClick={() => {
        actions.navigate(item.href);
      }}
      className='text-section text-foreground'>
      {item.label}
    </a>
  );
}

/** 내비게이션 부품 묶음 */
export const Navigation = {
  Provider: NavigationProvider,
  Root: NavigationRoot,
  Bar: NavigationBar,
  Brand: NavigationBrand,
  Menu: NavigationMenu,
  Link: NavigationLink,
  MenuTrigger: NavigationMenuTrigger,
  MenuDialog: NavigationMenuDialog,
  MenuLink: NavigationMenuLink,
};
