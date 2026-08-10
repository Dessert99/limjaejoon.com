/** PostToc 테스트 — 제목을 앵커로 잇고, 교차 판정을 받은 뒤 어느 절을 짚는지가 계약이다 */
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import type { PostHeading } from '../../lib/extractHeadings';
import { PostToc } from './PostToc';

const HEADINGS: PostHeading[] = [
  { depth: 2, text: '스키마 정의', id: 'schema' },
  { depth: 3, text: 'parse 와 safeParse', id: 'parse' },
  { depth: 2, text: '타입 추론', id: 'infer' },
];

/** 관찰 대상이 띠에 들었는지 알리는 콜백 — 브라우저가 부르는 자리를 테스트가 대신 부른다 */
type Notify = (states: Record<string, boolean>) => void;

let notify: Notify;

beforeEach(() => {
  let callback: IntersectionObserverCallback | null = null;
  const targets = new Map<string, Element>();

  globalThis.IntersectionObserver = class {
    constructor(received: IntersectionObserverCallback) {
      callback = received;
    }
    observe(element: Element): void {
      targets.set(element.id, element);
    }
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  } as unknown as typeof IntersectionObserver;

  notify = (states) => {
    const entries = Object.entries(states).map(([id, isIntersecting]) => {
      return { target: targets.get(id), isIntersecting };
    });

    act(() => {
      callback?.(
        entries as unknown as IntersectionObserverEntry[],
        null as unknown as IntersectionObserver
      );
    });
  };
});

/** 본문 제목이 실제로 문서에 있어야 목차가 그 요소를 찾아 관찰한다 */
const renderToc = (headings: PostHeading[] = HEADINGS) => {
  return render(
    <>
      {headings.map((heading) => {
        return (
          <h2
            key={heading.id}
            id={heading.id}>
            {heading.text}
          </h2>
        );
      })}
      <PostToc headings={headings} />
    </>
  );
};

describe('PostToc', () => {
  it('제목마다 본문 앵커로 가는 링크를 그린다', () => {
    renderToc();

    expect(screen.getByRole('link', { name: '스키마 정의' })).toHaveAttribute(
      'href',
      '#schema'
    );
    expect(
      screen.getByRole('link', { name: 'parse 와 safeParse' })
    ).toHaveAttribute('href', '#parse');
  });

  it('제목이 없는 글에는 빈 목차를 남기지 않는다', () => {
    renderToc([]);

    expect(screen.queryByRole('navigation', { name: '목차' })).toBeNull();
  });

  it('띠에 든 절을 지금 읽는 위치로 짚는다', () => {
    renderToc();
    notify({ schema: true });

    expect(screen.getByRole('link', { name: '스키마 정의' })).toHaveAttribute(
      'aria-current',
      'location'
    );
  });

  it('여러 절이 한 번에 들면 문서에서 가장 위인 절을 짚는다', () => {
    renderToc();
    notify({ parse: true, infer: true });

    expect(
      screen.getByRole('link', { name: 'parse 와 safeParse' })
    ).toHaveAttribute('aria-current', 'location');
    expect(screen.getByRole('link', { name: '타입 추론' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('띠가 비어도 직전에 짚던 절을 그대로 둔다', () => {
    renderToc();
    notify({ infer: true });
    // 긴 절 한가운데라 제목이 하나도 띠에 없는 순간 — 여기서 표시가 사라지면 위치를 잃는다
    notify({ infer: false });

    expect(screen.getByRole('link', { name: '타입 추론' })).toHaveAttribute(
      'aria-current',
      'location'
    );
  });

  it('좁은 화면용 여닫기 버튼이 목록을 펼친다', async () => {
    const user = userEvent.setup();

    renderToc();
    const toggle = screen.getByRole('button', { name: '목차' });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });
});
