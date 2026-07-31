/** HomePage 테스트 — 섹션 조립과 문서 수준 접근성 계약을 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NAV_ITEMS } from '@/widgets/site-navigation';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('main 엘리먼트 하나만 렌더한다', () => {
    render(<HomePage />);

    expect(screen.getAllByRole('main')).toHaveLength(1);
  });

  it('h1 은 페이지에 하나뿐이다', () => {
    render(<HomePage />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('내비게이션이 가리키는 앵커가 모두 실재한다', () => {
    // 목적지 없는 앵커는 눌러도 아무 일이 안 일어나고 에러도 안 난다 — 조립에서만 드러난다
    const { container } = render(<HomePage />);

    for (const item of NAV_ITEMS) {
      expect(container.querySelector(item.href)).not.toBeNull();
    }
  });

  it('모든 섹션이 이름을 가진 region 으로 노출된다', () => {
    render(<HomePage />);

    const regions = screen.getAllByRole('region');

    expect(regions.length).toBeGreaterThanOrEqual(5);
    for (const region of regions) {
      expect(region).toHaveAccessibleName();
    }
  });

  it('banner 와 contentinfo 랜드마크를 하나씩 둔다', () => {
    render(<HomePage />);

    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
  });
});
