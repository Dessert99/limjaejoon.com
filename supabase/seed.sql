-- db reset 시 마이그레이션 이후 자동 실행되는 더미 데이터 (학습용)
insert into public.users (email, display_name) values
  ('jaejoon@limjaejoon.com', '임재준'),
  ('ada@example.com', 'Ada Lovelace'),
  ('alan@example.com', 'Alan Turing');
