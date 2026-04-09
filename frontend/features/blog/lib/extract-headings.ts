import GithubSlugger from 'github-slugger';

export interface TocHeading {
  text: string;
  slug: string;
}

// 인라인 마크다운 문법을 제거하고 순수 텍스트만 추출
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/<Tooltip[^>]*>(.+?)<\/Tooltip>/g, '$1')
    .trim();
}

// 코드 블록을 제거하여 그 안의 #이 헤딩으로 잡히지 않도록 처리
function stripCodeBlocks(content: string): string {
  return content.replace(/```[\s\S]*?```/g, '');
}

// MDX raw content에서 h1~h3 헤딩을 추출, rehype-slug와 동일한 슬러그 생성
export function extractHeadings(content: string): TocHeading[] {
  const cleaned = stripCodeBlocks(content);
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];

  let match;
  while ((match = headingRegex.exec(cleaned)) !== null) {
    const text = stripInlineMarkdown(match[2]);
    headings.push({
      text,
      slug: slugger.slug(text),
    });
  }

  return headings;
}
