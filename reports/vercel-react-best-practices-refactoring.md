# Vercel React Best Practices 리팩토링 리포트

- **날짜**: 2026-04-03
- **대상**: limjaejoon.com (Next.js App Router + MDX 블로그)

---

## 1. 중복 디렉토리 읽기 제거

**룰**: `server-parallel-fetching` — 서버 컴포넌트에서 동일한 데이터를 중복 fetch하지 말 것

**문제**: `getPostList()` + `getTagList()` 호출 시 같은 MDX 디렉토리를 2번 읽음. `getTagListFrom`이 내부적으로 `getPostListFrom`을 다시 호출하기 때문.

### Before

```ts
// features/blog/lib/posts.ts
function getTagListFrom(dir: string): string[] {
  const posts = getPostListFrom(dir); // 디렉토리를 또 읽음
  const tagSet = new Set(posts.flatMap((p) => p.tags));
  return Array.from(tagSet).sort();
}

export function getTagList(): string[] {
  return getTagListFrom(BLOG_DIR);
}

export function getStoryTagList(): string[] {
  return getTagListFrom(STORIES_DIR);
}
```

```tsx
// app/blog/page.tsx
const posts = getPostList();   // 1번째 디렉토리 읽기
const tags = getTagList();     // 2번째 디렉토리 읽기 (내부에서 getPostListFrom 재호출)
```

### After

```ts
// features/blog/lib/posts.ts
// getTagListFrom, getTagList, getStoryTagList 함수 제거
```

```tsx
// app/blog/page.tsx
const posts = getPostList();
const tags = [...new Set(posts.flatMap((p) => p.tags))].sort(); // 이미 로드한 posts에서 추출
```

```tsx
// app/page.tsx
const stories = getStoryList();
const storyTags = [...new Set(stories.flatMap((s) => s.tags))].sort();
```

### 효용

디렉토리 읽기가 페이지당 2회 → 1회로 감소한다. `getTagListFrom`이 `getPostListFrom`을 다시 호출하는 숨겨진 중복이 제거되어, 빌드 타임에 불필요한 파일 I/O를 절반으로 줄인다. 또한 사용되지 않는 함수 3개(`getTagListFrom`, `getTagList`, `getStoryTagList`)를 제거하여 API 표면이 단순해진다.

---

## 2. React.cache()로 slug 조회 중복 제거

**룰**: `server-cache-react` — 같은 요청 내에서 동일한 데이터를 여러 번 fetch할 때 `React.cache()`로 중복 제거

**문제**: `generateMetadata()`와 페이지 컴포넌트가 각각 `getPostBySlug(slug)`를 호출하여 같은 MDX 파일을 2번 읽음.

### Before

```ts
// features/blog/lib/posts.ts
export function getPostBySlug(slug: string): Post | null {
  return getPostBySlugFrom(BLOG_DIR, slug);
}

export function getStoryBySlug(slug: string): Post | null {
  return getPostBySlugFrom(STORIES_DIR, slug);
}
```

### After

```ts
// features/blog/lib/posts.ts
import { cache } from 'react';

const getCachedPostBySlug = cache((dir: string, slug: string) =>
  getPostBySlugFrom(dir, slug)
);

export function getPostBySlug(slug: string): Post | null {
  return getCachedPostBySlug(BLOG_DIR, slug);
}

export function getStoryBySlug(slug: string): Post | null {
  return getCachedPostBySlug(STORIES_DIR, slug);
}
```

### 효용

`React.cache()`는 같은 렌더링 요청 내에서 동일 인자로 호출된 함수의 결과를 메모이제이션한다. `generateMetadata()`와 페이지 컴포넌트가 같은 slug으로 호출하면, 두 번째 호출은 캐시된 결과를 반환한다. 현재 SSG이므로 빌드 타임에만 영향이 있지만, 향후 ISR이나 동적 렌더링으로 전환할 때 실질적인 성능 이점이 된다.

---

## 3. mdxComponents 모듈 레벨 호이스트

**룰**: `rendering-hoist-jsx` — 렌더링마다 새로 생성되는 JSX 객체/배열을 컴포넌트 바깥으로 호이스트

**문제**: `stories/[slug]/page.tsx`에서 `components={{ Tooltip, Mention }}`을 인라인으로 생성. 렌더링마다 새 객체가 만들어져 불필요한 참조 변경이 발생.

### Before

```tsx
// app/stories/[slug]/page.tsx
<MDXRemote
  source={story.content}
  options={mdxOptions}
  components={{ Tooltip, Mention }}  // 렌더링마다 새 객체
/>
```

### After

```tsx
// app/stories/[slug]/page.tsx
const mdxComponents = { Tooltip, Mention };  // 모듈 레벨 — 한 번만 생성

// ...
<MDXRemote
  source={story.content}
  options={mdxOptions}
  components={mdxComponents}
/>
```

### 효용

모듈 레벨 상수는 앱 전체에서 한 번만 생성되므로, 렌더링마다 새 객체를 만들지 않는다. React가 props 비교 시 참조가 동일하므로 불필요한 리렌더링을 방지한다. `blog/[slug]/page.tsx`와 패턴이 통일되어 코드 일관성도 향상된다.

---

## 4. 배열 순회 통합 + 불변 정렬

**룰**: `js-combine-iterations` — 연속된 `.map().filter()`를 `.flatMap()`으로 통합하여 순회 횟수 감소
**룰**: `js-tosorted-immutable` — `.sort()` 대신 `.toSorted()`로 원본 배열 불변성 유지

**문제**: `filterAndSort()`가 `.map().filter().sort().map()` = 4회 순회하며, `.sort()`는 배열을 직접 변경(mutate).

### Before

```ts
const scored = posts
  .map((post) => {
    // ... 점수 계산
    if (!titleMatch && !descMatch && !tagMatch) {
      return null;
    }
    const priority = titleMatch ? 1 : descMatch ? 2 : 3;
    return { post, priority };
  })
  .filter((item): item is NonNullable<typeof item> => item !== null);

scored.sort((a, b) => a.priority - b.priority);  // 뮤테이션

return scored.map((item) => item.post);
```

### After

```ts
return posts
  .flatMap((post) => {
    const titleMatch = post.title.toLowerCase().includes(q);
    const descMatch = post.description.toLowerCase().includes(q);
    const tagMatch = post.tags.some((tag) => tag.toLowerCase().includes(q));

    if (!titleMatch && !descMatch && !tagMatch) return [];

    const priority = titleMatch ? 1 : descMatch ? 2 : 3;
    return [{ post, priority }];
  })
  .toSorted((a, b) => a.priority - b.priority)
  .map((item) => item.post);
```

### 효용

`flatMap`이 `map` + `filter`를 하나의 순회로 합쳐 4회 → 3회로 줄인다. `toSorted`는 ES2023 메서드로, 원본 배열을 변경하지 않고 새 배열을 반환하여 불변성을 보장한다. 타입 가드(`NonNullable`)도 불필요해져 코드가 간결해진다.

---

## 5. 검색 입력 반응성 개선

**룰**: `rerender-use-deferred-value` — 비용이 큰 연산에 `useDeferredValue`를 적용하여 입력 반응성 유지

**문제**: 매 키 입력마다 `filterAndSort`가 동기적으로 실행되어, 포스트가 많아지면 입력이 버벅일 수 있음.

### Before

```tsx
export function SearchContent({ posts }: SearchContentProps) {
  const [query, setQuery] = useState('');

  const trimmed = query.trim();
  const results = trimmed.length > 0 ? filterAndSort(posts, trimmed) : [];
  // ...
}
```

### After

```tsx
export function SearchContent({ posts }: SearchContentProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const deferredTrimmed = deferredQuery.trim();
  const results =
    deferredTrimmed.length > 0 ? filterAndSort(posts, deferredTrimmed) : [];

  // 입력 상태 표시는 즉시 반응하는 query 사용
  {query.trim().length === 0 ? (
    <p>검색어를 입력해 주세요.</p>
  ) : /* ... */}
}
```

### 효용

`useDeferredValue`는 React 18+의 동시성 기능으로, 값 업데이트를 낮은 우선순위로 지연시킨다. 사용자가 빠르게 타이핑할 때 입력(`query`)은 즉시 반영되고, 비용이 큰 필터링은 `deferredQuery`가 업데이트될 때만 실행된다. React Compiler가 자동 메모이제이션을 처리하므로 `useMemo`는 불필요하다.
