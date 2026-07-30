/** MaskReveal 테스트 — 서버 렌더에 은닉이 없다는 계약과 stagger 배수 전달을 검증한다 */
import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { STAGGER_MAX_STEPS } from '@/shared/lib';
import { MaskReveal } from './MaskReveal';

describe('MaskReveal', () => {
  it('children 을 그대로 렌더한다', () => {
    render(<MaskReveal>가려졌다 올라오는 문장</MaskReveal>);

    expect(screen.getByText('가려졌다 올라오는 문장')).toBeInTheDocument();
  });

  it('서버 렌더 결과에는 은닉 상태가 없다', () => {
    // JS 가 죽거나 아직 안 붙은 순간에도 콘텐츠가 보여야 한다 — 설계 7.4
    const html = renderToStaticMarkup(
      <MaskReveal>서버에서 온 문장</MaskReveal>
    );

    expect(html).toContain('서버에서 온 문장');
    expect(html).toContain('data-reveal="idle"');
    expect(html).not.toContain('data-reveal="out"');
  });

  it('stagger 배수는 최대 단계에서 멈춘다', () => {
    const { container } = render(
      <MaskReveal staggerIndex={STAGGER_MAX_STEPS + 5}>문장</MaskReveal>
    );

    expect(container.querySelector('[data-reveal]')).toHaveStyle({
      '--stagger': String(STAGGER_MAX_STEPS),
    });
  });
});
