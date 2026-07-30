/** Marquee 테스트 — 이음매 없는 루프의 전제(두 벌)와 복제본 감추기를 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Marquee } from './Marquee';

describe('Marquee', () => {
  it('이음매 없는 루프를 위해 콘텐츠를 두 벌 깐다', () => {
    render(<Marquee>흐르는 문구</Marquee>);

    expect(screen.getAllByText('흐르는 문구')).toHaveLength(2);
  });

  it('복제본만 스크린리더에서 감춰 문구가 두 번 읽히지 않는다', () => {
    const { container } = render(<Marquee>흐르는 문구</Marquee>);

    const hidden = container.querySelectorAll('[aria-hidden="true"]');

    expect(hidden).toHaveLength(1);
    expect(hidden[0]).toHaveTextContent('흐르는 문구');
  });

  it('복제본은 키보드 탭 순서에서도 빠진다', () => {
    // aria-hidden 은 접근성 트리만 가린다 — 복제된 링크가 그대로 포커스되면 스크린리더에 없는 컨트롤에 닿는다
    const { container } = render(
      <Marquee>
        <a href='#work'>작업 보기</a>
      </Marquee>
    );

    expect(container.querySelector('[aria-hidden="true"]')).toHaveAttribute(
      'inert'
    );
  });

  it('paused 를 주면 트랙이 멈춤 상태로 표시된다', () => {
    const { container } = render(<Marquee paused>문구</Marquee>);

    expect(container.querySelector('[data-marquee-paused]')).toHaveAttribute(
      'data-marquee-paused',
      'true'
    );
  });

  it('방향과 속도를 CSS 가 읽을 속성으로 넘긴다', () => {
    const { container } = render(
      <Marquee
        direction='right'
        speed='fast'>
        문구
      </Marquee>
    );

    const track = container.querySelector('[data-marquee-direction]');

    expect(track).toHaveAttribute('data-marquee-direction', 'right');
    expect(track).toHaveAttribute('data-marquee-speed', 'fast');
  });
});
