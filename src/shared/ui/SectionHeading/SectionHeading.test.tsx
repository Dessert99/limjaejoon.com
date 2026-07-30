/** SectionHeading 테스트 — heading 계층과 선택 요소의 조건부 렌더를 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionHeading } from './SectionHeading';

describe('SectionHeading', () => {
  it('기본 heading 레벨은 2 다', () => {
    render(<SectionHeading title='선택한 작업' />);

    expect(
      screen.getByRole('heading', { level: 2, name: '선택한 작업' })
    ).toBeInTheDocument();
  });

  it('level 로 heading 계층을 낮출 수 있다', () => {
    render(
      <SectionHeading
        level={3}
        title='선택한 작업'
      />
    );

    expect(
      screen.getByRole('heading', { level: 3, name: '선택한 작업' })
    ).toBeInTheDocument();
  });

  it('label 과 description 을 함께 렌더한다', () => {
    render(
      <SectionHeading
        label='Work'
        title='선택한 작업'
        description='최근에 만든 것들.'
      />
    );

    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('최근에 만든 것들.')).toBeInTheDocument();
  });

  it('label 과 description 이 없으면 빈 엘리먼트를 남기지 않는다', () => {
    const { container } = render(<SectionHeading title='선택한 작업' />);

    expect(container.querySelectorAll('p')).toHaveLength(0);
  });
});
