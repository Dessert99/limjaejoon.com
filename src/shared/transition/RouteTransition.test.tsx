/** 라우트 전환 커튼 테스트 — 어떤 이동이 커튼을 타고 어떤 이동이 그냥 흐르는지 검증한다 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RouteTransition } from './RouteTransition';
import { TransitionLink } from './TransitionLink';

const push = vi.fn();

let pathname = '/';

vi.mock('next/navigation', () => {
  return {
    useRouter: () => {
      return { push };
    },
    usePathname: () => {
      return pathname;
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
  push.mockClear();
  pathname = '/';
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

  it('같은 섹션 안 링크는 커튼 없이 이동한다', async () => {
    pathname = '/blog';

    render(
      <RouteTransition>
        <TransitionLink href='/blog/hello-world'>글</TransitionLink>
      </RouteTransition>
    );

    await userEvent.click(screen.getByRole('link', { name: '글' }));

    expect(screen.getByTestId('route-curtain').textContent).toBe('');
    expect(push).not.toHaveBeenCalled();
  });
});
