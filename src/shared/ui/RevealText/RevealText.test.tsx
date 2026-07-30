/** RevealText 테스트 — 분리 단위와 "원문은 한 번만 읽힌다" 는 접근성 계약을 검증한다 */
import { render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { STAGGER_MAX_STEPS } from '@/shared/lib';
import { RevealText } from './RevealText';

describe('RevealText', () => {
  it('원문은 스크린리더용으로 한 번만 남고 조각은 감춘다', () => {
    const { container } = render(
      <RevealText unit='word'>안녕 세상</RevealText>
    );

    const readable = container.querySelector('.sr-only');
    const decorative = container.querySelector('[aria-hidden="true"]');

    expect(readable).toHaveTextContent('안녕 세상');
    expect(decorative).toHaveTextContent('안녕 세상');
    expect(container.querySelectorAll('[data-reveal]')).toHaveLength(2);
  });

  it('word 단위는 어절 수만큼 조각을 만든다', () => {
    const { container } = render(
      <RevealText unit='word'>세 어절 문장</RevealText>
    );

    expect(container.querySelectorAll('[data-reveal]')).toHaveLength(3);
  });

  it('character 단위는 글자 수만큼 조각을 만든다', () => {
    const { container } = render(
      <RevealText unit='character'>가나다</RevealText>
    );

    expect(container.querySelectorAll('[data-reveal]')).toHaveLength(3);
  });

  it('character 단위는 결합 문자를 쪼개지 않는다', () => {
    // 코드 포인트로 자르면 결합 악센트와 ZWJ 이모지가 조각마다 흩어져 글자 모양이 깨진다
    const { container } = render(
      <RevealText unit='character'>{'é👨‍👩‍👧'}</RevealText>
    );

    expect(container.querySelectorAll('[data-reveal]')).toHaveLength(2);
  });

  it('line 단위는 개행으로 쪼갠다', () => {
    const { container } = render(
      <RevealText unit='line'>{'첫 줄\n둘째 줄'}</RevealText>
    );

    expect(container.querySelectorAll('[data-reveal]')).toHaveLength(2);
  });

  it('stagger 배수는 최대 단계에서 멈춘다', () => {
    const text = 'ㄱ'.repeat(STAGGER_MAX_STEPS + 3);
    const { container } = render(
      <RevealText unit='character'>{text}</RevealText>
    );

    const parts = container.querySelectorAll('[data-reveal]');

    expect(parts[parts.length - 1]).toHaveStyle({
      '--stagger': String(STAGGER_MAX_STEPS),
    });
  });

  it('서버 렌더 결과에는 은닉 상태가 없다', () => {
    const html = renderToStaticMarkup(
      <RevealText unit='word'>서버에서 온 문장</RevealText>
    );

    expect(html).toContain('서버에서 온 문장');
    expect(html).not.toContain('data-reveal="out"');
  });
});
