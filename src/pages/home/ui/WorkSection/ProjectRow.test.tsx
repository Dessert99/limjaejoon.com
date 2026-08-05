/** ProjectRow 테스트 — 행 하나가 지켜야 할 접근성 계약을 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Project } from '@/entities/project';
import { ProjectRow } from './ProjectRow';

const PROJECT: Project = {
  slug: 'dashboard',
  title: '사내 대시보드',
  summary: '흩어진 지표를 한 화면에 모았다.',
  contribution: '프런트엔드 전반을 맡아 화면과 데이터 계층을 세웠다.',
  period: '2025.03 — 2025.08',
  stack: ['Next.js', 'TypeScript'],
  links: [{ label: 'GitHub', href: 'https://example.com' }],
  thumbnail: { src: null, alt: '대시보드 화면', ratio: 'thumbnail' },
};

describe('ProjectRow', () => {
  it('목록 항목으로 렌더한다', () => {
    // 안쪽 링크 목록도 listitem 을 내므로 바깥 항목은 제목을 품은 쪽으로 가린다
    render(
      <ul>
        <ProjectRow
          project={PROJECT}
          staggerIndex={0}
        />
      </ul>
    );

    expect(screen.getAllByRole('listitem')[0]).toContainElement(
      screen.getByRole('heading', { level: 3, name: '사내 대시보드' })
    );
  });

  it('기간과 스택을 정의 목록으로 낸다', () => {
    render(
      <ul>
        <ProjectRow
          project={PROJECT}
          staggerIndex={0}
        />
      </ul>
    );

    expect(screen.getByText('2025.03 — 2025.08')).toBeInTheDocument();
    expect(screen.getByText('Next.js · TypeScript')).toBeInTheDocument();
  });

  it('링크가 없으면 목록 자체를 그리지 않는다', () => {
    render(
      <ul>
        <ProjectRow
          project={{ ...PROJECT, links: [] }}
          staggerIndex={0}
        />
      </ul>
    );

    expect(
      screen.queryByRole('list', { name: '사내 대시보드 링크' })
    ).not.toBeInTheDocument();
  });
});
