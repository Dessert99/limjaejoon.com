import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TransitionReference } from './TransitionReference';

describe('TransitionReference', () => {
  it('단축 속성 4요소를 표로 정리한다', () => {
    render(<TransitionReference />);

    const table = screen.getByRole('table', { name: '세부 속성 정리' });
    expect(table).toHaveTextContent('transition-property');
    expect(table).toHaveTextContent('transition-duration');
    expect(table).toHaveTextContent('transition-timing-function');
    expect(table).toHaveTextContent('transition-delay');
  });

  it('시간 값 순서 함정을 설명한다', () => {
    render(<TransitionReference />);

    expect(
      screen.getByText(/앞의 것이 duration, 뒤의 것이 delay/)
    ).toBeInTheDocument();
  });

  it('타이밍 프리셋 키워드 5종의 의미를 설명한다', () => {
    render(<TransitionReference />);

    const presets = screen.getByRole('table', { name: '타이밍 프리셋' });
    for (const name of [
      'linear',
      'ease',
      'ease-in',
      'ease-out',
      'ease-in-out',
    ]) {
      expect(presets).toHaveTextContent(name);
    }
    expect(presets).toHaveTextContent(/진입/);
    expect(presets).toHaveTextContent(/퇴장/);
  });
});
