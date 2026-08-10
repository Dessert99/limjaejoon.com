/** ScrollStage 테스트 — ScrollSmoother 가 요구하는 두 겹 구조와 children 통과를 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScrollStage } from './ScrollStage';

describe('ScrollStage', () => {
  it('children 을 그대로 통과시킨다', () => {
    render(
      <ScrollStage>
        <p>무대 위 콘텐츠</p>
      </ScrollStage>
    );

    expect(screen.getByText('무대 위 콘텐츠')).toBeInTheDocument();
  });

  it('ScrollSmoother 가 요구하는 두 겹을 그린다', () => {
    // 이 ID 는 GSAP 기본값이라 옵션으로 넘기지 않는다 — 이름이 틀리면 관성이 조용히 안 걸린다
    const { container } = render(
      <ScrollStage>
        <p>콘텐츠</p>
      </ScrollStage>
    );

    const wrapper = container.querySelector('#smooth-wrapper');
    const content = container.querySelector('#smooth-content');

    expect(wrapper).not.toBeNull();
    expect(content).not.toBeNull();
    expect(wrapper).toContainElement(content as HTMLElement);
  });

  it('새 랜드마크를 만들지 않는다', () => {
    // 무대는 div 두 겹이다 — 랜드마크가 생기면 홈의 접근성 트리가 통째로 바뀐다
    const { container } = render(
      <ScrollStage>
        <main>본문</main>
      </ScrollStage>
    );

    expect(container.querySelectorAll('main')).toHaveLength(1);
    expect(screen.getByRole('main')).toHaveTextContent('본문');
  });
});
