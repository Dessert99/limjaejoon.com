/** HomePage 테스트 — 빈 껍데기 계약만 검증한다 */
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('main 엘리먼트 하나만 렌더한다', () => {
    const { container } = render(<HomePage />);

    expect(container.querySelectorAll('main')).toHaveLength(1);
  });

  it('철거한 섹션을 더 이상 렌더하지 않는다', () => {
    const { container } = render(<HomePage />);

    expect(container.querySelectorAll('section')).toHaveLength(0);
  });
});
