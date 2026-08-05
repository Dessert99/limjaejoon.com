/** MediaReveal 테스트 — 두 층이 서로 다른 프로퍼티를 소유한다는 계약과 SSR 안전성을 검증한다 */
import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { STAGGER_MAX_STEPS } from '../../lib';
import { MediaReveal } from './MediaReveal';

describe('MediaReveal', () => {
  it('children 을 그대로 렌더한다', () => {
    render(<MediaReveal>덮개가 열리며 드러나는 이미지</MediaReveal>);

    expect(
      screen.getByText('덮개가 열리며 드러나는 이미지')
    ).toBeInTheDocument();
  });

  it('마스크 층과 스케일 층이 따로 표시된다', () => {
    // 한 엘리먼트가 clip-path 와 scale 을 같이 잡으면 나중에 얹히는 변환이 앞의 것을 덮는다
    const { container } = render(<MediaReveal>이미지</MediaReveal>);

    const mask = container.querySelector('[data-media-reveal]');
    const scale = container.querySelector('[data-media-scale]');

    expect(mask).not.toBeNull();
    expect(scale).not.toBeNull();
    expect(mask).not.toBe(scale);
    expect(mask).toContainElement(scale as HTMLElement);
  });

  it('소비자 style 을 그대로 받는다', () => {
    const { container } = render(
      <MediaReveal style={{ opacity: 0.5 }}>이미지</MediaReveal>
    );

    expect(container.querySelector('[data-media-reveal]')).toHaveStyle({
      opacity: '0.5',
    });
  });

  it('서버 렌더 결과에는 은닉이 없다', () => {
    // 은닉은 gsap.from 이 마운트 뒤에 건다 — JS 가 죽어도 이미지가 덮개에 가려지지 않는다
    const html = renderToStaticMarkup(<MediaReveal>이미지</MediaReveal>);

    // 소비자가 style 을 안 넘기면 인라인 스타일이 아예 없어야 한다 — 은닉이 남을 자리가 그곳뿐이다
    expect(html).toContain('이미지');
    expect(html).not.toContain('style=');
  });

  it('stagger 배수는 최대 단계에서 멈춘다', () => {
    const { container } = render(
      <MediaReveal staggerIndex={STAGGER_MAX_STEPS + 4}>이미지</MediaReveal>
    );

    expect(container.querySelector('[data-media-reveal]')).toHaveAttribute(
      'data-stagger',
      String(STAGGER_MAX_STEPS)
    );
  });
});
