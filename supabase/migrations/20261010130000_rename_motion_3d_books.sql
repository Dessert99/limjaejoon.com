-- 주제 이름이던 두 책을 다른 프론트엔드 책처럼 라이브러리 이름으로 바꾼다. 아직 글이 없어 slug를 바꿔도 깨지는 주소가 없다
update public.books as b
set slug = m.new_slug, title = m.title
from (values
  ('motion', 'gsap',    'GSAP'),
  ('3d-web', 'threejs', 'Three.js')
) as m(old_slug, new_slug, title)
where b.slug = m.old_slug;
