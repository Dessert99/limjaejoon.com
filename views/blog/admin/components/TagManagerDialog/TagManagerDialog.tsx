'use client';

/** 태그 관리 모달 — 글을 쓰다 태그가 아쉬울 때 그 자리에서 고친다 */
import { useState } from 'react';
import type { TagWithUsage } from '../../../lib/tag.types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTagManager } from '../../lib/useTagManager';

type TagManagerDialogProps = {
  tags: TagWithUsage[];
  onTagsChange: (tags: TagWithUsage[]) => void;
};

export function TagManagerDialog({
  tags,
  onTagsChange,
}: TagManagerDialogProps) {
  const { error, pending, create, rename, remove } =
    useTagManager(onTagsChange);
  const [draftName, setDraftName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const startEditing = (tag: TagWithUsage) => {
    setEditingId(tag.id);
    setEditingName(tag.name);
  };

  // 실패했는데 편집을 닫거나 입력을 비우면 친 값이 사라진다 — 중복 이름 409 에서 바로 겪는다
  const commitEditing = async () => {
    if (!editingId || !editingName.trim()) {
      return;
    }

    if (await rename(editingId, editingName)) {
      setEditingId(null);
    }
  };

  const commitCreate = async () => {
    if (!draftName.trim()) {
      return;
    }

    if (await create(draftName)) {
      setDraftName('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type='button'
          variant='outline'
          size='sm'>
          태그 관리
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>태그 관리</DialogTitle>
          <DialogDescription>
            이름을 고치면 그 태그가 붙은 글이 전부 따라간다. 연결된 글이 있으면
            지울 수 없다.
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <p
            role='alert'
            className='text-body-sm text-destructive'>
            {error}
          </p>
        ) : null}

        <div className='flex gap-2'>
          <Input
            value={draftName}
            placeholder='새 태그 이름'
            disabled={pending}
            onChange={(event) => {
              setDraftName(event.target.value);
            }}
          />
          <Button
            type='button'
            disabled={pending || !draftName.trim()}
            onClick={() => {
              void commitCreate();
            }}>
            추가
          </Button>
        </div>

        <ul
          aria-label='태그 목록'
          className='max-h-80 divide-y divide-border overflow-y-auto'>
          {tags.map((tag) => {
            const editing = editingId === tag.id;
            const linked = tag.postCount > 0;

            return (
              <li
                key={tag.id}
                className='flex items-center gap-3 py-2'>
                {editing ? (
                  <Input
                    autoFocus
                    value={editingName}
                    disabled={pending}
                    aria-label={`${tag.name} 새 이름`}
                    onChange={(event) => {
                      setEditingName(event.target.value);
                    }}
                  />
                ) : (
                  <span className='grow text-body-sm'>{tag.name}</span>
                )}

                <span className='shrink-0 text-body-sm text-muted-foreground'>
                  글 {tag.postCount}편
                </span>

                {editing ? (
                  <>
                    <Button
                      type='button'
                      size='sm'
                      disabled={pending || !editingName.trim()}
                      onClick={() => {
                        void commitEditing();
                      }}>
                      확인
                    </Button>
                    <Button
                      type='button'
                      size='sm'
                      variant='ghost'
                      onClick={() => {
                        setEditingId(null);
                      }}>
                      취소
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type='button'
                      size='sm'
                      variant='outline'
                      disabled={pending}
                      onClick={() => {
                        startEditing(tag);
                      }}>
                      이름 수정
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        {/* 비활성은 편의일 뿐이다 — 억지로 눌러도 FK 가 거부한다 */}
                        <Button
                          type='button'
                          size='sm'
                          variant='outline'
                          disabled={pending || linked}>
                          삭제
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            &lsquo;{tag.name}&rsquo; 을 지울까?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            되돌릴 수 없다. 다시 쓰려면 새로 만들어야 한다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              void remove(tag.id);
                            }}>
                            지운다
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </li>
            );
          })}
        </ul>

        {tags.length === 0 ? (
          <p className='text-body-sm text-muted-foreground'>
            아직 태그가 없다. 위에서 하나 만들어 보자.
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
