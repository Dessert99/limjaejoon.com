/** 목차 추출 — 슬러그는 rehype-slug 와 같은 구현을 써야 본문 앵커와 맞는다 */
import GithubSlugger from 'github-slugger';

/** 목차 항목 하나 */
export type PostHeading = {
  depth: 2 | 3;
  text: string;
  id: string;
};

const FENCE = /^\s*(?:```|~~~)/;
const HEADING = /^(#{2,3})\s+(.+?)\s*#*\s*$/;

/** 본문에서 h2·h3 를 문서 순서대로 뽑는다 */
export const extractHeadings = (markdown: string): PostHeading[] => {
  // slugger 는 중복 제목에 -1 을 붙이며 상태를 쌓는다 — 글마다 새로 만들어야 번호가 이어지지 않는다
  const slugger = new GithubSlugger();
  const headings: PostHeading[] = [];
  let insideFence = false;

  for (const line of markdown.split('\n')) {
    if (FENCE.test(line)) {
      insideFence = !insideFence;
      continue;
    }

    // 코드 블록 안의 주석(#)이 목차로 올라오는 것을 막는다
    if (insideFence) {
      continue;
    }

    const match = HEADING.exec(line);

    if (!match) {
      continue;
    }

    headings.push({
      depth: match[1].length as 2 | 3,
      text: match[2],
      id: slugger.slug(match[2]),
    });
  }

  return headings;
};
