import type { Post, PostMeta, SearchablePost } from '@/features/blog/types';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { cache } from 'react';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');
const STORIES_DIR = path.join(process.cwd(), 'content/stories');

// 지정 디렉토리의 모든 MDX 파일을 읽어 날짜 내림차순으로 정렬된 목록 반환
function getPostListFrom(dir: string): PostMeta[] {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));

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

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 지정 디렉토리에서 slug에 해당하는 MDX 파일을 읽어 본문 포함 반환. 파일 없으면 null
function getPostBySlugFrom(dir: string, slug: string): Post | null {
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
}

const getCachedPostBySlug = cache((dir: string, slug: string) =>
  getPostBySlugFrom(dir, slug)
);

// 블로그 (지식 모음)
export function getPostList(): PostMeta[] {
  return getPostListFrom(BLOG_DIR);
}

export function getPostBySlug(slug: string): Post | null {
  return getCachedPostBySlug(BLOG_DIR, slug);
}

// 스토리 (나의 개발 이야기)
export function getStoryList(): PostMeta[] {
  return getPostListFrom(STORIES_DIR);
}

export function getStoryBySlug(slug: string): Post | null {
  return getCachedPostBySlug(STORIES_DIR, slug);
}

// 검색용: 블로그 + 스토리 전체 포스트를 href 포함하여 반환
export function getAllPostsForSearch(): SearchablePost[] {
  const blogs = getPostListFrom(BLOG_DIR).map((p) => ({
    ...p,
    href: `/blog/${p.slug}`,
  }));
  const stories = getPostListFrom(STORIES_DIR).map((p) => ({
    ...p,
    href: `/stories/${p.slug}`,
  }));
  return [...blogs, ...stories].sort((a, b) => (a.date < b.date ? 1 : -1));
}
