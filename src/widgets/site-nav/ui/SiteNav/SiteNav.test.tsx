/** SiteNav 테스트 — 나열·사이드바가 같은 목적지를 담고, 손잡이가 여닫힘을 알린다는 계약을 검증한다 */
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SITE } from '@/shared/config';
import { SITE_NAV } from '../../config/navigation';
import { SiteNav } from './SiteNav';

/** 홈을 맨 앞에 둔 목적지 목록 — 나열과 사이드바가 함께 지켜야 하는 순서다 */
const DESTINATIONS = [
  [SITE.name, '/'],
  ...SITE_NAV.map((item) => {
    return [item.label, item.href];
  }),
];

/** 링크 묶음을 [글자, 목적지] 로 편다 */
function toDestinations(links: HTMLElement[]): (string | null)[][] {
  return links.map((link) => {
    return [link.textContent, link.getAttribute('href')];
  });
}

describe('SiteNav', () => {
  it('navigation 랜드마크 안에 홈을 맨 앞에 두고 항목을 config 순서대로 늘어놓는다', () => {
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

    const button = screen.getByRole('button', { name: '메뉴 열기' });

    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);
    expect(screen.getByRole('button', { name: '메뉴 닫기' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    await user.click(screen.getByRole('button', { name: '메뉴 닫기' }));
    expect(screen.getByRole('button', { name: '메뉴 열기' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('Escape 로 사이드바를 닫는다', async () => {
    const user = userEvent.setup();
    render(<SiteNav />);

    await user.click(screen.getByRole('button', { name: '메뉴 열기' }));
    await user.keyboard('{Escape}');

    expect(screen.getByRole('button', { name: '메뉴 열기' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('손잡이가 제어하는 패널을 aria-controls 로 가리킨다', () => {
    render(<SiteNav />);

    const button = screen.getByRole('button', { name: '메뉴 열기' });
    const panel = screen.getByRole('dialog', { hidden: true });

    expect(button.getAttribute('aria-controls')).toBe(panel.id);
  });
});
