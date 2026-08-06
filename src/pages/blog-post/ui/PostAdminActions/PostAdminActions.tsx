'use client';

/** 글 상세의 운영자 액션 — 수정으로 보내고, 삭제는 확인 단계를 거친다 */
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useIsAdmin } from '@/features/auth';
import { deletePost } from '@/features/manage-post';
import { Button } from '@/shared/ui';

export function PostAdminActions({ id }: { id: string }) {
  const admin = useIsAdmin();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!admin) {
    return null;
  }

  const handleDelete = () => {
    setPending(true);
    setError(null);

    void deletePost(id)
      .then(() => {
        router.push('/blog');
        router.refresh();
      })
      .catch((caught: unknown) => {
        setError(caught instanceof Error ? caught.message : '삭제에 실패했다');
        setPending(false);
      });
  };

  return (
    <div className='mt-8 flex flex-wrap items-center gap-3'>
      <Button
        href={`/admin/posts/${id}`}
        variant='outline'
        size='sm'>
        수정
      </Button>

      {confirming ? (
        <>
          <Button
            size='sm'
            disabled={pending}
            onClick={handleDelete}>
            정말 지운다
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              setConfirming(false);
            }}>
            취소
          </Button>
        </>
      ) : (
        // 되돌릴 수 없는 동작이라 한 번 더 묻는다
        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            setConfirming(true);
          }}>
          삭제
        </Button>
      )}

      {error ? (
        <p
          role='alert'
          className='text-body-sm text-accent'>
          {error}
        </p>
      ) : null}
    </div>
  );
}
