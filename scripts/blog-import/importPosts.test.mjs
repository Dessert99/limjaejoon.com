import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPostRowFromSource } from './importPosts.mjs';

test('MDX frontmatter 와 override 로 import row 를 만든다', () => {
  const source = `---
title: 'Next.js fetch와 캐싱'
date: '2026-04-06'
description: 'Next.js fetch cache 정리'
tags: ['Next.js', '캐싱']
---

## 본문
`;

  const row = buildPostRowFromSource({
    filePath: 'content/blog/2026-04-06-next-fetch.mdx',
    override: {
      category: 'frontend',
      series: 'Next.js App Router',
    },
    source,
  });

  assert.equal(row.slug, '2026-04-06-next-fetch');
  assert.equal(row.category, 'frontend');
  assert.equal(row.series, 'Next.js App Router');
  assert.deepEqual(row.tags, ['Next.js', '캐싱']);
  assert.equal(row.status, 'published');
  assert.equal(row.published_at, '2026-04-06T00:00:00.000Z');
  assert.equal(row.content_markdown.trim(), '## 본문');
});
