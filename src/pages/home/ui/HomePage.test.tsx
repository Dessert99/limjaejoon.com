/** HomePage 테스트 — 섹션 조립 계약만 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { profile } from '@/entities/profile';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('소개 섹션의 이름을 최상위 제목으로 노출한다', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      profile.name
    );
  });

  it('도시와 강가 두 장면을 각각의 섹션으로 쌓는다', () => {
    const { container } = render(<HomePage />);

    expect(container.querySelectorAll('section')).toHaveLength(2);
    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });

  it('폐기한 보유 기술·프로젝트 섹션을 더 이상 렌더하지 않는다', () => {
    render(<HomePage />);

    expect(screen.queryByRole('heading', { name: '보유 기술' })).toBeNull();
    expect(screen.queryByRole('heading', { name: '프로젝트' })).toBeNull();
  });
});
