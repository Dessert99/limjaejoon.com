'use client';

/** 브라우저 세션으로 운영자 여부를 본다 — 버튼 노출용일 뿐이고, 인가는 API 가드와 RLS 가 집행한다 */
import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { isAdmin } from '@/lib/auth/isAdmin';
import { type SessionClaims } from '@/lib/auth/session';
// barrel(@/shared/api) 대신 client 모듈을 직접 import — 서버 전용 코드(next/headers)가 클라 번들에 섞이는 것을 막는다
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const toClaims = (user: User): SessionClaims => {
  const role = user.app_metadata.role;

  return {
    sub: user.id,
    app_metadata: typeof role === 'string' ? { role } : undefined,
  };
};

/** 처음엔 늘 false 다 — 서버 렌더 결과에 운영자 UI 가 섞이지 않아야 정적 HTML 이 한 벌로 유지된다 */
export const useIsAdmin = (): boolean => {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    let alive = true;

    void client.auth.getUser().then(({ data }) => {
      if (alive) {
        setAdmin(data.user ? isAdmin(toClaims(data.user)) : false);
      }
    });

    // 로그인·로그아웃이 다른 탭에서 일어나도 버튼이 따라오게 구독한다
    const { data: subscription } = client.auth.onAuthStateChange(
      (_event, session) => {
        setAdmin(session?.user ? isAdmin(toClaims(session.user)) : false);
      }
    );

    return () => {
      alive = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return admin;
};
