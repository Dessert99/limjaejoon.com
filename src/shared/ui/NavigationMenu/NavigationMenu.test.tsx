import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { NavigationMenu } from './NavigationMenu';

// 드롭다운 항목 하나 + 활성 링크 하나짜리 내비 — 동작 검증용 공통 마크업
function renderNav() {
  return render(
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>제품</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href='/blog'>블로그</NavigationMenu.Link>
            <NavigationMenu.Link href='/about'>소개</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            href='/'
            active>
            홈
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

describe('NavigationMenu', () => {
  it('트리거를 클릭하면 콘텐츠 링크가 열린다', async () => {
    renderNav();

    const trigger = screen.getByRole('button', { name: '제품' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByRole('link', { name: '블로그' })
    ).not.toBeInTheDocument();

    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: '블로그' })).toBeInTheDocument();
  });

  it('활성 링크는 aria-current="page"를 가진다', () => {
    renderNav();

    expect(screen.getByRole('link', { name: '홈' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('Root는 main 내비게이션으로 렌더된다', () => {
    renderNav();

    expect(
      screen.getByRole('navigation', { name: 'Main' })
    ).toBeInTheDocument();
  });
});
