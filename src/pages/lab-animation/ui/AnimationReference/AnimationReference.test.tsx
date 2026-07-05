import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnimationReference } from './AnimationReference';

const SUB_PROPERTY_NAMES = [
  'animation-name',
  'animation-duration',
  'animation-timing-function',
  'animation-delay',
  'animation-iteration-count',
  'animation-direction',
  'animation-fill-mode',
  'animation-play-state',
];

describe('AnimationReference', () => {
  it('세부 속성 8종을 모두 정리 표에 보여준다', () => {
    render(<AnimationReference />);

    for (const name of SUB_PROPERTY_NAMES) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it('transition과의 비교 표를 보여준다', () => {
    render(<AnimationReference />);

    expect(
      screen.getByRole('table', { name: 'transition과 비교' })
    ).toBeInTheDocument();
  });
});
