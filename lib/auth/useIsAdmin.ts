'use client';

import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { isAdmin } from '@/lib/auth/isAdmin';
import { type SessionClaims } from '@/lib/auth/session';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

/** 브라우저가 들고 있는 사용자에서 판정에 쓸 역할만 뽑는다. */
const toClaims = (user: User): SessionClaims => {
  const role = user.app_metadata.role;

  // app_metadata는 any라 문자열인지 확인해야 role: true 같은 값이 통과하지 않는다
  return {
    sub: user.id,
    app_metadata: typeof role === 'string' ? { role } : undefined,
  };
};

/** 관리자 전용 UI를 보일지 정한다. 화면 감추기용이고 실제 차단은 서버가 한다. */
export const useIsAdmin = (): boolean => {
  // 서버 렌더에는 세션이 없으니 false로 시작해야 하이드레이션이 어긋나지 않는다
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    let alive = true;

    // 첫 판정. 응답이 오기 전에 화면이 사라지면 버린 컴포넌트에 상태를 쓰게 된다
    void client.auth.getUser().then(({ data }) => {
      if (alive) {
        setAdmin(data.user ? isAdmin(toClaims(data.user)) : false);
      }
    });

    // 다른 탭에서 로그인·로그아웃해도 이 화면이 따라오게 구독한다
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
