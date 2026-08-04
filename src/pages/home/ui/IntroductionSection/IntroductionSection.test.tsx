/** IntroductionSection 테스트 — heading 계층, 앵커 목적지, CTA 배선을 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { INTRODUCTION } from '../../config/introduction';
import { IntroductionSection } from './IntroductionSection';

describe('IntroductionSection', () => {
  it('statement 를 h2 로 렌더한다', () => {
    render(<IntroductionSection />);

    expect(
      screen.getByRole('heading', { level: 2, name: INTRODUCTION.statement })
    ).toBeInTheDocument();
  });

  it('본문을 문단 엘리먼트로 렌더한다', () => {
    // 등장 래퍼는 div 라 그 안에 p 를 두지 않으면 접근성 트리에서 문단 경계가 사라진다
    render(<IntroductionSection />);

    for (const paragraph of INTRODUCTION.body) {
      expect(screen.getByText(paragraph).tagName).toBe('P');
    }
  });

  it('heading 으로 이름 붙은 region 랜드마크다', () => {
    // 이름 없는 section 은 랜드마크로 노출되지 않아 목록 탐색에서 통째로 사라진다
    render(<IntroductionSection />);

    expect(
      screen.getByRole('region', { name: INTRODUCTION.statement })
    ).toBeInTheDocument();
  });

  it('skills 를 목록으로 렌더한다', () => {
    render(<IntroductionSection />);

    expect(screen.getAllByRole('listitem')).toHaveLength(
      INTRODUCTION.skills.length
    );
  });

  it('CTA 는 링크 역할이다', () => {
    // 같은 문서 안 이동이라 button 이 아니라 link 여야 한다
    render(<IntroductionSection />);

    expect(
      screen.getByRole('link', { name: INTRODUCTION.cta.label })
    ).toHaveAttribute('href', INTRODUCTION.cta.href);
  });
});
