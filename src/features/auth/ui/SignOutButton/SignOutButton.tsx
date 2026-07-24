'use client';

/** 로그아웃 버튼 — 세션 종료 후 로그인 화면으로 보낸다 */
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
