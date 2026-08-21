import GithubSlugger from 'github-slugger';

/** 목차 한 줄. id는 본문 제목에 박힌 앵커와 같은 값이다. */
export type PostHeading = {
  depth: 2 | 3;
  text: string;
  id: string;
};

/** 본문 마크다운에서 h2·h3만 뽑아 목차용 heading 목록을 만든다. */
export const extractHeadings = (markdown: string): PostHeading[] => {
  // rehype-slug가 본문에 박는 id와 같은 규칙이어야 목차 앵커가 걸린다
  const slugger = new GithubSlugger();
  const headings: PostHeading[] = [];
  let insideFence = false;

  for (const line of markdown.split('\n')) {
    // 코드 블록 안의 주석(#)을 제목으로 세지 않으려고 펜스를 세어 건너뛴다
    if (/^\s*(?:```|~~~)/.test(line)) {
      insideFence = !insideFence;
      continue;
    }

    if (insideFence) {
      continue;
    }

    // h4 이하는 목차에서 뺀다. {2,3}을 넓히면 목차가 잘게 쪼개진다
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);

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
