# Blog UI Kit — 임재준

코드베이스의 실 화면을 정적 HTML + React(Babel inline)로 재현한 UI 키트입니다. 컴포넌트는 재사용 가능한 최소 단위로 쪼개져 있습니다.

## 포함된 컴포넌트

- `SiteHeader.jsx` — 고정 상단 헤더 (로고 + 네비 + 검색 + 테마 토글)
- `HeroSection.jsx` — 홈 히어로 (이름 + 태그라인 3줄 + SNS)
- `Timeline.jsx` — 경력/활동/학력 공통 타임라인
- `ProjectCard.jsx` — 프로젝트 카드 (hover lift)
- `SkillChips.jsx` — 보유 기술 칩 리스트
- `BlogRow.jsx` — 블로그 리스트 1행
- `TagSidebar.jsx` — 태그 필터 사이드바
- `TOC.jsx` — 포스트 우측 목차
- `PostHeader.jsx` — 포스트 타이틀/설명/태그 헤더

## 재현한 화면

`index.html`에서 화면을 전환해서 볼 수 있습니다.

1. **Home** — 자기소개 + 타임라인
2. **Blog (지식 모음)** — 태그 필터 + 포스트 리스트
3. **Post** — MDX 본문 + TOC
4. **Search** — 검색 입력 + 결과

## 주의

- `react-icons` 대신 인라인 SVG (Heroicons / Simple Icons 동형)
- MDX 본문은 실제 포스트 1편(`Git HEAD`) 내용을 마크업으로 박아 재현
- 라우팅은 fake (클라이언트 사이드 화면 전환)
