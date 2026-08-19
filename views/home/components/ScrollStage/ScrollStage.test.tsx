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
    const { container } = render(
      <ScrollStage>
        <main>본문</main>
      </ScrollStage>
    );

    expect(container.querySelectorAll('main')).toHaveLength(1);
    expect(screen.getByRole('main')).toHaveTextContent('본문');
  });
});
