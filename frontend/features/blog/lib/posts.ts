import type { Post, PostMeta } from '@/features/blog/types';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { cache } from 'react';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

// 지정 디렉토리의 모든 MDX 파일을 읽어 날짜 내림차순으로 정렬된 목록 반환
const getPostListFrom = (dir: string): PostMeta[] => {
  const files = fs.readdirSync(dir).filter((f) => {
    return f.endsWith('.mdx');
  });

  const posts = files.map((filename) => {
    const filePath = path.join(dir, filename);
    const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
    const slug = filename.replace(/\.mdx$/, '');

    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      description: data.description as string,
      tags: (data.tags as string[]) ?? [],
    };
  });

  return posts.sort((a, b) => {
    return a.date < b.date ? 1 : -1;
  });
};

// 지정 디렉토리에서 slug에 해당하는 MDX 파일을 읽어 본문 포함 반환. 파일 없으면 null
const getPostBySlugFrom = (dir: string, slug: string): Post | null => {
  const filePath = path.join(dir, `${slug}.mdx`);

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
};

const getCachedPostBySlug = cache((dir: string, slug: string) => {
  return getPostBySlugFrom(dir, slug);
});

// 블로그 (지식 모음)
export const getPostList = (): PostMeta[] => {
  return getPostListFrom(BLOG_DIR);
};

export const getPostBySlug = (slug: string): Post | null => {
  return getCachedPostBySlug(BLOG_DIR, slug);
};
