import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPostRowFromSource } from './importPosts.mjs';

test('MDX frontmatter 로 category 없이 import row 를 만든다', () => {
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
    source,
  });

  assert.equal(row.slug, '2026-04-06-next-fetch');
  assert.equal('category' in row, false);
  assert.equal(row.series, null);
  assert.deepEqual(row.tags, ['Next.js', '캐싱']);
  assert.equal(row.status, 'published');
  assert.equal(row.published_at, '2026-04-06T00:00:00.000Z');
  assert.equal(row.content_markdown.trim(), '## 본문');
});

test('MDX frontmatter tags 가 비어 있으면 import row 생성을 거부한다', () => {
  const source = `---
title: '태그 없는 글'
date: '2026-04-06'
description: '태그가 비어 있는 글'
tags: []
---

## 본문
`;

  assert.throws(() => {
    buildPostRowFromSource({
      filePath: 'content/blog/no-tags.mdx',
      source,
    });
  }, /Missing tags frontmatter/);
});
