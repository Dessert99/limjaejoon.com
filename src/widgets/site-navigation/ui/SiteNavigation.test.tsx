/** SiteNavigation 테스트 — 항목 노출과 모바일 메뉴의 열고 닫기 배선을 검증한다 */
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { NAV_ITEMS } from '../config/navItems';
import { SiteNavigation } from './SiteNavigation';

describe('SiteNavigation', () => {
  it('banner 랜드마크로 렌더한다', () => {
    render(<SiteNavigation />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('모든 항목이 링크로 닿는다', () => {
    render(<SiteNavigation />);

    for (const item of NAV_ITEMS) {
      // 데스크톱 목록과 모바일 메뉴가 같은 항목을 각각 그리므로 하나 이상이면 된다
      expect(
        screen.getAllByRole('link', { name: item.label }).length
      ).toBeGreaterThan(0);
    }
  });

  it('모바일 메뉴는 닫힌 채로 시작한다', () => {
    render(<SiteNavigation />);

    expect(screen.getByRole('dialog', { hidden: true })).not.toBeVisible();
  });

  it('여는 버튼을 누르면 모바일 메뉴가 열린다', async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    await user.click(screen.getByRole('button', { name: '메뉴 열기' }));

    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('메뉴에서 이동하면 목적지로 포커스를 옮긴다', async () => {
    // 화면만 스크롤되고 포커스가 메뉴 버튼에 남으면 키보드·스크린리더 사용자는 눈과 손이 갈린다
    const user = userEvent.setup();
    render(
      <>
        <SiteNavigation />
        <section
          id={NAV_ITEMS[0].href.slice(1)}
          tabIndex={-1}>
          목적지
        </section>
      </>
    );

    await user.click(screen.getByRole('button', { name: '메뉴 열기' }));
    const menu = screen.getByRole('dialog');
    await user.click(
      within(menu).getByRole('link', { name: NAV_ITEMS[0].label })
    );

    expect(screen.getByText('목적지')).toHaveFocus();
  });

  it('메뉴 안 링크를 누르면 메뉴가 닫힌다', async () => {
    // 같은 문서 안 앵커라 이동해도 dialog 가 저절로 닫히지 않는다 — 안 닫으면 목적지를 가린다
    const user = userEvent.setup();
    render(<SiteNavigation />);

    await user.click(screen.getByRole('button', { name: '메뉴 열기' }));
    const menu = screen.getByRole('dialog');
    await user.click(
      within(menu).getByRole('link', { name: NAV_ITEMS[0].label })
    );

    expect(menu).not.toBeVisible();
  });
});
