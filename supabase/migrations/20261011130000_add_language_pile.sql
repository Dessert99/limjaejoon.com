-- 언어 책을 분야 더미에서 꺼내 언어 더미로 모은다. Python은 TypeScript 다음에 둔다
update public.books
set category = '언어'
where slug in ('javascript', 'typescript');

insert into public.books (slug, title, category, color, sort_order, logo) values
  ('python', 'Python', '언어', '#3776ab', 35, 'python');
