import GithubSlugger from 'github-slugger';

export type PostHeading = {
  depth: 2 | 3;
  text: string;
  id: string;
};

const FENCE = /^\s*(?:```|~~~)/;
const HEADING = /^(#{2,3})\s+(.+?)\s*#*\s*$/;

export const extractHeadings = (markdown: string): PostHeading[] => {
  const slugger = new GithubSlugger();
  const headings: PostHeading[] = [];
  let insideFence = false;

  for (const line of markdown.split('\n')) {
    if (FENCE.test(line)) {
      insideFence = !insideFence;
      continue;
    }

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
