/** HomePage 테스트 — 섹션 조립과 문서 수준 접근성 계약을 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from './page';

describe('HomePage', () => {
  it('main 엘리먼트 하나만 렌더한다', () => {
    render(<HomePage />);

    expect(screen.getAllByRole('main')).toHaveLength(1);
  });

  it('h1 은 페이지에 하나뿐이다', () => {
    render(<HomePage />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('모든 섹션이 이름을 가진 region 으로 노출된다', () => {
    // 이름 없는 section 은 랜드마크로 노출되지 않아 목록 탐색에서 통째로 사라진다 — 개수를 맞춰 누락을 잡는다
    const { container } = render(<HomePage />);

    const regions = screen.getAllByRole('region');

    expect(regions).toHaveLength(container.querySelectorAll('section').length);
    for (const region of regions) {
      expect(region).toHaveAccessibleName();
    }
  });
});
