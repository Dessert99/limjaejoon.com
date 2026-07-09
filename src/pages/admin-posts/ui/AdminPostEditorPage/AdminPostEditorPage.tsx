/** admin post editor page composition — route mode 를 editor form props 로 변환한다 */
import { PostEditorForm, type PostEditorValue } from '@/features/post-editor';
import * as s from './AdminPostEditorPage.css';

type AdminPostEditorPageProps = {
  mode: 'create' | 'edit';
  postId?: string;
};

type AdminPostEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const emptyPost: PostEditorValue = {
  title: '',
  slug: '',
  description: '',
  series: null,
  tags: [],
  status: 'draft',
  published_at: null,
  content_markdown: '',
};

/** admin 글 작성·수정 editor 화면 */
export function AdminPostEditorPage({
  mode,
  postId,
}: AdminPostEditorPageProps) {
  return (
    <main className={s.main}>
      <header>
        <h1 className={s.title}>
          {mode === 'create' ? '새 글 작성' : '글 수정'}
        </h1>
        {postId ? <p className={s.muted}>ID {postId}</p> : null}
      </header>
      <PostEditorForm
        initialValue={emptyPost}
        mode={mode}
        postId={postId}
      />
    </main>
  );
}

/** admin 새 글 작성 page */
export function AdminPostNewPage() {
  return <AdminPostEditorPage mode='create' />;
}

/** admin 기존 글 수정 page */
export async function AdminPostEditPage({ params }: AdminPostEditPageProps) {
  const { id } = await params;

  return (
    <AdminPostEditorPage
      mode='edit'
      postId={id}
    />
  );
}
