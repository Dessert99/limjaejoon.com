-- 태그를 걷어내고 글을 "책"(대주제)에 직접 묶는다. 책은 분류(더미)별로 방 안 테이블에 놓인다.
create table public.books (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique constraint books_slug_format check (slug ~ '^[a-z0-9-]+$'),
  title      text not null constraint books_title_trimmed check (title = btrim(title) and title <> ''),
  category   text not null constraint books_category_trimmed check (category = btrim(category) and category <> ''),
  color      text not null constraint books_color_hex check (color ~ '^#[0-9a-f]{6}$'),
  sort_order integer not null,
  created_at timestamptz not null default now()
);

alter table public.books enable row level security;

create policy "Public read books" on public.books
  for select using (true);

create policy "Admin write books" on public.books
  for all using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
          with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

grant select on table public.books to anon, authenticated, service_role;
grant insert, update, delete on table public.books to authenticated, service_role;

insert into public.books (slug, title, category, color, sort_order) values
  ('html-css',     'HTML/CSS',     '프론트엔드', '#b3541e', 10),
  ('javascript',   'JavaScript',   '프론트엔드', '#8a7418', 20),
  ('typescript',   'TypeScript',   '프론트엔드', '#2f5f9e', 30),
  ('react',        'React',        '프론트엔드', '#1d4e6b', 40),
  ('nextjs',       'Next.js',      '프론트엔드', '#1f1f22', 50),
  ('react-native', 'React Native', '프론트엔드', '#3a2f6b', 60),
  ('playwright',   'Playwright',   '프론트엔드', '#2d6a4f', 70),
  ('nodejs',       'Node.js',      '백엔드',     '#2f5a3a', 80),
  ('nestjs',       'NestJS',       '백엔드',     '#7a2136', 90),
  ('docker',       'Docker',       '인프라',     '#1f5c8a', 100),
  ('kubernetes',   'Kubernetes',   '인프라',     '#2c4f8f', 110),
  ('git',          'Git',          '인프라',     '#c2410c', 120),
  ('network',      '네트워크',      'CS',        '#4a4a52', 130),
  ('os',           '운영체제',      'CS',        '#5c4630', 140);

-- 글은 개념 정리(concept, 책 한 권에 속함)와 이야기(story, 회고·에세이, 책 없음)로 나뉜다
alter table public.posts
  add column kind text not null default 'concept'
    constraint posts_kind_check check (kind in ('concept', 'story')),
  add column book_id uuid references public.books (id) on delete restrict;

create index posts_book_id_idx on public.posts (book_id);

-- 책으로 묶을 수 없고 남길 이유도 없는 글
delete from public.posts
where slug in ('2026-04-03-ci-cd', '2026-04-02-why-use-pyenv-on-macos');

update public.posts
set kind = 'story'
where slug in (
  '2026-09-11-ai-engineering',
  '2026-09-10-react-native-troubleshooting',
  '2026-04-15-fora-expo-renewal',
  '2026-04-11-startup-strategy'
);

-- 기존 태그를 보고 손으로 정한 책. 이 표가 곧 옛 태그 분류의 기록이다
update public.posts as p
set book_id = b.id
from (values
  ('2026-09-02-generate-button',             'html-css'),
  ('2026-05-29-css-cascade',                 'html-css'),
  ('2026-04-05-data-active',                 'html-css'),
  ('2026-04-16-typescript-generic',          'typescript'),
  ('2026-05-21-zod',                         'typescript'),
  ('2026-05-17-fiber',                       'react'),
  ('2026-05-16-rhf-register-vs-controller',  'react'),
  ('2026-04-16-custom-hook',                 'react'),
  ('2026-04-09-ESLint',                      'react'),
  ('2026-09-15-nextjs-hydration',            'nextjs'),
  ('2026-08-21-next-spa',                    'nextjs'),
  ('2026-04-17-parallel-intercepting-routes','nextjs'),
  ('2026-04-11-route-handler',               'nextjs'),
  ('2026-04-09-next-server-component-pattern','nextjs'),
  ('2026-04-08-next-middleware',             'nextjs'),
  ('2026-04-07-next-clientComponent',        'nextjs'),
  ('2026-04-07-next-serverComponent',        'nextjs'),
  ('2026-04-07-next-tanstack-query',         'nextjs'),
  ('2026-04-06-next-fetch',                  'nextjs'),
  ('2026-04-08-playwright-Assertions',       'playwright'),
  ('2026-04-08-playwright-locator',          'playwright'),
  ('2026-04-15-docker',                      'docker'),
  ('2026-04-04-git-head',                    'git'),
  ('2026-04-03-git-worktree',                'git'),
  ('2026-04-03-github-actions',              'git'),
  ('2026-04-09-DNS',                         'network')
) as m(slug, book)
join public.books as b on b.slug = m.book
where p.slug = m.slug;

-- 개념 글은 반드시 책이 있고 이야기는 책이 없다. 위 매핑에서 빠진 개념 글이 있으면 여기서 실패한다
alter table public.posts
  add constraint posts_kind_book_check
  check ((kind = 'concept' and book_id is not null) or (kind = 'story' and book_id is null));

drop table public.post_tags;
drop table public.tags;
