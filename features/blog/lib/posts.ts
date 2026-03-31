import type { Post, PostMeta } from '@/features/blog/types';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content/blog'); // MDX 포스트 파일이 위치한 디렉토리 절대경로

// content/blog의 모든 MDX 파일을 읽어 날짜 내림차순으로 정렬된 포스트 목록 반환
export function getPostList(): PostMeta[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx')); // content/blog의 모든 .mdx 파일 스캔

  const posts = files.map((filename) => {
    const filePath = path.join(CONTENT_DIR, filename);
    const { data } = matter(fs.readFileSync(filePath, 'utf-8')); // 파일 읽고 frontmatter(---) 파싱
    const slug = filename.replace(/\.mdx$/, ''); // 파일명에서 확장자 제거 → URL slug

    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      description: data.description as string,
      tags: (data.tags as string[]) ?? [],
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1)); // date 문자열 비교로 내림차순 정렬 (최신순)
}

// 모든 포스트에서 태그를 수집해 중복 제거 후 알파벳순 정렬 반환
export function getTagList(): string[] {
  const posts = getPostList();
  const tagSet = new Set(posts.flatMap((p) => p.tags));
  return Array.from(tagSet).sort();
}

// slug에 해당하는 MDX 파일을 읽어 본문 포함 포스트 반환. 파일 없으면 null
export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const { data, content } = matter(fs.readFileSync(filePath, 'utf-8'));

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    tags: (data.tags as string[]) ?? [],
    content,
  };
}
