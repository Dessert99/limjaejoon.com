# SEO 최적화 구현 보고서

> 작성일: 2026-04-03

## 1. 개요

블로그가 구글 검색에 노출되지 않는 문제를 해결하기 위해 SEO 최적화를 구현했다.
Next.js App Router의 Metadata API를 활용하여 메타데이터, Open Graph, sitemap, robots.txt, JSON-LD 구조화 데이터를 추가했다.

## 2. 구현 항목

### 2.1 사이트 URL 상수

**파일:** `features/shared/constants.ts`

```ts
export const SITE_URL = 'https://limjaejoon.com';
```

sitemap, robots, metadata, JSON-LD 등 여러 파일에서 사이트 도메인을 참조하므로 하나의 상수로 관리한다.
도메인이 변경되면 이 파일만 수정하면 된다.

### 2.2 루트 메타데이터

**파일:** `app/layout.tsx`

Next.js에서 `metadata`라는 이름으로 export하면, 프레임워크가 자동으로 `<head>` 태그에 메타 정보를 삽입한다.

| 속성 | 값 | 역할 |
|------|------|------|
| `metadataBase` | `new URL(SITE_URL)` | 상대 경로 OG 이미지를 절대 URL로 변환 |
| `title.default` | `'임재준 \| 프론트엔드 개발자'` | 하위 페이지에서 title을 설정하지 않았을 때 사용 |
| `title.template` | `'%s \| 임재준'` | 하위 페이지에서 title만 설정하면 자동 조합 |
| `description` | `'프론트엔드 개발자 임재준의 기술 블로그입니다.'` | 검색 결과 설명문 |
| `openGraph` | type, locale, siteName, images | SNS 공유 시 미리보기 정보 |
| `twitter` | card: summary | 트위터 카드 형식 |

**동작 원리:**
- 루트 layout의 metadata는 모든 페이지에 기본값으로 적용된다.
- 하위 페이지에서 같은 속성을 export하면 해당 페이지에서만 덮어씌워진다.
- `title.template`에 의해 하위 페이지에서 `title: '지식 모음'`만 설정하면 실제 렌더링은 `'지식 모음 | 임재준'`이 된다.

### 2.3 페이지별 정적 메타데이터

각 페이지에 `export const metadata: Metadata`를 추가했다.

| 페이지 | title | description | 특이사항 |
|--------|-------|-------------|----------|
| `app/page.tsx` | (layout default 상속) | (layout default 상속) | 변경 없음 |
| `app/blog/page.tsx` | 지식 모음 | 개념 정리와 레퍼런스를 모아두는 공간입니다. | |
| `app/portfolio/page.tsx` | 포트폴리오 | 프론트엔드 개발자 임재준의 기술 스택과 활동 이력입니다. | |
| `app/search/page.tsx` | 검색 | — | `robots: { index: false, follow: false }` |

검색 페이지는 `noindex`를 설정하여 구글에 색인되지 않도록 했다. 검색 페이지는 동적 콘텐츠가 없고, 색인될 필요가 없기 때문이다.

### 2.4 동적 메타데이터 (`generateMetadata`)

**파일:** `app/blog/[slug]/page.tsx`, `app/stories/[slug]/page.tsx`

정적 metadata와 달리, 블로그 포스트는 slug에 따라 제목/설명이 달라지므로 `generateMetadata` 함수를 사용한다.

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,           // template에 의해 "제목 | 임재준"으로 렌더링
    description: post.description,
    keywords: post.tags,
    openGraph: {
      type: 'article',           // 일반 웹사이트가 아닌 "기사" 타입
      publishedTime: new Date(post.date).toISOString(),  // ISO 8601 datetime
      tags: post.tags,
    },
    twitter: { card: 'summary' },
  };
}
```

**동작 원리:**
- Next.js가 페이지 렌더링 전에 `generateMetadata`를 먼저 호출한다.
- params에서 slug를 꺼내고, 해당 포스트의 frontmatter 데이터로 메타데이터를 구성한다.
- `generateStaticParams`와 함께 사용되므로, 빌드 시점에 모든 포스트의 메타데이터가 정적으로 생성된다.

**`publishedTime` 포맷:**
- frontmatter의 date는 `"2026-04-02"` 형태이다.
- Open Graph의 `article:published_time`은 ISO 8601 datetime을 기대하므로, `new Date(post.date).toISOString()`으로 변환하여 `"2026-04-02T00:00:00.000Z"` 형태로 만든다.

### 2.5 robots.txt

**파일:** `app/robots.ts`

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/search',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

**동작 원리:**
- Next.js가 `app/robots.ts`를 인식하여 `/robots.txt` 경로로 서빙한다.
- 모든 크롤러(`*`)에게 전체 사이트(`/`) 크롤링을 허용하되, `/search` 경로는 차단한다.
- sitemap 위치를 명시하여 크롤러가 사이트맵을 자동으로 발견할 수 있게 한다.

**생성되는 robots.txt:**
```
User-agent: *
Allow: /
Disallow: /search

Sitemap: https://limjaejoon.com/sitemap.xml
```

### 2.6 sitemap.xml

**파일:** `app/sitemap.ts`

```ts
export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getPostList().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  // ... stories, staticPages
  return [...staticPages, ...blogs, ...stories];
}
```

**동작 원리:**
- Next.js가 `app/sitemap.ts`를 인식하여 `/sitemap.xml` 경로로 서빙한다.
- 빌드 시 `getPostList()`와 `getStoryList()`를 호출하여 모든 포스트를 포함한다.
- 새 포스트를 추가하면 다음 빌드 시 자동으로 sitemap에 반영된다.

**priority 설정 기준:**

| 페이지 | priority | 이유 |
|--------|----------|------|
| 홈 (`/`) | 1.0 | 사이트 진입점 |
| 블로그 목록 (`/blog`) | 0.8 | 주요 콘텐츠 허브 |
| 블로그 포스트 | 0.7 | 개별 콘텐츠 |
| 스토리 포스트 | 0.6 | 개별 콘텐츠 (보조) |
| 포트폴리오 | 0.5 | 정적 페이지 |

검색 페이지(`/search`)는 `robots.ts`에서 차단했으므로 sitemap에서도 제외했다.

### 2.7 JSON-LD 구조화 데이터

**파일:** `app/blog/[slug]/page.tsx`, `app/stories/[slug]/page.tsx`

```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.description,
  datePublished: post.date,
  author: { '@type': 'Person', name: '임재준', url: SITE_URL },
  url: `${SITE_URL}/blog/${slug}`,
  keywords: post.tags.join(', '),
};

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

**동작 원리:**
- JSON-LD는 Next.js Metadata API가 아닌, JSX에 `<script>` 태그로 직접 삽입한다.
- 구글이 이 데이터를 파싱하여 검색 결과에 리치 스니펫(작성일, 저자 등)을 표시할 수 있다.
- `@type: 'Article'`은 블로그 포스트에 적합한 schema.org 타입이다.

**메타데이터 vs JSON-LD 차이:**
- 메타데이터(`generateMetadata`): 브라우저 탭 제목, SNS 공유 미리보기에 사용
- JSON-LD: 구글 검색 결과의 리치 스니펫에 사용
- 둘 다 있어야 검색 최적화가 완전해진다.

## 3. 변경 파일 목록

| 파일 | 작업 | 변경 내용 |
|------|------|-----------|
| `features/shared/constants.ts` | 생성 | SITE_URL 상수 |
| `app/layout.tsx` | 수정 | 루트 metadata export 추가 |
| `app/blog/page.tsx` | 수정 | 정적 metadata export 추가 |
| `app/portfolio/page.tsx` | 수정 | 정적 metadata export 추가 |
| `app/search/page.tsx` | 수정 | 정적 metadata export 추가 (noindex) |
| `app/blog/[slug]/page.tsx` | 수정 | generateMetadata + JSON-LD 추가 |
| `app/stories/[slug]/page.tsx` | 수정 | generateMetadata + JSON-LD 추가 |
| `app/robots.ts` | 생성 | robots.txt 생성 |
| `app/sitemap.ts` | 생성 | sitemap.xml 생성 |

## 4. 코드 리뷰 결과

| 항목 | 결과 |
|------|------|
| CLAUDE.md 규칙 준수 | 위반 없음 |
| 버그 | `publishedTime` ISO 8601 포맷 수정 완료 |
| lint | 에러 없음 |
| build | 성공 (13/13 페이지 정적 생성) |

## 5. 배포 후 필요한 작업

1. **Google Search Console 등록**: https://search.google.com/search-console 에서 사이트를 등록하고 sitemap.xml을 제출
2. **색인 요청**: Search Console에서 주요 페이지의 색인을 수동 요청하면 반영이 빨라짐
3. **OG 이미지 개선 (선택)**: 현재 144x144 로고를 사용 중. SNS 공유 미리보기를 위해 1200x630 크기의 전용 OG 이미지를 추가하면 더 좋음
