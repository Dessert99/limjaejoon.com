/** SectionHeading 테스트 — 부품별 계약과 heading 계층을 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionHeading } from './SectionHeading';

describe('SectionHeading', () => {
  it('Title 의 기본 heading 레벨은 2 다', () => {
    render(<SectionHeading.Title>선택한 작업</SectionHeading.Title>);

    expect(
      screen.getByRole('heading', { level: 2, name: '선택한 작업' })
    ).toBeInTheDocument();
  });

  it('level 로 heading 계층을 낮출 수 있다', () => {
    render(<SectionHeading.Title level={3}>선택한 작업</SectionHeading.Title>);

    expect(
      screen.getByRole('heading', { level: 3, name: '선택한 작업' })
    ).toBeInTheDocument();
  });

  it('id 는 래퍼가 아니라 heading 에 붙는다', () => {
    // 래퍼에 붙으면 aria-labelledby 가 라벨·부연까지 이름으로 끌어와 랜드마크 이름이 장황해진다
    render(
      <SectionHeading.Root>
        <SectionHeading.Label>Work</SectionHeading.Label>
        <SectionHeading.Title id='work-title'>선택한 작업</SectionHeading.Title>
        <SectionHeading.Description>
          최근에 만든 것들.
        </SectionHeading.Description>
      </SectionHeading.Root>
    );

    expect(
      screen.getByRole('heading', { level: 2, name: '선택한 작업' })
    ).toHaveAttribute('id', 'work-title');
  });

  it('고르지 않은 부품은 엘리먼트를 남기지 않는다', () => {
    const { container } = render(
      <SectionHeading.Root>
        <SectionHeading.Title>선택한 작업</SectionHeading.Title>
      </SectionHeading.Root>
    );

    expect(container.querySelectorAll('p')).toHaveLength(0);
  });

  it('Title 을 다른 엘리먼트로 감싸도 heading 계약이 유지된다', () => {
    // 슬롯 props 로는 불가능했던 조립이다 — Contact 가 SectionHeading 을 우회하던 이유
    render(
      <div data-testid='mask'>
        <SectionHeading.Title id='contact-title'>
          같이 만들 것이 있나요
        </SectionHeading.Title>
      </div>
    );

    expect(
      screen.getByRole('heading', { level: 2, name: '같이 만들 것이 있나요' })
    ).toHaveAttribute('id', 'contact-title');
  });

  it('소비자 className 이 기본 클래스와 병합된다', () => {
    // Introduction 은 라벨을 12칼럼 그리드의 한 칸으로 밀어야 한다
    render(
      <SectionHeading.Label className='md:col-span-4'>
        Work
      </SectionHeading.Label>
    );

    expect(screen.getByText('Work')).toHaveClass(
      'text-label',
      'text-subtle',
      'uppercase',
      'md:col-span-4'
    );
  });
});
