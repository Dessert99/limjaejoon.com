# 지식 모음 — Material Design 3 UI Kit

`limjaejoon.com`(개인 기술 블로그)을 **Material Design 3 + 5계절 테마**로 리스킨한
클릭형 프로토타입입니다. 다크/라이트 대신 **봄·여름·가을·겨울·밤** 세그먼트 스위처로
테마를 바꿉니다 (밤 = 사실상 다크 스킴).

## 실행

`index.html`을 브라우저로 엽니다. React + Babel(standalone)로 구동되며, 토큰은
루트의 `../../colors_and_type.css`, 컴포넌트는 `../../material-components.css`를 가져옵니다.

## 구성

| 파일 | 내용 |
|---|---|
| `index.html` | App 셸 + 라우팅(home / blog / post / search / about) + 스낵바·메뉴 |
| `kit.css` | 페이지 레이아웃 글루 (`@import` 토큰 + MD3 컴포넌트) |
| `Icons.jsx` | Material Symbols 스타일 인라인 SVG 아이콘 |
| `data.jsx` | 프로필·프로젝트·기술·포스트 더미 데이터 + `SEASONS` |
| `components.jsx` | `AppBar` · `SeasonSwitcher` · `BottomNav` · `FilterChip` · `ProjectCard` |
| `screens.jsx` | `Home` · `Blog` · `Search` · `Post` · `About` · `PostList` |

## 테마 전환의 핵심

```js
// 활성 계절 클래스를 <html>에 부여 — 이 한 줄이 전체 UI를 리스킨한다.
document.documentElement.className = 'theme-night';
```

모든 컴포넌트는 `var(--md-sys-color-*)` 역할만 참조하므로, 루트 클래스만 바꾸면
버튼·카드·칩·앱바·내비가 일제히 그 계절 팔레트로 전환됩니다. 이것이 `material/`의
vanilla-extract `createThemeContract` 패턴을 CSS 변수로 옮긴 형태입니다.

## 다루는 MD3 컴포넌트

Top app bar · Bottom navigation bar · Navigation rail(프리뷰) · Segmented button ·
Buttons(filled/tonal/elevated/outlined/text) · Extended FAB · Cards(elevated/filled/outlined) ·
Chips(assist/filter/input) · Text field(outlined) · List items · Menu · Snackbar · State layers.

> 이것은 디자인 재현이며 프로덕션 코드가 아닙니다. 상호작용은 실제 동작을 흉내 낸 모킹입니다.
