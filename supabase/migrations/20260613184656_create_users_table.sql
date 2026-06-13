-- 학습용 standalone 유저 테이블 (auth 미연동) — 워크플로우 연습 목적
create table public.users (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  display_name text not null,
  created_at   timestamptz not null default now()
);

-- RLS 미설정 시 anon 키로는 한 행도 못 읽음 → public 테이블엔 정책이 반드시 필요
alter table public.users enable row level security;

-- 학습용이라 읽기만 전체 공개 (쓰기 정책 없음 = anon 쓰기 불가, seed 는 SQL 권한으로 우회)
create policy "Public read access" on public.users
  for select using (true);
