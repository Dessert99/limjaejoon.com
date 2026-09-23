-- 책 표지(와 목록 모달 배경)에 까는 단색 로고. public/images/logos/<logo>.svg 파일 이름이고, 없으면 제목만 있는 표지다
alter table public.books
  add column logo text
    constraint books_logo_format check (logo ~ '^[a-z0-9-]+$');

-- 브랜드 색에 맞춘다. 크림색 제목(#f5f1e8)과 대비 3:1이 안 나오는 밝은 브랜드 색은 색상은 두고 명도만 낮췄다
update public.books as b
set color = m.color, logo = m.logo
from (values
  ('html-css',     '#e34f26', 'html5'),
  ('javascript',   '#958505', 'javascript'),
  ('typescript',   '#3178c6', 'typescript'),
  ('react',        '#058fb4', 'react'),
  ('nextjs',       '#1f1f22', 'nextdotjs'),
  ('react-native', '#058fb4', 'react'),
  ('playwright',   '#29992d', null),
  ('nodejs',       '#579247', 'nodedotjs'),
  ('nestjs',       '#e0234e', 'nestjs'),
  ('docker',       '#138ae5', 'docker'),
  ('kubernetes',   '#326ce5', 'kubernetes'),
  ('git',          '#f03c2e', 'git')
) as m(slug, color, logo)
where b.slug = m.slug;
