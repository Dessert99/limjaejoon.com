'use client';

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
} from '@/views/blog/components/ui/alert-dialog';
import { Button } from '@/views/blog/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/views/blog/components/ui/dialog';
import { Input } from '@/views/blog/components/ui/input';
import { useTagManager } from '../../lib/useTagManager';

type TagManagerDialogProps = {
  tags: TagWithUsage[];
  onTagsChange: (tags: TagWithUsage[]) => void;
};

/** 태그를 만들고 이름을 고치고 지우는 대화상자. 글이 붙은 태그는 지울 수 없다. */
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

  // 이름 고치기가 실패하면 편집 상태를 유지해 고친 값을 다시 쓰지 않게 한다
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
            className='text-sm text-blog-destructive'>
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
          className='max-h-80 divide-y divide-blog-border overflow-y-auto'>
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
                  <span className='grow text-sm'>{tag.name}</span>
                )}

                <span className='shrink-0 text-sm text-blog-muted-foreground'>
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
                        <Button
                          type='button'
                          size='sm'
                          variant='outline'
                          // 글이 붙은 태그는 DB가 어차피 막으므로 버튼부터 잠근다
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
          <p className='text-sm text-blog-muted-foreground'>
            아직 태그가 없다. 위에서 하나 만들어 보자.
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
