/** Media 테스트 — 에셋 유무 분기, 비율 배선, LCP 우선순위 계약을 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Media } from './Media';

describe('Media', () => {
  it('src 가 있으면 alt 를 가진 이미지로 렌더한다', () => {
    render(
      <Media
        src='/images/logo.png'
        alt='프로젝트 대표 이미지'
        ratio='thumbnail'
      />
    );

    expect(
      screen.getByRole('img', { name: '프로젝트 대표 이미지' })
    ).toBeInTheDocument();
  });

  it('src 가 없으면 자리표시만 그리고 이미지를 만들지 않는다', () => {
    // 에셋 확보 전 상태 — 빈 img 는 깨진 아이콘을 띄우고 스크린리더에도 잡힌다
    render(
      <Media
        src={null}
        alt='아직 없는 이미지'
        ratio='thumbnail'
      />
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('비율을 CSS 가 읽을 클래스로 넘긴다', () => {
    const { container } = render(
      <Media
        src={null}
        alt='자리표시'
        ratio='gallery'
      />
    );

    expect(container.firstElementChild).toHaveClass('aspect-gallery');
  });

  it('소비자 className 이 기본 비율을 덮는다', () => {
    const { container } = render(
      <Media
        src={null}
        alt='자리표시'
        ratio='thumbnail'
        className='aspect-hero'
      />
    );

    const root = container.firstElementChild;

    expect(root).toHaveClass('aspect-hero');
    expect(root).not.toHaveClass('aspect-thumbnail');
  });

  it('기본은 지연 로딩이다', () => {
    render(
      <Media
        src='/images/logo.png'
        alt='썸네일'
        ratio='thumbnail'
      />
    );

    expect(screen.getByRole('img', { name: '썸네일' })).toHaveAttribute(
      'loading',
      'lazy'
    );
  });

  it('priority 를 주면 지연 로딩을 끈다', () => {
    // Hero 는 LCP 요소다 — lazy 로 두면 가장 큰 요소가 가장 늦게 온다
    render(
      <Media
        src='/images/logo.png'
        alt='히어로'
        ratio='hero'
        priority
      />
    );

    // Next 는 우선순위를 img 속성이 아니라 head 의 preload 로 전달한다 —
    // DOM 에서 관찰할 수 있는 건 loading 속성이 사라졌다는 것뿐이고, 없는 상태가 곧 기본값 eager 다
    expect(screen.getByRole('img', { name: '히어로' })).not.toHaveAttribute(
      'loading'
    );
  });
});
