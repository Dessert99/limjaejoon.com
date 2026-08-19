import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SITE_NAV } from '../../config/navigation';
import { HomeNav } from './HomeNav';

const DESTINATIONS = SITE_NAV.map((item) => {
  return [item.label, item.href];
});

function menuButton(): HTMLElement {
  return screen.getByRole('button', { hidden: true });
}

function toDestinations(links: HTMLElement[]): (string | null)[][] {
  return links.map((link) => {
    return [link.textContent, link.getAttribute('href')];
  });
}

describe('HomeNav', () => {
  it('navigation 랜드마크 안에 항목을 config 순서대로 늘어놓는다', () => {
    render(<HomeNav />);

    const links = within(screen.getByRole('navigation')).getAllByRole('link');

    expect(toDestinations(links)).toEqual(DESTINATIONS);
  });

  it('사이드바는 상단 나열과 같은 목적지를 같은 순서로 담는다', () => {
    render(<HomeNav />);

    const panel = screen.getByRole('dialog', { hidden: true });
    const links = within(panel).getAllByRole('link', { hidden: true });

    expect(toDestinations(links)).toEqual(DESTINATIONS);
  });

  it('손잡이를 누르면 열림 상태를 알리고 다시 누르면 되돌린다', async () => {
    const user = userEvent.setup();
    render(<HomeNav />);

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
    render(<HomeNav />);

    await user.click(menuButton());
    await user.keyboard('{Escape}');

    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('손잡이가 제어하는 패널을 aria-controls 로 가리킨다', () => {
    render(<HomeNav />);

    const button = menuButton();
    const panel = screen.getByRole('dialog', { hidden: true });

    expect(button.getAttribute('aria-controls')).toBe(panel.id);
  });
});
