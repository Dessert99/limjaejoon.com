/** HeroNav 테스트 — 랜드마크와 항목 나열 계약을 검증한다 */
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HERO_NAV } from '../../config/navigation';
import { HeroNav } from './HeroNav';

describe('HeroNav', () => {
  it('navigation 랜드마크 안에 항목을 config 순서대로 늘어놓는다', () => {
    render(<HeroNav />);

    const links = within(screen.getByRole('navigation')).getAllByRole('link');

    expect(
      links.map((link) => {
        return [link.textContent, link.getAttribute('href')];
      })
    ).toEqual(
      HERO_NAV.map((item) => {
        return [item.label, item.href];
      })
    );
  });
});
