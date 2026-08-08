/** StackSection 테스트 — 스크립트가 없어도 남아야 하는 것과 마퀴 복사본의 노출 계약을 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { STACK_MARQUEE } from '../../config/stack';
import { StackSection } from './StackSection';

describe('StackSection', () => {
  it('여는 문장을 h2 로 렌더하고 그 이름으로 region 랜드마크가 된다', () => {
    render(<StackSection />);

    const heading = screen.getByRole('heading', { level: 2 });

    expect(
      screen.getByRole('region', { name: heading.textContent ?? '' })
    ).toBeInTheDocument();
  });

  it('경과일을 초기 렌더에 이미 찍어 둔다', () => {
    // 롤업은 이 값을 오늘로 고쳐 굴릴 뿐이다 — 스크립트가 죽어도 숫자가 남아야 한다
    render(<StackSection />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /^개발을 시작한 지 [\d,]+일째입니다$/
    );
  });

  it('마퀴 반복 복사본은 한 벌만 남기고 접근성 트리에서 숨긴다', () => {
    render(<StackSection />);

    for (const name of STACK_MARQUEE.flat()) {
      const copies = screen.getAllByText(name).filter((chip) => {
        return chip.closest('[data-marquee-copy]') !== null;
      });
      const exposed = copies.filter((chip) => {
        return chip.closest('[aria-hidden="true"]') === null;
      });

      expect(copies.length).toBeGreaterThan(1);
      expect(exposed).toHaveLength(1);
    }
  });
});
