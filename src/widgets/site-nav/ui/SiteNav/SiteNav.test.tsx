/** SiteNav 테스트 — 나열·사이드바가 같은 목적지를 담고, 손잡이가 여닫힘을 알린다는 계약을 검증한다 */
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SITE_NAV } from '../../config/navigation';
import { SiteNav } from './SiteNav';

/** 목적지 목록 — 나열과 사이드바가 함께 지켜야 하는 순서다 */
const DESTINATIONS = SITE_NAV.map((item) => {
  return [item.label, item.href];
});

// 이름으로 찾지 않는다 — 나열이 펼쳐진 동안 GSAP 이 손잡이의 visibility 를 끄고, 그러면 접근성 이름까지 빈 문자열이 된다
/** 손잡이 — 트리에 버튼은 이것 하나다. 고지 내용은 이름 대신 속성과 글자로 확인한다 */
function menuButton(): HTMLElement {
  return screen.getByRole('button', { hidden: true });
}

/** 링크 묶음을 [글자, 목적지] 로 편다 */
function toDestinations(links: HTMLElement[]): (string | null)[][] {
  return links.map((link) => {
    return [link.textContent, link.getAttribute('href')];
  });
}

describe('SiteNav', () => {
  it('navigation 랜드마크 안에 항목을 config 순서대로 늘어놓는다', () => {
    render(<SiteNav />);

    const links = within(screen.getByRole('navigation')).getAllByRole('link');

    expect(toDestinations(links)).toEqual(DESTINATIONS);
  });

  it('사이드바는 상단 나열과 같은 목적지를 같은 순서로 담는다', () => {
    render(<SiteNav />);

    const panel = screen.getByRole('dialog', { hidden: true });
    const links = within(panel).getAllByRole('link', { hidden: true });

    expect(toDestinations(links)).toEqual(DESTINATIONS);
  });

  it('손잡이를 누르면 열림 상태를 알리고 다시 누르면 되돌린다', async () => {
    const user = userEvent.setup();
    render(<SiteNav />);

    const button = menuButton();

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveTextContent('메뉴 열기');

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveTextContent('메뉴 닫기');

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveTextContent('메뉴 열기');
  });

  it('Escape 로 사이드바를 닫는다', async () => {
    const user = userEvent.setup();
    render(<SiteNav />);

    await user.click(menuButton());
    await user.keyboard('{Escape}');

    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('손잡이가 제어하는 패널을 aria-controls 로 가리킨다', () => {
    render(<SiteNav />);

    const button = menuButton();
    const panel = screen.getByRole('dialog', { hidden: true });

    expect(button.getAttribute('aria-controls')).toBe(panel.id);
  });
});
