-- 디자인 시스템·모션·3D 웹 책을 프론트엔드 더미 끝에 둔다. 글은 천천히 채우므로 당분간 빈 책이다
-- 브랜드 색이 크림색 제목과 대비 3:1이 안 나오면 색상은 두고 명도만 낮췄다 (greensock #88ce02 → #659901)
insert into public.books (slug, title, category, color, sort_order, logo) values
  ('design-system', '디자인 시스템', '프론트엔드', '#f24e1e', 75, 'figma'),
  ('motion',        '모션',          '프론트엔드', '#659901', 76, 'greensock'),
  ('3d-web',        '3D 웹',         '프론트엔드', '#1f1f22', 77, 'threedotjs');
