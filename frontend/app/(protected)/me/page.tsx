// /me 라우트 — 현재 로그인 사용자 정보를 서버 컴포넌트에서 직접 표시
// verifySession은 React.cache()로 dedup되므로 layout에서 한 번 + 여기서 한 번 호출해도 fetch는 1회
import { verifySession } from '@/lib/auth/verifySession';

import * as s from './page.css';

export const metadata = {
  title: '내 정보',
  description: '현재 로그인된 사용자 정보',
};

export default async function MePage() {
  // verifySession은 user 반환 또는 redirect — 통과 시 user 보장
  const user = await verifySession('/me');

  // 가입일 한국 로케일 포맷 — 서버 렌더 단계에서 계산
  const createdAtFormatted = new Date(user.createdAt).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className={s.container}>
      <h1 className={s.title}>내 정보</h1>
      <dl className={s.list}>
        <div className={s.row}>
          <dt className={s.label}>이메일</dt>
          <dd className={s.value}>{user.email}</dd>
        </div>
        <div className={s.row}>
          <dt className={s.label}>가입일</dt>
          <dd className={s.value}>{createdAtFormatted}</dd>
        </div>
      </dl>
    </section>
  );
}
