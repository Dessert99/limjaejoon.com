# 설계 기록 아카이브

**이 폴더는 현행 규칙이 아니다.** 각 문서는 작성 시점의 스냅샷이며, 그 뒤 코드가 바뀌어도 갱신하지 않는다. 의도적으로 고치지 않는다 — 기록을 사후 수정하면 "왜 그때 그렇게 정했나"를 잃는다.

따라서 여기 적힌 경로·패키지·명령어는 **지금 존재하지 않을 수 있다.** 실제로 `vanilla-extract`, `.css.ts`, `content/blog/`, `radix-ui`, `docs/conventions/component-convention.md` 는 전부 철거됐지만 본문에는 그대로 남아 있다. 이 폴더 자체도 2026-08-10 까지 `docs/superpowers/` 였고, 본문의 `docs/superpowers/...` 경로는 그 시절 이름이다 — 지금은 `docs/design-records/` 로 읽는다.

현행 규칙의 출처는 `docs/conventions/` 와 `CLAUDE.md` 다. 충돌하면 그쪽이 이긴다.

## 지금 코드에 남아 있는 것

| 문서 | 상태 |
| --- | --- |
| `2026-07-29-tailwind-interactive-portfolio` | **부분 생존** — 토큰 계층·섹션 반전은 살아 있고 모션 아키텍처(7절)는 GSAP 스펙으로 대체됨 |
| `2026-07-31-compound-components` | **부분 생존** — `SectionHeading` 은 남아 있고, "compound 는 shared/ui 안에서만" 규칙은 폐기됨 |
| `2026-07-23-admin-auth` / `2026-07-24-admin-auth` | **부분 생존** — API 라우트·RLS·통합 테스트는 살아 있고 로그인 UI 는 철거됨 |
| `2026-07-09-blog-platform-phase-1` | **부분 생존** — `posts` 테이블·API 는 살아 있고 블로그 화면은 철거됨 |
| `2026-06-10-fsd-canonical-rearchitecture` | 현행 구조의 기원 — 세부는 folder-structure.md 가 최신 |
| `2026-07-29-design-system-teardown` | 완료된 철거 작업. 삭제 대상 목록이라 죽은 경로가 가장 많다 |
