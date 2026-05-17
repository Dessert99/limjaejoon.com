---
name: content-frontmatter
description: content/blog 또는 content/stories의 MDX 파일에 frontmatter 메타데이터를 자동 생성한다. 사용자가 본문을 작성한 뒤 호출하면, 파일 내용을 분석하고 기존 태그를 확인하여 title, date, description, tags를 작성하고, 날짜만 있는 파일명에 영문 slug를 보강한다.
---

# Content Frontmatter 생성

MDX 콘텐츠 파일의 frontmatter를 자동 생성하는 스킬.

## 트리거 조건

- 사용자가 content/blog/ 또는 content/stories/에 MDX 파일을 만들고 frontmatter 생성을 요청할 때
- 사용자가 기존 MDX 파일의 frontmatter를 갱신하고 싶을 때

## 절차

### Step 1: 대상 파일 확인

1. 사용자가 지정한 파일 또는 IDE에서 열린 파일을 확인한다.
2. `content/blog/` 또는 `content/stories/` 중 어디에 있는지 판별한다.
3. 파일의 전체 내용을 읽는다.

### Step 2: 기존 태그 확인

`frontend/features/blog/constants/tags.ts` 의 `BLOG_TAGS` 배열에서 기존 태그 목록을 읽는다. content/blog 파일을 직접 스캔하지 않는다.

### Step 3: 각 필드 생성

#### title

- 핵심 개념만 담아 간결하게 작성한다.
- 예시: `'NAS (Network Attached Storage)'`, `'Route Handler'`

#### date

- 파일명에 날짜가 있는 경우 (예: `2026-04-02-NAS.mdx`): `YYYY-MM-DD` 부분을 추출한다.
- 파일명에 날짜가 없는 경우: 오늘 날짜를 사용하고, 사용자에게 "파일명에 날짜가 없어 오늘 날짜를 사용합니다"라고 안내한다.

#### description

- 본문 전체를 읽고 1~2문장으로 핵심 내용을 요약한다.
- 검색 기능에 사용되므로 본문의 중요 키워드가 자연스럽게 포함되도록 작성한다.
- "~에 대해서 알아보자" 같은 단순 소개 문구는 지양한다.

#### tags

1. Step 2에서 수집한 기존 태그 목록과 대조한다.
2. 본문에서 관련 키워드를 식별한다.
3. 기존 태그 중 일치하는 것이 있으면 **정확히 그 문자열**을 사용한다 (대소문자 포함).
   - 예: 기존에 `Next.js`가 있으면 `next.js`나 `NextJS`가 아닌 `Next.js`를 사용
4. 기존 태그에 없는 개념이 필요하면 새 태그를 생성한다.
5. 3~6개 정도가 적당하다.

### Step 4: frontmatter 작성

파일 최상단에 아래 형식으로 작성한다:

---

title: '제목' date: 'YYYY-MM-DD' description: '설명' tags: ['태그1', '태그2', '태그3']

---

- 값은 모두 '로 감싼다.
- 필드 순서: title → date → description → tags
- 기존 frontmatter가 있으면 덮어쓴다.

### Step 4.5: 번호 목록 줄바꿈 정규화

MDX 본문을 아래 규칙에 따라 수정한다.

1. frontmatter(`---` ~ `---`) 이후의 본문을 **소제목 단위 섹션**으로 분리한다.
   - 소제목은 `##`, `###` 등 `#`으로 시작하는 줄이다.
   - 첫 번째 소제목 이전 내용도 하나의 섹션으로 처리한다.

2. 각 섹션에 코드 블록(` ``` `)이 존재하는지 확인한다.

3. **코드 블록이 없는 섹션**만 아래 정규화를 적용한다:
   - 번호 항목 줄(`1.`, `2.`, `3.` 등 `\d+\.`으로 시작하는 줄) 뒤에 빈 줄이 없으면 빈 줄을 추가한다.
   - 이미 빈 줄이 있는 경우 그대로 둔다 (중복 방지).
   - 마지막 번호 항목 뒤에는 빈 줄을 추가하지 않는다 (섹션 끝 공백 중복 방지).

4. **코드 블록이 있는 섹션**은 수정하지 않는다.

**변환 예시:**

코드 블록이 없는 섹션 (Before):

```
## 배경

1. 항목 일
2. 항목 이
3. 항목 삼
```

After:

```
## 배경

1. 항목 일

2. 항목 이

3. 항목 삼
```

코드 블록이 있는 섹션은 그대로 유지한다.

### Step 4.6: 파일명 slug 보강

블로그/스토리 파일명 규칙은 `YYYY-MM-DD-<slug>.mdx` 이다. 본문 편집(Step 4·4.5)을 모두 마친 **뒤 마지막에** 적용한다 (편집은 기존 경로 기준이므로 rename 을 먼저 하면 안 된다).

1. 현재 파일명을 판별한다.
   - `YYYY-MM-DD-<slug>.mdx` 처럼 날짜와 slug 가 모두 있으면 **변경하지 않는다**.
   - `YYYY-MM-DD.mdx` 처럼 날짜만 있고 slug 가 없으면 slug 를 추가한다.
   - 날짜가 없으면 Step 3 의 date 에서 정한 날짜를 붙여 `YYYY-MM-DD-<slug>.mdx` 형태로 만든다.

2. slug 는 글의 핵심 주제를 영문 kebab-case 로 만든다.
   - 소문자만, 단어 구분은 `-`. 한글·공백·대문자·특수문자 금지.
   - title 을 음차하지 말고 주제어로 변환한다. 예: title `'React Hook Form: register vs Controller'` → `rhf-register-vs-controller`, `'TypeScript 제네릭'` → `typescript-generic`.

3. rename 전에 `git status --porcelain <파일>` 로 추적 여부를 확인한다.
   - untracked(`??`) 면 일반 `mv`, tracked 면 `git mv` 로 변경한다.
   - 커밋·push 는 하지 않는다 (사용자 몫).

### Step 5: 결과 보고

생성한 frontmatter를 보여주고 간단히 설명한다:

- title: 왜 이 제목을 선택했는지
- date: 어디서 추출했는지
- description: 어떤 키워드를 포함했는지
- tags: 기존 태그에서 가져온 것과 새로 만든 것을 구분 표시
- 태그 목록 갱신: 새로 추가된 태그가 있으면 어떤 태그가 목록에 추가됐는지 안내
- 파일명: slug 를 보강했으면 어떤 이름으로 바꿨는지, 변경이 불필요했으면 그 사유

### Step 6: 태그 목록 갱신

이번에 새로 추가한 태그가 있으면 `frontend/features/blog/constants/tags.ts` 의 `BLOG_TAGS` 배열에 추가한다. 기존에 없는 태그만 추가하고 중복을 방지하며, 추가 후 배열을 정렬 상태로 유지한다.

## stories 파일

stories도 동일한 frontmatter 형식을 사용한다. 다만 구현 내용 중심으로 description을 작성한다.

## 주의사항

- 태그 비교는 case-sensitive로 수행한다.
- 태그는 ' 로 감싼다. 다른 문자는 사용하지 않는다.
