/** 라우트 전환 커튼 테스트 — 모션이 없는 환경에서 커튼이 화면을 가로막지 않는다는 계약을 검증한다 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RouteTransition } from './RouteTransition';
import { TransitionLink } from './TransitionLink';

const push = vi.fn();

vi.mock('next/navigation', () => {
  return {
    useRouter: () => {
      return { push };
    },
    usePathname: () => {
      return '/';
    },
  };
});

const reduceMotion = (reduce: boolean): void => {
  globalThis.matchMedia = ((query: string) => {
    return { matches: reduce, media: query, addEventListener: () => {} };
  }) as unknown as typeof matchMedia;
};

afterEach(() => {
  reduceMotion(false);
});

describe('RouteTransition', () => {
  it('전환 전에는 커튼이 뷰포트 밖에 서 있다', () => {
    render(
      <RouteTransition>
        <p>본문</p>
      </RouteTransition>
    );

    expect(screen.getByTestId('route-curtain')).toHaveClass('bottom-full');
  });

  it('감쇠 환경에서는 링크를 눌러도 커튼을 올리지 않는다', async () => {
    reduceMotion(true);

    render(
      <RouteTransition>
        <TransitionLink href='/blog'>Blog</TransitionLink>
      </RouteTransition>
    );

    await userEvent.click(screen.getByRole('link', { name: 'Blog' }));

    expect(screen.getByTestId('route-curtain')).toHaveTextContent('');
    expect(push).not.toHaveBeenCalled();
  });
});
