/** TagManagerDialog 테스트 — 태그를 고치고 지우는 계약이 부모에게 그대로 전달되는지 검증한다 */
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TagWithUsage } from '../../../lib/tag.types';
import {
  createTag,
  deleteTag,
  fetchTags,
  renameTag,
} from '../../lib/tagRequests';
import { TagManagerDialog } from './TagManagerDialog';

vi.mock('../../lib/tagRequests', () => {
  return {
    fetchTags: vi.fn(),
    createTag: vi.fn(),
    renameTag: vi.fn(),
    deleteTag: vi.fn(),
  };
});

const TAGS: TagWithUsage[] = [
  { id: 'tag-a', name: 'React', postCount: 2 },
  { id: 'tag-b', name: '안 쓰는 태그', postCount: 0 },
];

const openDialog = async (onTagsChange = vi.fn()) => {
  const user = userEvent.setup();

  render(
    <TagManagerDialog
      tags={TAGS}
      onTagsChange={onTagsChange}
    />
  );

  await user.click(screen.getByRole('button', { name: '태그 관리' }));

  return { user, onTagsChange };
};

const rowOf = (name: string) => {
  const item = screen.getAllByRole('listitem').find((candidate) => {
    return candidate.textContent?.includes(name);
  });

  if (!item) {
    throw new Error(`${name} 행이 없다`);
  }

  return within(item);
};

describe('TagManagerDialog', () => {
  beforeEach(() => {
    vi.mocked(fetchTags).mockReset().mockResolvedValue(TAGS);
    vi.mocked(createTag).mockReset();
    vi.mocked(renameTag).mockReset();
    vi.mocked(deleteTag).mockReset();
  });

  it('태그마다 연결된 글 수를 보여준다', async () => {
    await openDialog();

    expect(rowOf('React').getByText('글 2편')).toBeInTheDocument();
  });

  it('연결된 글이 있으면 삭제 버튼이 비활성이다', async () => {
    await openDialog();

    expect(rowOf('React').getByRole('button', { name: '삭제' })).toBeDisabled();
    expect(
      rowOf('안 쓰는 태그').getByRole('button', { name: '삭제' })
    ).toBeEnabled();
  });

  it('이름을 고치면 renameTag 를 부르고 새 목록을 부모에게 넘긴다', async () => {
    const next: TagWithUsage[] = [
      { id: 'tag-a', name: 'Preact', postCount: 2 },
    ];
    vi.mocked(fetchTags).mockResolvedValue(next);
    const { user, onTagsChange } = await openDialog();

    await user.click(rowOf('React').getByRole('button', { name: '이름 수정' }));
    const field = screen.getByRole('textbox', { name: 'React 새 이름' });
    await user.clear(field);
    await user.type(field, 'Preact');
    await user.click(screen.getByRole('button', { name: '확인' }));

    expect(renameTag).toHaveBeenCalledWith('tag-a', 'Preact');
    // 글 수는 서버만 안다 — 낙관적으로 깁지 않고 다시 읽는다
    expect(onTagsChange).toHaveBeenCalledWith(next);
  });

  it('이름이 공백뿐이면 요청하지 않는다', async () => {
    const { user } = await openDialog();

    await user.click(rowOf('React').getByRole('button', { name: '이름 수정' }));
    const field = screen.getByRole('textbox', { name: 'React 새 이름' });
    await user.clear(field);
    await user.type(field, '   ');

    expect(screen.getByRole('button', { name: '확인' })).toBeDisabled();
    expect(renameTag).not.toHaveBeenCalled();
  });

  it('새 태그를 만들면 createTag 를 부른다', async () => {
    const { user } = await openDialog();

    await user.type(screen.getByPlaceholderText('새 태그 이름'), 'Tailwind');
    await user.click(screen.getByRole('button', { name: '추가' }));

    expect(createTag).toHaveBeenCalledWith('Tailwind');
  });

  it('요청이 실패하면 친 이름을 지우지 않고 화면에 머문다', async () => {
    vi.mocked(createTag).mockRejectedValue(new Error('이미 있는 태그다'));
    const { user } = await openDialog();

    await user.type(screen.getByPlaceholderText('새 태그 이름'), 'React');
    await user.click(screen.getByRole('button', { name: '추가' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '이미 있는 태그다'
    );
    // 지우면 중복 이름 409 를 만날 때마다 처음부터 다시 쳐야 한다
    expect(screen.getByPlaceholderText('새 태그 이름')).toHaveValue('React');
  });

  it('이름 수정이 실패하면 편집 상태를 닫지 않는다', async () => {
    vi.mocked(renameTag).mockRejectedValue(new Error('이미 있는 태그다'));
    const { user } = await openDialog();

    await user.click(rowOf('React').getByRole('button', { name: '이름 수정' }));
    const field = screen.getByRole('textbox', { name: 'React 새 이름' });
    await user.clear(field);
    await user.type(field, 'Preact');
    await user.click(screen.getByRole('button', { name: '확인' }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'React 새 이름' })).toHaveValue(
      'Preact'
    );
  });
});
