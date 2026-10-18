---
name: upload-post
description: 노션 페이지 링크를 받아 limjaejoon.com 원격 블로그에 새 글로 올린다. 웹 관리자 에디터가 하던 일(필드 채우기, 이미지를 줄여 버킷에 올리고 본문 링크 바꾸기, 저장, 캐시 갱신)을 브라우저 없이 같은 사이트 API로 대신한다. 사용자가 노션 링크를 주며 "블로그에 올려줘", "업로드해줘", "발행해줘", "upload-post" 라고 하거나, 노션 글을 블로그로 옮겨 달라고 할 때 쓴다. 이미 올라간 글을 고치거나 지우는 일에는 쓰지 않는다.
---

# 노션 글을 블로그에 올리기

브라우저를 열지 않는다. 관리자 계정으로 로그인해 웹 에디터와 같은 `/api/admin/images`, `/api/admin/posts`를 부른다. 이 API를 거쳐야 서버 검사와 `revalidatePublicPosts()`가 돈다. service role 키로 DB에 직접 쓰지 않는다.

스크립트는 이 스킬 폴더의 `scripts/`에 있다. 아래에서 `$SKILL`은 `.claude/skills/upload-post`, `$W`는 작업 폴더다.

## 준비

- `.env.local`에 `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_REMOTE_SUPABASE_URL`, `NEXT_PUBLIC_REMOTE_SUPABASE_ANON_KEY`가 있어야 한다. 비밀번호가 비었으면 사용자에게 `.env.local`에 직접 넣어 달라고 한다. 채팅으로 받지 않는다.
- 작업 폴더는 세션 scratchpad 아래에 새로 만든다(`$W=<scratchpad>/upload-post-<slug>`).

## 순서

### 1. 노션 페이지 읽기

`notion-fetch`로 페이지를 읽는다. 속성에서 필드를 정한다.

| 노션 속성 | API 필드 | 규칙 |
|---|---|---|
| 이름 | `title` | 그대로 |
| 설명 | `description` | 그대로 |
| 갈래 | `kind` | `개념 정리` → `concept`, `이야기` → `story` |
| 책 종류 | `book_id` | 원격 `books`에서 `title`이 같은 행의 id. `story`면 `null` |
| 날짜 | `published_at` | 날짜만 있으면 `YYYY-MM-DDT00:00:00+09:00`, 시각이 있으면 그 값 |
| (없음) | `slug` | `YYYY-MM-DD-<주제 영문 kebab>`. 기존 글이 이 모양이다(예: `2026-10-15-pnpm-vs-npm`) |

책 id 조회와 slug 중복 확인은 anon 키로 읽는다.

```sh
set -a; . ./.env.local; set +a
curl -s "$NEXT_PUBLIC_REMOTE_SUPABASE_URL/rest/v1/books?select=id,title&title=eq.<책 이름>" -H "apikey: $NEXT_PUBLIC_REMOTE_SUPABASE_ANON_KEY"
curl -s "$NEXT_PUBLIC_REMOTE_SUPABASE_URL/rest/v1/posts?select=slug&slug=eq.<slug>" -H "apikey: $NEXT_PUBLIC_REMOTE_SUPABASE_ANON_KEY"
```

다음 경우는 올리지 말고 멈춰서 사용자에게 묻는다.
- 책 이름이 `books`에 없다(노션 선택지에는 있어도 DB에 없는 책이 있다).
- 같은 slug가 이미 있다.
- 필수 속성이 비었다.

`$W/meta.json`에 쓴다.

```json
{ "title": "", "slug": "", "description": "", "kind": "concept", "book_id": "", "published_at": "" }
```

### 2. 본문 변환

fetch 결과의 `<content>` 안쪽을 **한 글자도 바꾸지 않고** `$W/raw.md`에 옮긴다. 문장을 다듬거나 오타를 고치지 않는다. 탭 들여쓰기는 탭 그대로 두거나 탭 하나를 공백 4칸으로 바꿔 적는다(스크립트가 둘 다 받는다).

```sh
python3 -I $SKILL/scripts/convert.py $W
```

스크립트가 맞추는 블로그 형식은 아래와 같다. 기존 글이 모두 이 모양이다.
- 목록 항목 아래 이미지는 항목 깊이만큼 들여쓴 `<img src="..." alt="" />`로 넣고, 앞뒤에 빈 줄을 둔다. 들여쓰기가 빠지면 이미지가 목록 밖으로 떨어져 번호가 끊긴다.
- 목록 안 코드 블록은 펜스뿐 아니라 안쪽 줄까지 같은 깊이로 민다. 노션은 안쪽 줄을 0열로 준다.
- 제목 앞뒤에 빈 줄을 두고, 제목 바로 아래 출처 링크는 한 줄씩 문단으로 나눈다.
- `<empty-block/>`은 지운다.

종료 코드가 2이면 `WARN`이 나온 줄(콜아웃, 토글, 표, 외부 이미지 등 규칙이 없는 블록)이 있다는 뜻이다. 그 줄을 어떻게 옮길지 사용자에게 묻고, 답에 따라 `body.md`를 손본다.

### 3. 이미지 원본 받기

노션 서명 주소는 **5분 뒤 만료된다**. 주소를 받는 즉시 같은 응답 안에서 내려받는다.

1. `$W/refs.json`의 참조를 `notion-get-file-download-urls`에 넣는다(한 번에 25개까지).
2. 바로 `$W/urls.txt`를 쓰고 `download.py`를 돌린다. 줄 번호 `n`은 `refs.json` 순서(1부터)다.

한 번에 받은 주소들은 보통 `X-Amz-Signature`만 다르고 나머지 파라미터가 같다. 그러면 공통 부분을 한 번만 적는다. 같은지 눈으로 확인하고, 다르면 그 줄만 전체 주소로 적는다.

```
base https://prod-files-secure.s3.us-west-2.amazonaws.com/<space_id>
query <X-Amz-Signature를 뺀 나머지 쿼리 전부, & 로 이은 그대로>
1 <파일id>/<파일명>.png <서명>
2 https://...전체 주소...
```

```sh
python3 -I $SKILL/scripts/download.py $W
```

`FAIL`이 나오면 주소가 만료된 것이다. 1번부터 다시 한다.

### 4. 올리기

```sh
node --env-file=.env.local $SKILL/scripts/publish.mjs $W
```

프로젝트 루트에서 실행한다. 스크립트가 하는 일:
- 관리자로 로그인해 세션 쿠키를 만든다. `Origin`은 `https://www.limjaejoon.com`이다(`limjaejoon.com`은 www로 308).
- 이미지를 웹 에디터 `shrinkImage`와 같은 규칙(폭 1600 이하, webp 품질 85, 커지면 원본)으로 줄여 `<slug>-<n>` 이름으로 올리고 `{{IMG:n}}`을 공개 주소로 바꾼다.
- 글을 저장하고, 공개 페이지가 200이며 이미지 주소가 모두 들어 있는지 확인한다.
- 확인까지 끝나면 `$W`를 지운다.

실패하면 `$W`가 남는다. `$W/uploaded.json`에 이미 버킷에 올라간 이미지가 적혀 있으니 사용자에게 알린다. 다시 돌리면 이미지가 한 벌 더 올라가므로, 실패 원인을 고친 뒤에 다시 돌린다.

## 끝나고 보고

- 글 주소
- 이미지 장수와 페이지 확인 결과
- 원문에서 그대로 둔 것(띄어쓰기 오류 등 눈에 띈 점)
- HTML로만 확인했으니 화면은 사용자가 한 번 봐 달라고 말한다.
