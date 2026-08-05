/** MaskReveal 테스트 — 서버 렌더에 은닉이 없다는 계약과 stagger 배수 전달을 검증한다 */
import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { STAGGER_MAX_STEPS } from '@/shared/motion';
import { MaskReveal } from './MaskReveal';

describe('MaskReveal', () => {
  it('children 을 그대로 렌더한다', () => {
    render(<MaskReveal>가려졌다 올라오는 문장</MaskReveal>);

    expect(screen.getByText('가려졌다 올라오는 문장')).toBeInTheDocument();
  });

  it('서버 렌더 결과에는 은닉이 없다', () => {
    // JS 가 죽거나 아직 안 붙은 순간에도 콘텐츠가 보여야 한다 — 은닉은 gsap.from 이 마운트 뒤에 건다
    const html = renderToStaticMarkup(
      <MaskReveal>서버에서 온 문장</MaskReveal>
    );

    expect(html).toContain('서버에서 온 문장');
    expect(html).not.toContain('visibility');
    expect(html).not.toContain('opacity');
    expect(html).not.toContain('translate');
  });

  it('움직이는 층을 data-reveal 로 표시한다', () => {
    // 셀렉터는 data-* 다 — 스타일 클래스를 쓰면 디자인 수정이 애니메이션을 조용히 끊는다
    const { container } = render(<MaskReveal>문장</MaskReveal>);

    expect(container.querySelector('[data-reveal]')).toBeInTheDocument();
  });

  it('stagger 배수는 최대 단계에서 멈춘다', () => {
    const { container } = render(
      <MaskReveal staggerIndex={STAGGER_MAX_STEPS + 5}>문장</MaskReveal>
    );

    expect(container.querySelector('[data-reveal]')).toHaveAttribute(
      'data-stagger',
      String(STAGGER_MAX_STEPS)
    );
  });
});
