# Admin Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 어드민 화면·쓰기 경로를 공유 토큰에서 Supabase Auth 로그인 + RLS 기반 인가로 전환한다.

**Architecture:** 사용자 요청은 anon 키 + 세션(JWT) 클라이언트로 처리하고, 권한은 `app_metadata.role='admin'` 클레임을 근거로 Postgres RLS가 DB단에서 최종 집행한다. service role 키는 사용자 요청 경로에서 제거하고 import 스크립트에만 남긴다. 방어는 proxy(세션 갱신·optimistic redirect) → 보호 레이아웃(보조 가드) → Route Handler(재검증) → RLS(최종) 4겹으로 나눈다.

**Tech Stack:** Next.js 16 App Router, `@supabase/ssr`, `@supabase/supabase-js`, Postgres RLS, vitest, vanilla-extract.

## Global Constraints

- FSD 레이어 의존은 위→아래만: `app → pages → widgets → features → entities → shared`. `shared`는 도메인 비의존.
- 모든 파일 헤더·export는 단일 라인 JSDoc(`/** ... */`). 본문 비자명 로직은 한 줄 `//` WHY 주석. 멀티라인 블록·`@param` 금지.
- 테스트 describe/it 설명문은 한국어. 고유 식별자만 영문.
- shared/ui는 per-component index.ts 금지. 슬라이스 공개 API가 파일을 직접 re-export.
- RHF 미설치 — 폼은 기존 `PostEditorForm`처럼 plain `useState`.
- claim 표현 통일: `((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'`.
- Supabase 버킷명은 로컬·원격 모두 `post-images`로 통일(마이그레이션이 공유되므로).
- 커밋은 각 task 끝에서. push·브랜치는 사용자 몫.

---

## File Structure

**신규 생성**

- `src/entities/session/api/getSessionClaims.ts` — 세션 클라이언트에서 검증된 claim 조회.
- `src/entities/session/model/isAdmin.ts` — claim → admin 여부 판정.
- `src/entities/session/index.ts` — 공개 API.
- `src/shared/api/supabase/proxy.ts` — request/response 쿠키 바인딩 세션 클라이언트.
- `src/features/auth/api/signIn.ts`, `api/signOut.ts` — browser client 인증 액션.
- `src/features/auth/model/useSignIn.ts` — 로그인 폼 상태 훅.
- `src/features/auth/ui/LoginForm/LoginForm.tsx` + `.css.ts` — 로그인 폼.
- `src/features/auth/ui/SignOutButton/SignOutButton.tsx` — 로그아웃 버튼.
- `src/features/auth/index.ts` — 공개 API.
- `src/pages/admin-login/ui/AdminLoginPage/AdminLoginPage.tsx` + `.css.ts`, `src/pages/admin-login/index.ts`.
- `app/admin/(public)/login/page.tsx` — 로그인 라우트.
- `app/admin/(protected)/layout.tsx` — 서버 보조 가드.
- `proxy.ts` (루트) — 세션 갱신 + optimistic redirect.
- `scripts/set-admin-role.mjs` — app_metadata role 부여.
- `supabase/migrations/<ts>_posts_admin_write_policies.sql`.
- `supabase/migrations/<ts>_storage_post_images_policies.sql`.
- `tests/integration/rls-posts.integration.test.ts`, `tests/integration/storage-images.integration.test.ts`, `tests/integration/helpers.ts`.
- `vitest.integration.config.ts`.

**수정**

- `app/api/admin/posts/route.ts`, `app/api/admin/posts/[id]/route.ts`, `app/api/admin/images/route.ts` — 세션 클라이언트 + 인가 재검증 + Origin 검사 + 에러 매핑.
- `src/features/post-editor/ui/PostEditorForm/PostEditorForm.tsx` — 토큰 필드·sessionStorage·헤더 제거.
- `src/features/post-editor/api/uploadPostImage.ts` — `token` 인자 제거.
- `src/shared/config/env.ts` — `adminPostToken` 제거, `adminEmail` 추가.
- `.env.example` — `ADMIN_POST_TOKEN` 제거, `ADMIN_EMAIL` 추가, 버킷명 통일.
- `src/shared/api/index.ts`, `src/shared/api/admin/index.ts` — `verifyAdminPostToken` export 제거.
- `src/shared/api/supabase/index.ts` — proxy 클라이언트 export 추가.
- `supabase/config.toml` — `[storage.buckets.post-images]` 설정.
- `package.json` — `test:integration` 스크립트.

**이동**

- `app/admin/posts/` → `app/admin/(protected)/posts/` (page 3개).

**삭제**

- `src/shared/api/admin/auth.ts`, `src/shared/api/admin/auth.test.ts`.

---

## Task 1: session 엔티티 — 검증된 claim 조회

**Files:**
- Create: `src/entities/session/api/getSessionClaims.ts`
- Create: `src/entities/session/model/isAdmin.ts`
- Create: `src/entities/session/index.ts`
- Test: `src/entities/session/api/getSessionClaims.test.ts`, `src/entities/session/model/isAdmin.test.ts`

**Interfaces:**
- Consumes: `SupabaseClient` (from `@supabase/supabase-js`), `.auth.getClaims()`.
- Produces:
  - `type SessionClaims = { sub: string; email?: string; app_metadata?: { role?: string } }`
  - `getSessionClaims(client: SupabaseClient): Promise<SessionClaims | null>`
  - `isAdmin(claims: SessionClaims | null): boolean`

- [ ] **Step 1: isAdmin 실패 테스트 작성**

`src/entities/session/model/isAdmin.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { isAdmin } from './isAdmin';

describe('isAdmin', () => {
  it('app_metadata.role 가 admin 이면 true 를 반환한다', () => {
    expect(isAdmin({ sub: '1', app_metadata: { role: 'admin' } })).toBe(true);
  });

  it('role 이 admin 이 아니면 false 를 반환한다', () => {
    expect(isAdmin({ sub: '1', app_metadata: { role: 'user' } })).toBe(false);
  });

  it('claims 가 null 이면 false 를 반환한다', () => {
    expect(isAdmin(null)).toBe(false);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/entities/session/model/isAdmin.test.ts`
Expected: FAIL — `isAdmin` 모듈 없음.

- [ ] **Step 3: isAdmin 구현**

`src/entities/session/model/isAdmin.ts`:

```ts
/** 세션 claim 에서 운영자 여부를 판정한다 — RLS 정책과 같은 기준(app_metadata.role) */
import type { SessionClaims } from '../api/getSessionClaims';

/** app_metadata.role 이 admin 인 검증된 claim 만 운영자로 인정한다 */
export const isAdmin = (claims: SessionClaims | null): boolean => {
  return claims?.app_metadata?.role === 'admin';
};
```

- [ ] **Step 4: getSessionClaims 실패 테스트 작성**

`src/entities/session/api/getSessionClaims.test.ts`:

```ts
import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';
import { getSessionClaims } from './getSessionClaims';

// auth.getClaims() 만 흉내내 네트워크 없이 매핑을 검증한다
const makeClient = (result: unknown) => {
  const getClaims = vi.fn().mockResolvedValue(result);
  return { auth: { getClaims } } as unknown as SupabaseClient;
};

describe('getSessionClaims', () => {
  it('claims 를 SessionClaims 로 반환한다', async () => {
    const client = makeClient({
      data: { claims: { sub: '1', email: 'a@x.com', app_metadata: { role: 'admin' } } },
      error: null,
    });

    await expect(getSessionClaims(client)).resolves.toEqual({
      sub: '1',
      email: 'a@x.com',
      app_metadata: { role: 'admin' },
    });
  });

  it('claims 가 없으면 null 을 반환한다', async () => {
    const client = makeClient({ data: { claims: null }, error: null });
    await expect(getSessionClaims(client)).resolves.toBeNull();
  });

  it('error 가 있으면 null 을 반환한다', async () => {
    const client = makeClient({ data: null, error: new Error('boom') });
    await expect(getSessionClaims(client)).resolves.toBeNull();
  });
});
```

- [ ] **Step 5: 테스트 실패 확인**

Run: `npx vitest run src/entities/session/api/getSessionClaims.test.ts`
Expected: FAIL — 모듈 없음.

- [ ] **Step 6: getSessionClaims 구현**

`src/entities/session/api/getSessionClaims.ts`:

```ts
/** 세션 엔티티의 claim 조회 — 서명 검증된 JWT claim 만 인가 판단 근거로 노출한다 */
import type { SupabaseClient } from '@supabase/supabase-js';

/** 인가 판단에 필요한 최소 claim — RLS 가 읽는 app_metadata.role 을 포함한다 */
export type SessionClaims = {
  sub: string;
  email?: string;
  app_metadata?: { role?: string };
};

/** getClaims() 로 서명 검증된 claim 을 읽는다 (getSession() 은 위조 가능해 쓰지 않음) */
export const getSessionClaims = async (
  client: SupabaseClient
): Promise<SessionClaims | null> => {
  const { data, error } = await client.auth.getClaims();

  // 검증 실패·미로그인은 인가 거부와 동일하게 null 로 좁힌다
  if (error || !data?.claims) {
    return null;
  }

  const claims = data.claims;

  return {
    sub: claims.sub,
    email: claims.email,
    app_metadata: claims.app_metadata,
  };
};
```

- [ ] **Step 7: index 공개 API 작성**

`src/entities/session/index.ts`:

```ts
/** session 엔티티 public API */
export { getSessionClaims, type SessionClaims } from './api/getSessionClaims';
export { isAdmin } from './model/isAdmin';
```

- [ ] **Step 8: 테스트·fsd 통과 확인**

Run: `npx vitest run src/entities/session && npm run fsd`
Expected: PASS.

- [ ] **Step 9: 커밋**

```bash
git add src/entities/session
git commit -m "feat(auth): add session entity for verified admin claims"
```

---

## Task 2: proxy용 Supabase 세션 클라이언트

**Files:**
- Create: `src/shared/api/supabase/proxy.ts`
- Modify: `src/shared/api/supabase/index.ts`
- Test: `src/shared/api/supabase/proxy.test.ts`

**Interfaces:**
- Consumes: `createServerClient` (`@supabase/ssr`), `NextRequest`/`NextResponse` (`next/server`), `readPublicEnv`.
- Produces: `createSupabaseProxyClient(request: NextRequest, response: NextResponse): SupabaseClient` — request 에서 쿠키를 읽고, 갱신 쿠키를 request·response 양쪽에 쓴다.

- [ ] **Step 1: 실패 테스트 작성**

`src/shared/api/supabase/proxy.test.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@supabase/ssr', () => {
  return {
    createServerClient: vi.fn((_url, _key, options) => {
      return { __cookies: options.cookies };
    }),
  };
});

vi.mock('@/shared/config', () => {
  return { readPublicEnv: () => ({ supabaseUrl: 'http://x', supabaseAnonKey: 'k' }) };
});

import { createSupabaseProxyClient } from './proxy';

describe('createSupabaseProxyClient', () => {
  it('setAll 이 request 와 response 쿠키에 모두 기록한다', () => {
    const request = new NextRequest('https://limjaejoon.com/admin/posts');
    const response = NextResponse.next();
    const client = createSupabaseProxyClient(request, response) as unknown as {
      __cookies: { setAll: (c: { name: string; value: string; options: object }[]) => void };
    };

    client.__cookies.setAll([{ name: 'sb', value: '1', options: {} }]);

    expect(request.cookies.get('sb')?.value).toBe('1');
    expect(response.cookies.get('sb')?.value).toBe('1');
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/shared/api/supabase/proxy.test.ts`
Expected: FAIL — 모듈 없음.

- [ ] **Step 3: proxy 클라이언트 구현**

`src/shared/api/supabase/proxy.ts`:

```ts
/** proxy 전용 Supabase 세션 클라이언트 — next/headers 대신 request/response 쿠키에 바인딩한다 */
import { readPublicEnv } from '@/shared/config';
import { createServerClient } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';
import type { Database } from './database.types';

/** 세션 갱신 쿠키를 request(다운스트림)·response(브라우저) 양쪽에 써야 유실되지 않는다 */
export const createSupabaseProxyClient = (
  request: NextRequest,
  response: NextResponse
) => {
  const env = readPublicEnv();

  return createServerClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
};
```

- [ ] **Step 4: index export 추가**

`src/shared/api/supabase/index.ts` 에 한 줄 추가:

```ts
export { createSupabaseProxyClient } from './proxy';
```

그리고 `src/shared/api/index.ts` 의 supabase re-export 블록에 `createSupabaseProxyClient` 를 추가한다.

- [ ] **Step 5: 테스트 통과 확인**

Run: `npx vitest run src/shared/api/supabase/proxy.test.ts && npm run fsd`
Expected: PASS.

- [ ] **Step 6: 커밋**

```bash
git add src/shared/api/supabase/proxy.ts src/shared/api/supabase/proxy.test.ts src/shared/api/supabase/index.ts src/shared/api/index.ts
git commit -m "feat(auth): add proxy-bound supabase session client"
```

---

## Task 3: features/auth — signIn / signOut

**Files:**
- Create: `src/features/auth/api/signIn.ts`, `src/features/auth/api/signOut.ts`
- Create: `src/features/auth/index.ts`
- Test: `src/features/auth/api/signIn.test.ts`, `src/features/auth/api/signOut.test.ts`

**Interfaces:**
- Consumes: `createSupabaseBrowserClient` (`@/shared/api`).
- Produces:
  - `signIn(input: { email: string; password: string }): Promise<{ error: string | null }>`
  - `signOut(): Promise<void>`

- [ ] **Step 1: signIn 실패 테스트 작성**

`src/features/auth/api/signIn.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';

const signInWithPassword = vi.fn();
vi.mock('@/shared/api', () => {
  return {
    createSupabaseBrowserClient: () => ({ auth: { signInWithPassword } }),
  };
});

import { signIn } from './signIn';

describe('signIn', () => {
  it('성공하면 error 가 null 이다', async () => {
    signInWithPassword.mockResolvedValueOnce({ error: null });
    await expect(signIn({ email: 'a@x.com', password: 'pw' })).resolves.toEqual({
      error: null,
    });
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'a@x.com',
      password: 'pw',
    });
  });

  it('실패하면 error 메시지를 반환한다', async () => {
    signInWithPassword.mockResolvedValueOnce({ error: { message: '잘못된 로그인' } });
    await expect(signIn({ email: 'a@x.com', password: 'x' })).resolves.toEqual({
      error: '잘못된 로그인',
    });
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/features/auth/api/signIn.test.ts`
Expected: FAIL — 모듈 없음.

- [ ] **Step 3: signIn 구현**

`src/features/auth/api/signIn.ts`:

```ts
/** auth feature 의 로그인 액션 — browser client 로 세션 쿠키를 발급받는다 */
import { createSupabaseBrowserClient } from '@/shared/api';

/** 이메일/비밀번호 로그인 — 성공 시 error null, 실패 시 메시지를 반환한다 */
export const signIn = async (input: {
  email: string;
  password: string;
}): Promise<{ error: string | null }> => {
  const client = createSupabaseBrowserClient();
  const { error } = await client.auth.signInWithPassword(input);

  return { error: error ? error.message : null };
};
```

- [ ] **Step 4: signOut 실패 테스트 작성**

`src/features/auth/api/signOut.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';

const signOut = vi.fn();
vi.mock('@/shared/api', () => {
  return { createSupabaseBrowserClient: () => ({ auth: { signOut } }) };
});

import { signOut as signOutAction } from './signOut';

describe('signOut', () => {
  it('browser client 의 signOut 을 호출한다', async () => {
    signOut.mockResolvedValueOnce({ error: null });
    await signOutAction();
    expect(signOut).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 5: signOut 구현**

`src/features/auth/api/signOut.ts`:

```ts
/** auth feature 의 로그아웃 액션 — 세션 쿠키를 폐기한다 */
import { createSupabaseBrowserClient } from '@/shared/api';

/** 현재 세션을 종료한다 */
export const signOut = async (): Promise<void> => {
  const client = createSupabaseBrowserClient();
  await client.auth.signOut();
};
```

- [ ] **Step 6: index 공개 API 작성**

`src/features/auth/index.ts`:

```ts
/** auth feature public API */
export { signIn } from './api/signIn';
export { signOut } from './api/signOut';
```

- [ ] **Step 7: 테스트·fsd 통과 확인**

Run: `npx vitest run src/features/auth && npm run fsd`
Expected: PASS.

- [ ] **Step 8: 커밋**

```bash
git add src/features/auth
git commit -m "feat(auth): add signIn/signOut actions"
```

---

## Task 4: features/auth — LoginForm / SignOutButton / useSignIn

**Files:**
- Create: `src/features/auth/model/useSignIn.ts`
- Create: `src/features/auth/ui/LoginForm/LoginForm.tsx`, `.css.ts`
- Create: `src/features/auth/ui/SignOutButton/SignOutButton.tsx`
- Modify: `src/features/auth/index.ts`
- Test: `src/features/auth/ui/LoginForm/LoginForm.test.tsx`

**Interfaces:**
- Consumes: `signIn`, `signOut`, `useRouter` (`next/navigation`).
- Produces: `useSignIn()`, `LoginForm`, `SignOutButton` (default exports via named).

- [ ] **Step 1: LoginForm 실패 테스트 작성**

`src/features/auth/ui/LoginForm/LoginForm.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
const signIn = vi.fn();
vi.mock('../../api/signIn', () => ({ signIn: (...a: unknown[]) => signIn(...a) }));

import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('로그인 성공 시 /admin/posts 로 이동한다', async () => {
    signIn.mockResolvedValueOnce({ error: null });
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText('이메일'), 'a@x.com');
    await userEvent.type(screen.getByLabelText('비밀번호'), 'pw');
    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    expect(push).toHaveBeenCalledWith('/admin/posts');
  });

  it('실패하면 에러 메시지를 보여준다', async () => {
    signIn.mockResolvedValueOnce({ error: '잘못된 로그인' });
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText('이메일'), 'a@x.com');
    await userEvent.type(screen.getByLabelText('비밀번호'), 'x');
    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByText('잘못된 로그인')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/features/auth/ui/LoginForm/LoginForm.test.tsx`
Expected: FAIL — 모듈 없음.

- [ ] **Step 3: useSignIn 구현**

`src/features/auth/model/useSignIn.ts`:

```ts
/** 로그인 폼 상태 훅 — 입력·에러·제출을 plain state 로 관리한다(RHF 미사용) */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '../api/signIn';

/** 로그인 성공 시 이동할 기본 목적지 */
const ADMIN_HOME = '/admin/posts';

/** 이메일/비밀번호 입력과 제출, 에러 노출을 담당한다 */
export const useSignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async () => {
    setPending(true);
    setError(null);

    const result = await signIn({ email, password });

    setPending(false);

    // 실패는 폼에 머무르고, 성공만 보호 구역으로 보낸다
    if (result.error) {
      setError(result.error);
      return;
    }

    router.push(ADMIN_HOME);
  };

  return { email, setEmail, password, setPassword, error, pending, submit };
};
```

- [ ] **Step 4: LoginForm 구현**

`src/features/auth/ui/LoginForm/LoginForm.tsx`:

```tsx
/** admin 로그인 폼 — 이메일/비밀번호로 세션을 발급받는다 */
'use client';

import type { FormEvent } from 'react';
import { useSignIn } from '../../model/useSignIn';
import * as s from './LoginForm.css';

/** 이메일/비밀번호 입력과 제출 UI */
export function LoginForm() {
  const { email, setEmail, password, setPassword, error, pending, submit } =
    useSignIn();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };

  return (
    <form
      className={s.root}
      onSubmit={onSubmit}>
      <label className={s.field}>
        <span>이메일</span>
        <input
          type='email'
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
      </label>
      <label className={s.field}>
        <span>비밀번호</span>
        <input
          type='password'
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
      </label>
      {error ? <p className={s.error}>{error}</p> : null}
      <button
        type='submit'
        disabled={pending}>
        로그인
      </button>
    </form>
  );
}
```

- [ ] **Step 5: LoginForm 스타일 작성**

`src/features/auth/ui/LoginForm/LoginForm.css.ts`:

```ts
/** LoginForm 스타일 — 좁은 단일 컬럼 로그인 폼 */
import { style } from '@vanilla-extract/css';

/** 폼 루트 — 세로 스택 */
export const root = style({ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 });

/** 라벨+인풋 필드 */
export const field = style({ display: 'flex', flexDirection: 'column', gap: 4 });

/** 에러 메시지 */
export const error = style({ color: 'red' });
```

- [ ] **Step 6: SignOutButton 구현**

`src/features/auth/ui/SignOutButton/SignOutButton.tsx`:

```tsx
/** 로그아웃 버튼 — 세션 종료 후 로그인 화면으로 보낸다 */
'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '../../api/signOut';

/** 클릭 시 세션을 종료하고 /admin/login 으로 이동한다 */
export function SignOutButton() {
  const router = useRouter();

  const onClick = async () => {
    await signOut();
    router.push('/admin/login');
  };

  return (
    <button
      type='button'
      onClick={onClick}>
      로그아웃
    </button>
  );
}
```

- [ ] **Step 7: index 공개 API 갱신**

`src/features/auth/index.ts` 에 추가:

```ts
export { LoginForm } from './ui/LoginForm/LoginForm';
export { SignOutButton } from './ui/SignOutButton/SignOutButton';
```

- [ ] **Step 8: 테스트·fsd 통과 확인**

Run: `npx vitest run src/features/auth && npm run fsd`
Expected: PASS.

- [ ] **Step 9: 커밋**

```bash
git add src/features/auth
git commit -m "feat(auth): add login form and sign-out button"
```

---

## Task 5: pages/admin-login + 공개 로그인 라우트

**Files:**
- Create: `src/pages/admin-login/ui/AdminLoginPage/AdminLoginPage.tsx`, `.css.ts`
- Create: `src/pages/admin-login/index.ts`
- Create: `app/admin/(public)/login/page.tsx`
- Test: `src/pages/admin-login/ui/AdminLoginPage/AdminLoginPage.test.tsx`

**Interfaces:**
- Consumes: `LoginForm` (`@/features/auth`).
- Produces: `AdminLoginPage` (default export from page shell).

- [ ] **Step 1: 실패 테스트 작성**

`src/pages/admin-login/ui/AdminLoginPage/AdminLoginPage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/auth', () => ({ LoginForm: () => <div>login-form</div> }));

import { AdminLoginPage } from './AdminLoginPage';

describe('AdminLoginPage', () => {
  it('제목과 로그인 폼을 렌더한다', () => {
    render(<AdminLoginPage />);
    expect(screen.getByRole('heading', { name: '관리자 로그인' })).toBeInTheDocument();
    expect(screen.getByText('login-form')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/pages/admin-login`
Expected: FAIL — 모듈 없음.

- [ ] **Step 3: AdminLoginPage 구현**

`src/pages/admin-login/ui/AdminLoginPage/AdminLoginPage.tsx`:

```tsx
/** admin 로그인 page 조립 — 로그인 폼을 단독 화면으로 보여준다 */
import { LoginForm } from '@/features/auth';
import * as s from './AdminLoginPage.css';

/** 관리자 로그인 화면 */
export function AdminLoginPage() {
  return (
    <main className={s.main}>
      <h1 className={s.title}>관리자 로그인</h1>
      <LoginForm />
    </main>
  );
}
```

`src/pages/admin-login/ui/AdminLoginPage/AdminLoginPage.css.ts`:

```ts
/** AdminLoginPage 스타일 — 중앙 정렬 좁은 로그인 화면 */
import { style } from '@vanilla-extract/css';

/** page 루트 */
export const main = style({ maxWidth: 360, margin: '0 auto', padding: 32 });

/** 제목 */
export const title = style({ marginBottom: 24 });
```

- [ ] **Step 4: index 공개 API 작성**

`src/pages/admin-login/index.ts`:

```ts
/** admin-login page public API */
export { AdminLoginPage } from './ui/AdminLoginPage/AdminLoginPage';
```

- [ ] **Step 5: 라우트 shell 작성**

`app/admin/(public)/login/page.tsx`:

```tsx
export { AdminLoginPage as default } from '@/pages/admin-login';
```

- [ ] **Step 6: 테스트·fsd 통과 확인**

Run: `npx vitest run src/pages/admin-login && npm run fsd`
Expected: PASS.

- [ ] **Step 7: 커밋**

```bash
git add src/pages/admin-login "app/admin/(public)"
git commit -m "feat(auth): add admin login page and public route"
```

---

## Task 6: posts admin write RLS 마이그레이션

**Files:**
- Create: `supabase/migrations/<ts>_posts_admin_write_policies.sql`

**Interfaces:**
- Produces: authenticated 의 admin claim 기반 posts SELECT/INSERT/UPDATE 정책.

- [ ] **Step 1: 마이그레이션 파일 생성**

Run: `supabase migration new posts_admin_write_policies`
Expected: `supabase/migrations/<ts>_posts_admin_write_policies.sql` 생성.

- [ ] **Step 2: 정책 SQL 작성**

생성된 파일 내용:

```sql
-- authenticated 가 posts 에 쓰기를 시도할 수 있게 grant (RLS 가 실제 허용을 통제)
grant insert, update on table public.posts to authenticated;

-- 조회: admin 은 draft 포함 전부 (기존 published-only 정책과 permissive OR 결합)
create policy "Admin select all posts" on public.posts
  for select using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- 삽입: 새로 써질 행이 admin claim 을 만족해야 한다
create policy "Admin insert posts" on public.posts
  for insert with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- 수정: 기존 행(using)과 바뀔 행(with check) 둘 다 통제
create policy "Admin update posts" on public.posts
  for update using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
              with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
```

- [ ] **Step 3: 로컬 적용 확인**

Run: `supabase db reset` (로컬)
Expected: 마이그레이션 전부 재적용, 에러 없음.

- [ ] **Step 4: 커밋**

```bash
git add supabase/migrations
git commit -m "feat(auth): add admin write RLS policies for posts"
```

---

## Task 7: Storage 버킷명 통일 + 정책 마이그레이션 + config

**Files:**
- Create: `supabase/migrations/<ts>_storage_post_images_policies.sql`
- Modify: `supabase/config.toml`, `.env.example`

**Interfaces:**
- Produces: `post-images` 버킷의 admin insert/select 정책, public bucket 설정.

- [ ] **Step 1: config.toml 버킷 설정 추가**

`supabase/config.toml` 의 주석 처리된 예시 아래에 추가:

```toml
[storage.buckets.post-images]
public = true
file_size_limit = "5MiB"
allowed_mime_types = ["image/jpeg", "image/png", "image/webp", "image/avif"]
```

- [ ] **Step 2: .env.example 버킷명 통일**

`.env.example` 에서 `LOCAL_POST_IMAGE_BUCKET=post-images-local` 을 `LOCAL_POST_IMAGE_BUCKET=post-images` 로 바꾸고, `ADMIN_POST_TOKEN=` 줄을 제거, `ADMIN_EMAIL=` 을 Admin 섹션에 추가한다. (실제 `.env.local` 도 동일하게 맞춘다 — 사용자 수동.)

- [ ] **Step 3: 마이그레이션 파일 생성**

Run: `supabase migration new storage_post_images_policies`

- [ ] **Step 4: Storage 정책 SQL 작성**

```sql
-- 업로드: post-images 버킷의 posts/ 경로에 admin 만 insert
create policy "Admin insert post images" on storage.objects
  for insert with check (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = 'posts'
    and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

-- 업로드 응답 RETURNING 이 SELECT 를 요구하므로 admin select 도 둔다
create policy "Admin select post images" on storage.objects
  for select using (
    bucket_id = 'post-images'
    and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );
```

- [ ] **Step 5: 로컬 적용 확인**

Run: `supabase db reset`
Expected: 마이그레이션·버킷 생성 에러 없음.

- [ ] **Step 6: 커밋**

```bash
git add supabase/migrations supabase/config.toml .env.example
git commit -m "feat(auth): add storage policies and unify post-images bucket"
```

---

## Task 8: app_metadata role 부여 스크립트

**Files:**
- Create: `scripts/set-admin-role.mjs`
- Modify: `src/shared/config/env.ts` (adminEmail 추가), `package.json` (script)

**Interfaces:**
- Consumes: `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL` (또는 target 키), `ADMIN_EMAIL`.
- Produces: `npm run auth:set-admin` — 대상 유저에 `app_metadata.role='admin'` 부여.

- [ ] **Step 1: env 에 adminEmail 추가 (테스트 먼저)**

`src/shared/config/env.test.ts` 에 케이스 추가 — `readServerEnv` 결과에 `adminEmail: 'me@x.com'` 이 포함되도록(픽스처에 `ADMIN_EMAIL: 'me@x.com'` 추가). 그리고 `ServerEnv` 에 `adminEmail: string` 추가.

Run: `npx vitest run src/shared/config/env.test.ts` → FAIL 확인.

- [ ] **Step 2: env.ts 수정**

`src/shared/config/env.ts` 의 `ServerEnv` 타입에 `adminEmail: string;` 추가, `readServerEnv` 반환에 `adminEmail: requireEnv(source, 'ADMIN_EMAIL')` 추가. (`adminPostToken` 은 Task 11 에서 제거.)

Run: `npx vitest run src/shared/config/env.test.ts` → PASS.

- [ ] **Step 3: 스크립트 작성**

`scripts/set-admin-role.mjs`:

```js
// 운영자 유저에 app_metadata.role='admin' 을 1회 부여한다 (service role 필요)
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_LOCAL_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.LOCAL_SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;

if (!url || !key || !email) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL 필요');
}

const admin = createClient(url, key);

// email 로 유저를 찾아 app_metadata.role 을 admin 으로 설정
const { data, error } = await admin.auth.admin.listUsers();
if (error) throw error;

const user = data.users.find((u) => u.email === email);
if (!user) throw new Error(`유저 없음: ${email} (먼저 계정을 생성하세요)`);

const updated = await admin.auth.admin.updateUserById(user.id, {
  app_metadata: { role: 'admin' },
});
if (updated.error) throw updated.error;

console.log(`admin role 부여 완료: ${email}`);
```

- [ ] **Step 4: package.json 스크립트 추가**

`"auth:set-admin": "node scripts/set-admin-role.mjs"` 를 scripts 에 추가.

- [ ] **Step 5: 로컬 동작 확인**

로컬 Supabase 에 테스트 유저 생성 후 Run: `ADMIN_EMAIL=<local-user> npm run auth:set-admin`
Expected: "admin role 부여 완료" 출력.

- [ ] **Step 6: 커밋**

```bash
git add scripts/set-admin-role.mjs package.json src/shared/config/env.ts src/shared/config/env.test.ts
git commit -m "feat(auth): add admin role grant script and ADMIN_EMAIL env"
```

---

## Task 9: admin Route Handler 3종을 세션 인가로 전환

**Files:**
- Modify: `app/api/admin/posts/route.ts`, `app/api/admin/posts/[id]/route.ts`, `app/api/admin/images/route.ts`
- Create: `src/shared/api/http/adminGuard.ts` (공용 가드·에러 매핑), `src/shared/api/http/adminGuard.test.ts`
- Modify: `src/shared/api/http/index.ts`

**Interfaces:**
- Consumes: `createSupabaseServerClient`, `getSessionClaims`, `isAdmin`.
- Produces:
  - `requireAdmin(request: Request): Promise<{ client; error: NextResponse | null }>` — 세션 클라이언트 생성, Origin 검사, admin 확인. 실패 시 `error` 에 401/403 응답.
  - `mapWriteError(error: unknown): NextResponse` — Postgres 코드 → 상태.

- [ ] **Step 1: adminGuard 실패 테스트 작성**

`src/shared/api/http/adminGuard.test.ts` — 다음을 검증한다(각 케이스 한국어 설명):
- Origin 이 허용 도메인과 다르면 403.
- 세션 claim 이 null 이면 401.
- admin 이 아니면 403.
- admin 이면 error null 과 client 반환.
- `mapWriteError`: `{ code: '23505' }` → 409, `{ code: '42501' }` → 403, 기타 → 500.

```ts
import { describe, expect, it, vi } from 'vitest';

const getClaims = vi.fn();
vi.mock('@/shared/api', () => ({
  createSupabaseServerClient: async () => ({ auth: { getClaims } }),
}));

import { mapWriteError, requireAdmin } from './adminGuard';

const req = (origin: string | null) =>
  new Request('https://limjaejoon.com/api/admin/posts', {
    method: 'POST',
    headers: origin ? { origin } : {},
  });

describe('requireAdmin', () => {
  it('Origin 이 요청 호스트와 다르면 403 이다', async () => {
    const { error } = await requireAdmin(req('https://evil.com'));
    expect(error?.status).toBe(403);
  });

  it('세션이 없으면 401 이다', async () => {
    getClaims.mockResolvedValueOnce({ data: { claims: null }, error: null });
    const { error } = await requireAdmin(req('https://limjaejoon.com'));
    expect(error?.status).toBe(401);
  });

  it('admin 이 아니면 403 이다', async () => {
    getClaims.mockResolvedValueOnce({
      data: { claims: { sub: '1', app_metadata: { role: 'user' } } },
      error: null,
    });
    const { error } = await requireAdmin(req('https://limjaejoon.com'));
    expect(error?.status).toBe(403);
  });

  it('admin 이면 error 가 null 이다', async () => {
    getClaims.mockResolvedValueOnce({
      data: { claims: { sub: '1', app_metadata: { role: 'admin' } } },
      error: null,
    });
    const { error, client } = await requireAdmin(req('https://limjaejoon.com'));
    expect(error).toBeNull();
    expect(client).toBeDefined();
  });
});

describe('mapWriteError', () => {
  it('unique_violation 은 409 다', () => {
    expect(mapWriteError({ code: '23505' }).status).toBe(409);
  });
  it('RLS 거부(42501)는 403 이다', () => {
    expect(mapWriteError({ code: '42501' }).status).toBe(403);
  });
  it('그 외는 500 이다', () => {
    expect(mapWriteError(new Error('x')).status).toBe(500);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/shared/api/http/adminGuard.test.ts`
Expected: FAIL — 모듈 없음.

- [ ] **Step 3: adminGuard 구현**

`src/shared/api/http/adminGuard.ts`:

```ts
/** admin Route Handler 공용 가드 — 세션 클라이언트로 Origin·admin 을 재검증하고 에러를 상태로 매핑한다 */
import { getSessionClaims, isAdmin } from '@/entities/session';
import { createSupabaseServerClient } from '@/shared/api';
import { NextResponse } from 'next/server';

/** 쿠키 인증은 CSRF 표면이 생기므로 Origin 이 요청 호스트와 같은지 확인한다 */
const isSameOrigin = (request: Request): boolean => {
  const origin = request.headers.get('origin');
  if (!origin) {
    return false;
  }
  return new URL(origin).host === new URL(request.url).host;
};

/** 세션 클라이언트를 만들고 Origin·admin 을 검증한다. 실패 시 error 에 응답을 담는다 */
export const requireAdmin = async (request: Request) => {
  if (!isSameOrigin(request)) {
    return { client: null, error: NextResponse.json({ message: 'Forbidden' }, { status: 403 }) };
  }

  const client = await createSupabaseServerClient();
  const claims = await getSessionClaims(client);

  if (!claims) {
    return { client: null, error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }

  if (!isAdmin(claims)) {
    return { client: null, error: NextResponse.json({ message: 'Forbidden' }, { status: 403 }) };
  }

  return { client, error: null as NextResponse | null };
};

/** Postgres 에러 코드를 외부 상태로 정규화한다 (원문은 노출하지 않음) */
export const mapWriteError = (error: unknown): NextResponse => {
  const code = (error as { code?: string })?.code;

  // 23505=unique_violation, 42501=insufficient_privilege(RLS 거부)
  if (code === '23505') {
    return NextResponse.json({ message: 'Conflict' }, { status: 409 });
  }
  if (code === '42501') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
};
```

`src/shared/api/http/index.ts` 에 `export { requireAdmin, mapWriteError } from './adminGuard';` 추가. (adminGuard 가 entities/session 을 import 하므로 FSD 상 shared→entities 위반이다. 이를 피하려면 adminGuard 를 shared 가 아니라 라우트 인접 위치나 `app` 계층에 두어야 한다 — 실제 배치는 아래 주의 참고.)

<!-- FSD 주의: shared 는 entities 를 import 할 수 없다. adminGuard 는 entities/session 에 의존하므로 shared 가 아니라 각 Route Handler(app 계층)에서 직접 조립하거나, features 계층 헬퍼로 올린다. 실행 시 steiger(npm run fsd) 가 이 위반을 잡으면 adminGuard 로직을 app/api 인접 파일로 옮긴다. -->

- [ ] **Step 4: FSD 위반 회피 — 가드를 app 계층으로**

`npm run fsd` 가 shared→entities import 를 막으므로, `adminGuard.ts` 를 `src/shared` 가 아니라 라우트가 쓰는 형태로 배치한다. 최종 위치: `app/api/admin/_lib/adminGuard.ts` (Route Handler 전용, app 계층이라 entities import 허용). Step 1·3 의 파일 경로를 `app/api/admin/_lib/adminGuard.ts`·`adminGuard.test.ts` 로 옮기고 import 를 상대경로로 맞춘다.

Run: `npm run fsd`
Expected: PASS (위반 없음).

- [ ] **Step 5: posts POST 라우트 전환**

`app/api/admin/posts/route.ts`:

```ts
import { createAdminPost, type UpsertPostInput } from '@/entities/post';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '../_lib/adminGuard';

/** 로그인한 admin 세션만 새 글을 생성한다 (권한은 RLS 가 최종 집행) */
export const POST = async (request: Request) => {
  const { client, error } = await requireAdmin(request);
  if (error) {
    return error;
  }

  const input = (await request.json()) as UpsertPostInput;

  try {
    const post = await createAdminPost(client, input);
    return NextResponse.json({ post }, { status: 201 });
  } catch (writeError) {
    return mapWriteError(writeError);
  }
};
```

- [ ] **Step 6: posts PATCH 라우트 전환**

`app/api/admin/posts/[id]/route.ts` — 동일 패턴. `requireAdmin` → `updateAdminPost(client, id, input)` → 성공 200, 실패 `mapWriteError`.

- [ ] **Step 7: images 라우트 전환**

`app/api/admin/images/route.ts` — `requireAdmin` 으로 교체, `createSupabaseAdminClient` 대신 `client` 사용, 업로드 전 MIME/크기 검사 추가:

```ts
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_BYTES = 5 * 1024 * 1024;
// isFile 통과 후:
if (!ALLOWED.includes(file.type) || file.size > MAX_BYTES) {
  return NextResponse.json({ message: 'Unsupported file' }, { status: 422 });
}
```

버킷명은 `env.postImageBucket`(이제 `post-images`) 유지. 업로드 실패는 `mapWriteError` 로 감싼다.

- [ ] **Step 8: 라우트 테스트 갱신**

기존 `route.test.ts` 3종은 토큰 mock 을 제거하고 `requireAdmin` 을 mock 한다(admin=성공/비admin=403/미로그인=401). 각 케이스 한국어 설명.

Run: `npx vitest run app/api/admin && npm run fsd`
Expected: PASS.

- [ ] **Step 9: 커밋**

```bash
git add app/api/admin
git commit -m "feat(auth): switch admin routes to session authorization + RLS"
```

---

## Task 10: 보호 라우트 이동 + 레이아웃 가드 + proxy

**Files:**
- Move: `app/admin/posts/` → `app/admin/(protected)/posts/`
- Create: `app/admin/(protected)/layout.tsx`
- Create: `proxy.ts` (루트)

**Interfaces:**
- Consumes: `createSupabaseProxyClient`, `getSessionClaims`, `isAdmin`, `createSupabaseServerClient`.
- Produces: `/admin/*` 보호(비로그인 redirect, 비admin 403).

- [ ] **Step 1: 라우트 이동**

`app/admin/posts/{page.tsx,new/page.tsx,[id]/page.tsx}` 를 `app/admin/(protected)/posts/...` 로 이동한다. URL(`/admin/posts` 등)은 route group 괄호라 그대로 유지된다.

Run: `npm run build` (또는 `npm run dev` 로 라우트 확인)
Expected: `/admin/posts` 정상 라우팅.

- [ ] **Step 2: 보호 레이아웃 작성**

`app/admin/(protected)/layout.tsx`:

```tsx
/** admin 보호 구역 레이아웃 — 서버에서 admin 을 재확인하는 보조 가드 */
import { getSessionClaims, isAdmin } from '@/entities/session';
import { SignOutButton } from '@/features/auth';
import { createSupabaseServerClient } from '@/shared/api';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

/** 비로그인은 로그인으로 보내고, 로그인했지만 비admin 은 403 문구를 보여준다 */
export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const client = await createSupabaseServerClient();
  const claims = await getSessionClaims(client);

  if (!claims) {
    redirect('/admin/login');
  }

  // 서버 컴포넌트에선 signOut/쿠키삭제가 불가하므로 비admin 은 최소 403 화면만 보인다
  if (!isAdmin(claims)) {
    return <main>403 — 접근 권한이 없습니다.</main>;
  }

  return (
    <div>
      <header>
        <SignOutButton />
      </header>
      {children}
    </div>
  );
}
```

- [ ] **Step 3: proxy 판정 순수 함수 + 테스트**

`proxy.ts` 의 redirect 판정을 테스트 가능한 순수 함수로 분리한다. `app/admin/(protected)/_lib/` 대신 루트 인접 `proxyDecision.ts` 로 두고 테스트한다:

```ts
// proxyDecision.ts
/** 경로+admin여부로 redirect 목적지를 정한다 (proxy 에서 쿠키 IO 와 분리해 테스트 가능하게) */
export const decideRedirect = (pathname: string, admin: boolean): string | null => {
  const isAdminArea = pathname.startsWith('/admin');
  const isLogin = pathname === '/admin/login';
  if (isAdminArea && !isLogin && !admin) {
    return '/admin/login';
  }
  if (isLogin && admin) {
    return '/admin/posts';
  }
  return null;
};
```

테스트: 비admin+`/admin/posts`→`/admin/login`, admin+`/admin/login`→`/admin/posts`, admin+`/admin/posts`→null, 비admin+`/admin/login`→null.

- [ ] **Step 4: proxy.ts 작성**

`proxy.ts` (루트):

```ts
/** Next 16 proxy — 세션 쿠키를 갱신하고 비로그인/역할에 따라 optimistic redirect 한다 */
import { getSessionClaims, isAdmin } from '@/entities/session';
import { createSupabaseProxyClient } from '@/shared/api';
import { NextResponse, type NextRequest } from 'next/server';
import { decideRedirect } from './proxyDecision';

/** /admin 하위만 처리한다 */
export const config = { matcher: ['/admin/:path*'] };

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const client = createSupabaseProxyClient(request, response);

  // getClaims 가 세션 쿠키를 갱신하고, 그 쿠키는 response 에 복사돼 유실되지 않는다
  const claims = await getSessionClaims(client);
  const target = decideRedirect(request.nextUrl.pathname, isAdmin(claims));

  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    const redirectResponse = NextResponse.redirect(url);
    // 갱신 쿠키를 redirect 응답에도 복사(누락 방지)
    response.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c));
    return redirectResponse;
  }

  return response;
}
```

- [ ] **Step 5: 테스트·빌드 확인**

Run: `npx vitest run proxyDecision.test.ts && npm run fsd && npm run build`
Expected: PASS. 로그인 안 한 채 `/admin/posts` → `/admin/login` redirect 확인(`npm run dev`).

- [ ] **Step 6: 커밋**

```bash
git add "app/admin/(protected)" proxy.ts proxyDecision.ts proxyDecision.test.ts
git rm -r app/admin/posts
git commit -m "feat(auth): protect admin routes with proxy and layout guard"
```

---

## Task 11: 에디터 토큰 제거

**Files:**
- Modify: `src/features/post-editor/api/uploadPostImage.ts`, `src/features/post-editor/ui/PostEditorForm/PostEditorForm.tsx`
- Modify: 관련 테스트

**Interfaces:**
- Produces: `uploadPostImage(file: File): Promise<UploadPostImageResponse>` (token 인자 제거).

- [ ] **Step 1: uploadPostImage 테스트 갱신**

`uploadPostImage.test.ts` 에서 `token` 인자와 `x-admin-post-token` 헤더 기대를 제거하고, 헤더 없이 `/api/admin/images` 로 FormData 를 보내는지 검증하도록 바꾼다.

Run: `npx vitest run src/features/post-editor/api/uploadPostImage.test.ts` → FAIL 확인.

- [ ] **Step 2: uploadPostImage 수정**

`token` 파라미터와 `headers: { 'x-admin-post-token': token }` 를 제거한다. 세션 쿠키가 same-origin 요청에 자동 첨부된다.

Run: 같은 테스트 → PASS.

- [ ] **Step 3: PostEditorForm 정리 테스트**

`PostEditorForm.test.tsx` 에서 토큰 필드 관련 케이스를 제거하고, 저장 요청이 `x-admin-post-token` 헤더 없이 나가는지 확인하는 케이스로 바꾼다.

Run: `npx vitest run src/features/post-editor/ui/PostEditorForm/PostEditorForm.test.tsx` → FAIL 확인.

- [ ] **Step 4: PostEditorForm 수정**

`readStoredToken`, `token` state, `updateToken`, sessionStorage, "Admin token" 입력 필드, `uploadPostImage(file, token)` 의 token 인자, 저장 fetch 의 `x-admin-post-token` 헤더를 모두 제거한다. 이미지 업로드 호출은 `uploadPostImage(file)` 로 바꾼다.

Run: 같은 테스트 → PASS.

- [ ] **Step 5: 전체 확인·커밋**

Run: `npx vitest run src/features/post-editor && npm run fsd`

```bash
git add src/features/post-editor
git commit -m "refactor(auth): drop admin token from editor, rely on session cookie"
```

---

## Task 12: 공유 토큰 잔재 제거

**Files:**
- Delete: `src/shared/api/admin/auth.ts`, `src/shared/api/admin/auth.test.ts`
- Modify: `src/shared/api/admin/index.ts`, `src/shared/api/index.ts`, `src/shared/config/env.ts`, `src/shared/config/env.test.ts`, `.env.example`

**Interfaces:**
- Produces: `verifyAdminPostToken`·`ADMIN_POST_TOKEN` 완전 제거. `ServerEnv` 에서 `adminPostToken` 삭제.

- [ ] **Step 1: env 테스트에서 adminPostToken 기대 제거**

`src/shared/config/env.test.ts` 픽스처의 `ADMIN_POST_TOKEN` 과 결과 기대의 `adminPostToken` 을 삭제한다.

Run: `npx vitest run src/shared/config/env.test.ts` → FAIL(아직 env.ts 가 반환).

- [ ] **Step 2: env.ts 에서 adminPostToken 제거**

`ServerEnv` 의 `adminPostToken: string;` 과 `readServerEnv` 의 `adminPostToken: requireEnv(...)` 줄을 제거한다.

Run: 같은 테스트 → PASS.

- [ ] **Step 3: verifyAdminPostToken 삭제**

`src/shared/api/admin/auth.ts` 와 `auth.test.ts` 를 삭제하고, `src/shared/api/admin/index.ts` 및 `src/shared/api/index.ts` 의 `verifyAdminPostToken` export 를 제거한다.

- [ ] **Step 4: .env.example 정리**

`ADMIN_POST_TOKEN=` 줄이 남아있다면 제거(Task 7 에서 처리됐다면 skip). `ADMIN_EMAIL=` 존재 확인.

- [ ] **Step 5: 전수 확인**

Run: `grep -rn "adminPostToken\|ADMIN_POST_TOKEN\|verifyAdminPostToken" src app .env.example`
Expected: 결과 없음.

Run: `npm run fsd && npm run lint && npm run type-check && npm run test`
Expected: PASS.

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "chore(auth): remove legacy admin token mechanism"
```

---

## Task 13: RLS/Storage 통합 테스트 (로컬 Supabase)

**Files:**
- Create: `vitest.integration.config.ts`, `tests/integration/helpers.ts`
- Create: `tests/integration/rls-posts.integration.test.ts`, `tests/integration/storage-images.integration.test.ts`
- Modify: `package.json` (`test:integration`)

**Interfaces:**
- Consumes: 로컬 Supabase(`supabase start`), service role 로 생성한 admin/non-admin 유저.
- Produces: `npm run test:integration` — anon/non-admin/admin 3주체의 posts·storage 접근 검증.

- [ ] **Step 1: 통합용 vitest config 작성**

`vitest.integration.config.ts` — `include: ['tests/integration/**/*.integration.test.ts']`, `environment: 'node'`, 기본 setup 제외.

- [ ] **Step 2: 헬퍼 작성**

`tests/integration/helpers.ts` — 로컬 URL/anon/service 키를 env 에서 읽어, service role admin API 로 admin 유저(app_metadata.role=admin)와 non-admin 유저를 만들고, 각각 `signInWithPassword` 로 세션 클라이언트를 반환하는 함수, anon 클라이언트 반환 함수를 export.

- [ ] **Step 3: posts RLS 테스트 작성**

`tests/integration/rls-posts.integration.test.ts` — 한국어 설명:
- anon: published SELECT 가능, draft SELECT 불가, INSERT 거부.
- non-admin authenticated: INSERT 거부(42501), draft SELECT 불가.
- admin: INSERT 성공, draft SELECT 가능, UPDATE 성공.

- [ ] **Step 4: storage 테스트 작성**

`tests/integration/storage-images.integration.test.ts` — 한국어 설명:
- non-admin: `post-images/posts/...` 업로드 거부.
- admin: 업로드 성공 + public URL 조회 가능.

- [ ] **Step 5: package.json 스크립트 추가**

`"test:integration": "vitest run --config vitest.integration.config.ts"` 추가.

- [ ] **Step 6: 로컬 실행 확인**

Run: `supabase start` 후 `npm run test:integration`
Expected: PASS. (CI 기본 `npm run test` 에는 포함하지 않는다 — 로컬 Supabase 의존.)

- [ ] **Step 7: 커밋**

```bash
git add tests/integration vitest.integration.config.ts package.json
git commit -m "test(auth): add local Supabase RLS/storage integration tests"
```

---

## Task 14: 마무리 검증 + 원격 적용 준비

**Files:** 없음(검증·문서).

- [ ] **Step 1: 프로젝트 마무리 검증 루틴**

Run: `npm run fsd && npm run lint && npm run type-check && npm run test && npm run format`
Expected: 전부 통과(exit code 0). build 는 별도 확인.

- [ ] **Step 2: 원격 마이그레이션 dry-run**

Run: `supabase db push --dry-run`
Expected: posts/storage 정책 마이그레이션만 신규로 표시.

- [ ] **Step 3: 원격 적용 체크리스트(수동)**

문서로 남긴다(README 또는 이 계획 하단):
- 원격 운영자 계정 생성 → `ADMIN_EMAIL` 지정 → `npm run auth:set-admin`(원격 키) → 최초 로그인.
- Supabase Auth 설정: "Allow new users to sign up" OFF, anonymous sign-in OFF, 유출 비밀번호 차단 ON, rate limit 확인.
- `post-images` 버킷 public=true, file_size_limit/allowed_mime_types 확인.

- [ ] **Step 4: 최종 커밋(문서 갱신 시)**

```bash
git add -A
git commit -m "docs(auth): add remote rollout checklist"
```

---

## Self-Review 결과

- **Spec 커버리지:** 인증(T3–5), RLS 집행(T6), app_metadata role(T8), entities/session 배치(T1), proxy/route group/보조가드(T10), getClaims(T1/9/10), Storage 정책·제약(T7,9), 에러 매핑(T9), 토큰 제거(T11,12), 하드닝·원격설정(T14), 통합테스트(T13) — 스펙 항목 모두 대응됨.
- **FSD 주의:** `adminGuard` 가 entities 를 쓰므로 shared 가 아닌 `app/api/admin/_lib/` 에 둔다(T9 Step4). proxy redirect 판정도 순수 함수로 분리해 shared 오염을 피한다.
- **타입 일관성:** `SessionClaims`, `getSessionClaims`, `isAdmin`, `requireAdmin`, `mapWriteError`, `uploadPostImage(file)` 시그니처가 태스크 간 일치.
- **교정:** 스펙의 `useSignIn(RHF)` → RHF 미설치로 plain state 로 변경. 버킷명 로컬/원격 `post-images` 통일(공유 마이그레이션 정합).
