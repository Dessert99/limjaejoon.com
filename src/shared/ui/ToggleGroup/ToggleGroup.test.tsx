import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { indicator } from './ToggleGroup.css';
import { ToggleGroup } from './ToggleGroup';

// 인디케이터는 aria-hidden 장식용 span이라 role 쿼리로 못 잡는다 — 클래스명으로 직접 조회
function getIndicator(container: HTMLElement) {
  return container.querySelector(`.${CSS.escape(indicator)}`);
}

describe('ToggleGroup', () => {
  it('single 모드에서 항목을 클릭하면 선택 인덱스가 그 항목으로 갱신된다', () => {
    const { container } = render(
      <ToggleGroup.Root
        type='single'
        defaultValue='a'>
        <ToggleGroup.Item value='a'>A</ToggleGroup.Item>
        <ToggleGroup.Item value='b'>B</ToggleGroup.Item>
        <ToggleGroup.Item value='c'>C</ToggleGroup.Item>
      </ToggleGroup.Root>
    );

    fireEvent.click(screen.getByRole('radio', { name: 'C' }));

    expect(getIndicator(container)?.getAttribute('style')).toContain(
      '--gt-index: 2'
    );
  });

  it('controlled value로 렌더하면 인덱스가 그 값에 맞게 반영된다', () => {
    const { container } = render(
      <ToggleGroup.Root
        type='single'
        value='b'
        onValueChange={() => {}}>
        <ToggleGroup.Item value='a'>A</ToggleGroup.Item>
        <ToggleGroup.Item value='b'>B</ToggleGroup.Item>
        <ToggleGroup.Item value='c'>C</ToggleGroup.Item>
      </ToggleGroup.Root>
    );

    expect(getIndicator(container)?.getAttribute('style')).toContain(
      '--gt-index: 1'
    );
  });

  it('type이 multiple이면 공유 슬라이드 인디케이터를 렌더하지 않는다', () => {
    const { container } = render(
      <ToggleGroup.Root
        type='multiple'
        defaultValue={['a']}>
        <ToggleGroup.Item value='a'>A</ToggleGroup.Item>
        <ToggleGroup.Item value='b'>B</ToggleGroup.Item>
      </ToggleGroup.Root>
    );

    expect(getIndicator(container)).toBeNull();
  });

  it('onValueChange가 클릭당 정확히 한 번 호출된다', () => {
    const handleChange = vi.fn();
    render(
      <ToggleGroup.Root
        type='single'
        defaultValue='a'
        onValueChange={handleChange}>
        <ToggleGroup.Item value='a'>A</ToggleGroup.Item>
        <ToggleGroup.Item value='b'>B</ToggleGroup.Item>
      </ToggleGroup.Root>
    );

    fireEvent.click(screen.getByRole('radio', { name: 'B' }));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('b');
  });
});
