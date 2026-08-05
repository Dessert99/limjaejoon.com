/** WorkSection 테스트 — 목록 구조와 "hover 없이도 정보가 다 닿는다" 는 계약을 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { projects } from '@/entities/project';
import { WorkSection } from './WorkSection';

describe('WorkSection', () => {
  it('프로젝트를 목록으로 렌더한다', () => {
    render(<WorkSection />);

    const list = screen.getByRole('list', { name: '프로젝트' });

    // 항목 안에 링크 목록이 또 있으므로 직계 자식으로 센다
    expect(list.children).toHaveLength(projects.length);
  });

  it('각 항목의 제목이 h3 다', () => {
    // 섹션 제목이 h2 이므로 항목은 h3 여야 계층이 건너뛰지 않는다
    render(<WorkSection />);

    for (const project of projects) {
      expect(
        screen.getByRole('heading', { level: 3, name: project.title })
      ).toBeInTheDocument();
    }
  });

  it('설명과 기여를 hover 없이 항상 보여준다', () => {
    // 커서 추적 preview 를 쓰지 않는 이유 — 모바일과 키보드에서 정보가 통째로 빠진다
    render(<WorkSection />);

    for (const project of projects) {
      expect(screen.getByText(project.summary)).toBeInTheDocument();
      expect(screen.getByText(project.contribution)).toBeInTheDocument();
    }
  });

  it('프로젝트 링크에 어느 프로젝트인지가 이름에 남는다', () => {
    // "GitHub" 만 여럿이면 링크 목록에서 서로 구별되지 않는다
    render(<WorkSection />);

    const [first] = projects;

    for (const link of first.links) {
      expect(
        screen.getByRole('link', { name: `${first.title} ${link.label}` })
      ).toHaveAttribute('href', link.href);
    }
  });

  it('앵커 목적지로 초점을 받을 수 있다', () => {
    // id 만 있으면 스크롤만 되고 초점은 안 옮겨간다 — 키보드 사용자는 이동 후 문서 맨 위에 남는다
    const { container } = render(<WorkSection />);

    const section = container.querySelector('section');

    expect(section).toHaveAttribute('id', 'work');
    expect(section).toHaveAttribute('tabindex', '-1');
  });
});
