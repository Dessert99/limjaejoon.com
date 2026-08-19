'use client';

import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { isAdmin } from '@/lib/auth/isAdmin';
import { type SessionClaims } from '@/lib/auth/session';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const toClaims = (user: User): SessionClaims => {
  const role = user.app_metadata.role;

  return {
    sub: user.id,
    app_metadata: typeof role === 'string' ? { role } : undefined,
  };
};

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
