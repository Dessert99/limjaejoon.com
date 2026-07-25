# 디자인 시스템 리테마 설계 — "황혼의 프라하" 테라코타 (Terracotta Retheme)

> **구현은 별도 세션/플랜에서 진행한다.** 이 문서는 브레인스토밍으로 검증된 디자인을 자족적으로 옮긴 설계 스펙이다. 비주얼 기준은 브레인스토밍 세션의 리빙 스타일가이드(`all-components-v2.html`)이며, 값(팔레트 hex·모션·재질)은 그 화면에서 확정됐다.

## 배경

현재 디자인 시스템은 기능적으로는 완성돼 있으나(토큰 3계층 + Radix 프리미티브 15종 + 다크 2모드) 비주얼 정체성이 중립적 디폴트(쿨 그레이 + 형광 그린 + system-ui)에 가깝다. 이 사이트는 단순 블로그가 아니라 **"통통 튀는" 프론트엔드 포트폴리오**여야 한다. 그래서 프론트 실력을 보여주는 모션·인터랙션·손맛을 갖춘 고유 정체성으로 리테마한다.

정체성은 **색이 아니라 분위기(장소)** 로 정의한다: **황혼의 프라하 거리** — 테라코타 기와 지붕, 크림 회벽, 청동 녹청, 가스등 빛. 컨셉이 얹는 것은 새 브랜드색이 아니라 *따뜻한 빛과 공간감·재질*이다. 배경(실사 이미지)이 색을 책임지고, 컴포넌트는 토큰을 지킨다.

## 목표

- 컬러 토큰을 프라하 테라코타 팔레트로 재정립한다 — 채도/명도 램프 + 시맨틱(다크/라이트) 재매핑.
- 스프링/촉감 **모션**과 aged-bronze **재질 마감**을 디자인 토큰/시맨틱으로 승격한다.
- 이 언어를 공용 UI(`shared/ui`) 프리미티브 전체에 입힌다 — Button을 템플릿으로, 컴포넌트별 방언으로.

## 비목표 (범위 밖 / 후속)

- **프라하 실사 파랄랙스 배경** — 별도 하위 프로젝트(스펙 분리). 기술: 실사 포토 레이어 2.5D 파랄랙스(GSAP), 골든아워 톤. 이 스펙은 *컴포넌트 언어*에 한정한다.
- **타이포그래피 개편** — 세리프 디스플레이 도입 등은 별도 결정. 이번엔 기존 `fontFamily`(system-ui/mono) 유지.
- **페이지/위젯 재조립** — 홈·블로그 레이아웃 리디자인은 후속. 토큰 스왑으로 자동 재도색되는 것까지만.
- **Timeline 컴포넌트** — 삭제한다(사용자 결정). 아래 "회귀 영향" 참고.

## 확정 결정 (브레인스토밍)

1. **컨셉 = 황혼의 프라하**, 분위기는 빛·공간·재질로. 배경은 실사(후속), 컴포넌트는 토큰.
2. **브랜드색 = 테라코타(clay).** 녹청(verdigris)은 보조/positive, amber는 warning/하이라이트, rose는 드문 강조.
3. **에너지 = 스프링 촉감 + 키네틱/스크롤.** 컴포넌트엔 스프링(오버슈트) 모션.
4. **재질 = ③ aged-bronze 각인.** 매트한 금속판 + 인셋 음영, 누르면 눌리는 촉감.
5. **리얼리즘 경계** — 컴포넌트는 사진처럼 만들지 않는다. 솔리드 토큰 면 + 모션 + 절제된 마감으로만 컨셉을 낸다.
6. **critical은 테라코타와 구분되는 별도 레드.**
7. **다크 기본 유지** — `night`가 `:root`, `light`는 `data-theme="light"`. OS 스킴 미추종.

---

## 1. 컬러 시스템

### 1.1 팔레트 램프 (raw)

기존 `tokens/color/palette.ts`를 대체한다. 5개 패밀리 + 정보/critical. 스텝 명명은 기존 관례(`00`~`1000`, 밝음→어두움) 유지.

```
sand (따뜻한 뉴트럴 — 베이스/표면/텍스트)
  00 #FBF7EF · 100 #F4EADA(크림) · 200 #E3D0AE(샌드스톤) · 300 #CDB891
  400 #A99A80 · 500 #8E8577(조약돌) · 600 #6F675B · 700 #565049
  800 #46423B · 900 #3D3B36(블타바밤) · 1000 #2A2823

clay (테라코타 — 브랜드/시그니처)
  100 #F1CDAD · 300 #DE9A5E · 400 #D3803A(오커) · 500 #B4553A(테라코타)
  600 #9C4632 · 700 #8F3F26(번트시에나) · 900 #552616

verdigris (청동 녹청 — positive/보조 브랜드)
  100 #D7E3DD · 300 #93B0A4 · 500 #6D9184(첨탑녹청) · 600 #587A6D
  700 #496459 · 900 #2B3933

amber (가스등/머스터드 — warning/따뜻한 하이라이트)
  100 #F8E6C0 · 300 #EFCB87 · 500 #E0A94F(머스터드) · 700 #B27F31 · 900 #6E4E1E

rose (더스티 로즈 — 드문 보조 강조)
  100 #EBD3CB · 300 #DCA99D · 500 #C98C7D · 700 #9E6355 · 900 #5E3A31

critical (경보 레드 — 브랜드 테라코타와 구분: 더 어둡고 덜 주황)
  weak-bg #3A201D · 500 #A9302A · stroke #7D2019 · fg(dark) #E7998F

river (블타바 강물 — informative. 팔레트 유일한 쿨톤) [확정]
  100 #DDE6EB · 300 #A8C0CE · 500 #7B96A8 · 700 #4E687A · 900 #26333B
```

**`river`(파랑) 추가는 확정.** 시맨틱 `informative`(관례상 파랑)를 채우려면 쿨톤이 필요한데 프라하 팔레트엔 파랑이 없어, "블타바 강물" 무톤 슬레이트블루를 추가한다. 팔레트 유일한 쿨톤이므로 informative 전용으로 절제해 쓴다.

`static`(black/white/alpha)은 기존 유지하되 알파 오버레이는 따뜻한 톤으로 조정(overlay `rgba(18,12,9,·)`).

### 1.2 시맨틱 매핑

컨트랙트 모양은 거의 **불변** — 이름은 그대로 두고 값만 바꾼다. **단 예외 1개: `bg.critical` 추가**(`bg` 12→13, `fg` 9 · `stroke` 7 유지). 이유는 §1.4.

**light(대낮 프라하)가 원본, dark(밤)는 같은 팔레트의 명도만 낮춘 파생이다** — hue·의미 매핑은 두 테마가 공유하고 스텝만 밝음↔어두움으로 바뀐다. 새 색을 dark에서 따로 만들지 않는다. 기본 테마는 dark(`night`).

**dark (`night`, 기본 — 대낮 팔레트를 명도만 낮춤):**

```
fg.neutral #F4EADA(sand100)   fg.muted #CDB891(sand300)   fg.brand #E8B888(clay200)
fg.onBrand #FBF7EF(sand00)    fg.critical #E7998F(텍스트 전용)  fg.warning #EFCB87(amber300)
fg.informative #A8C0CE(river300)  fg.positive #93B0A4(vd300)  fg.disabled #8E8577(sand500)

bg.canvas #3D3B36(sand900)    bg.surface #46423B(sand800)  bg.surfaceMuted #565049(sand700)
bg.brand #A64C34             bg.brandPressed #8F3F26(clay700)  bg.brandWeak #4A2E24
bg.critical #A9302A(솔리드)  bg.criticalWeak #3A201D      bg.warningWeak #453518       bg.informativeWeak #26333B(river900)
bg.positiveWeak #2B3933(vd900)  bg.disabled #565049(sand700)  bg.overlay rgba(18,12,9,.55)

stroke.neutral #6F675B(sand600)  stroke.muted #565049(sand700)  stroke.brand #D3803A(clay400)
stroke.critical #E7998F(critical200)  stroke.warning #B27F31(amber700)  stroke.informative #4E687A(river700)
stroke.positive #496459(vd700)
```

**light (`light`, "대낮 프라하"):**

```
fg.neutral #2A2823(sand1000)  fg.muted #6F675B(sand600)   fg.brand #8F3F26(clay700)
fg.onBrand #FBF7EF(sand00)   fg.critical #921F16         fg.warning #7A5312
fg.informative #3C5568       fg.positive #3B6154         fg.disabled #A99A80(sand400)

bg.canvas #F4EADA(sand100)   bg.surface #FBF7EF(sand00)   bg.surfaceMuted #E3D0AE(sand200)
bg.brand #A64C34             bg.brandPressed #8F3F26(clay700)  bg.brandWeak #F1CDAD(clay100)
bg.critical #A9302A(솔리드)  bg.criticalWeak #FBEAE7      bg.warningWeak #FBEFCF        bg.informativeWeak #E7EEF2
bg.positiveWeak #DFEAE4      bg.disabled #E3D0AE(sand200)  bg.overlay rgba(42,40,35,.45)

stroke.neutral #CDB891(sand300)  stroke.muted #E3D0AE(sand200)  stroke.brand #B4553A(clay500)
stroke.critical #C0392B      stroke.warning #B27F31       stroke.informative #7B96A8
stroke.positive #6D9184(vd500)
```

라이트 값은 대비 확보를 위해 브랜드/시맨틱 fg를 어두운 스텝으로 당긴다. 정확 대비는 §5에서 검증.

**구현 반영 (a11y 최종 리뷰, 플랜1 완료):** dark `stroke.brand`·`stroke.critical`은 포커스 링·invalid 보더의 비텍스트 3:1을 위해 clay400·critical200으로 **상향된 값이 정본**(위 표 반영). `onBrand`는 `sand['00']`(#FBF7EF)로 통일(대비만 상승). **해결(플랜3):** dark `fg.brand`가 surface 위 미달(4.23:1)이던 걸, Select가 첫 surface-brand-text 소비처가 되며 **clay300→clay200(#E8B888)로 상향**(surface≥4.69:1·canvas≥6:1, 여전히 테라코타)해 전역 해결. `fg.critical`(#E7998F)은 아직 surface 텍스트 소비처 없음 — 생기면 동일 방식으로 재확인. criticalSolid는 현재 hover/active/loading이 base와 같은 `bg.critical`(평평) — 눌림 연출은 플랜 2(Button 재작업).

### 1.3 `brand-solid` 노트

버튼 solid 브랜드 면은 clay500(#B4553A)보다 살짝 어둡고 붉은 **#A64C34**(테라코타↔번트시에나 중간)를 쓴다 — 크림 텍스트 대비·"구운 흙" 질감 때문. 시맨틱 `bg.brand`에 이 값을 둔다(다크·라이트 공통, ≈4.83:1).

### 1.4 criticalSolid 재매핑 (brand=테라코타의 파급) [코덱스 리뷰]

현재 Button `criticalSolid`는 `bg = fg.critical`, `label = fg.onBrand`로 매핑돼 있다. 기존 그린 시스템에선 dark `onBrand`가 어두워(gray1000) 밝은 fg.critical 배경 위에서 읽혔지만, 테라코타에선 brand가 중간톤이라 `onBrand`가 **크림(밝음)** 이 된다 → 밝은 `fg.critical`(#E7998F) 배경 + 크림 라벨 = **1.9:1**로 안 읽힌다.

해결: 솔리드 크리티컬 배경 토큰 **`bg.critical` (#A9302A)** 를 추가하고, Button `criticalSolid`를 `bg = bg.critical` + `label = fg.onBrand`(크림)로 재매핑한다(#A9302A 위 크림 ≈ 5.9:1). `fg.critical`(#E7998F)는 본문 크리티컬 텍스트 전용으로 남긴다. Button 재매핑은 플랜 2.

---

## 2. 모션 파운데이션

기존 `tokens/motion`에 **스프링(오버슈트) 이징**과 촉감 시맨틱을 추가한다. CSS `cubic-bezier` 백아웃은 단일 오버슈트("통통" 한 번)만 가능 — 다중 바운스는 의도적으로 배제(절제).

```
easing (추가)
  spring        cubic-bezier(.34, 1.40, .64, 1)   // 표준 촉감(hover 들림·회전)
  springStrong  cubic-bezier(.34, 1.56, .64, 1)   // 강한 오버슈트(썸 슬라이드·세그먼트)

motion 시맨틱 (추가)
  tactilePress   { duration d1(50ms)~d2(100ms), easing enter }  // :active 눌림
  tactileLift    { duration d6(300ms), easing spring }          // hover 들림
  controlSlide   { duration ~340ms, easing springStrong }       // switch/segment 이동
```

**reduced-motion:** `@media (prefers-reduced-motion: reduce)`에서 오버슈트·들림·슬라이드·회전을 즉시 전환(또는 no-transform)으로 중화한다. 색·마감은 유지. (Button의 기존 spinner 패턴과 동일 원칙.)

---

## 3. 재질(material) 파운데이션

aged-bronze 각인 마감을 **재사용 가능한 recipe/스타일 헬퍼**로 승격한다. 이건 raw 색 토큰이 아니라 그림자/보더 조합이므로, `shared/styles`에 스타일 상수(또는 vanilla-extract `style`/`recipe`)로 둔다.

```
finish.inset   inset 0 1px 0 rgba(255,236,214,.16), inset 0 -2px 3px rgba(60,20,10,.34)
               // 상단 광택 + 하단 각인 음영 = 놋쇠판 결
shadow.raise   0 2px 6px rgba(0,0,0,.32)          // 떠 있는 솔리드의 기본 그림자
shadow.press   inset 0 2px 6px rgba(0,0,0,.42)    // 눌렸을 때 인셋
```

적용 경계: **누를 수 있는 금속**(solid 버튼·switch 썸·slider 썸·segment 인디케이터)만 `finish.inset`. 표면/카드/메뉴는 따뜻한 보더 + 부드러운 그림자, 텍스트/구조는 클린.

---

## 4. 컴포넌트 처리

### 4.1 원칙

- `design-system-component.md` 준수 — Button의 API/처리를 딴 컴포넌트에 기계복제 금지. **언어는 공유, 표현은 해부구조별 방언.**
- 색은 §1 시맨틱 토큰만. 모션은 §2, 재질은 §3 참조.
- 각 컴포넌트는 기존 TDD·공개 API·스토리 규약 유지. 이번 변경은 주로 `.css.ts`.

### 4.2 컴포넌트별 노트 (스타일가이드 v2 확정)

```
Button      variant(primary=테라코타 / secondary=녹청 / outline / ghost / critical)
            size 재조정: xs·sm 더 작게, lg 로그인급, block(풀폭). solid=finish.inset+raise,
            hover 들림(spring), active 눌림(press). disabled/loading 기존 유지.
IconTile    surface 타일, hover 들림 + brand 색 전환.
Switch      트랙 색전환 + 썸 spring 슬라이드(springStrong), 썸에 finish.inset.
Toggle      *상태 칩*으로 재설계 — 좌측 인디케이터 점 + 리세스, 활성 시 테라코타 링.
            (솔리드 버튼과 다른 언어로 구분)
ToggleGroup *리세스 트랙 + 미끄러지는 인디케이터* — 불 켜진 조각이 springStrong으로 이동.
RadioGroup  hollow→filled clay 점.
Slider      track/range(clay) + 썸(finish.inset), hover 확대 spring.
Progress    clay 그라데 바.
Select      *리세스 계기판* — 라벨+값 창 + 분리된 셰브론 웰(밋밋한 인풋 탈피).
DropdownMenu surface 패널, hover row, 선택 시 brand-text + ✓.
Dialog      surface 모달 + 따뜻한 스크림(bg.overlay).
AlertDialog  파괴 확인 — critical 색 + critical 버튼.
Divider     sand-700 헤어라인.
Accordion   화살표 SVG 고정박스에서 *제자리 360° 회전*(spring), 열림 시 brand-text.
            body는 max-height spring 전개.
Timeline    완전 삭제 — 컴포넌트 + 홈 사용처(경력/활동/학력 섹션)까지.
```

---

## 5. 접근성

- **대비:** 브랜드/critical/텍스트 조합이 WCAG AA(본문 4.5:1, 큰 텍스트/UI 3:1) 충족하는지 다크·라이트 각각 검증. **코덱스 리뷰 반영:** dark `fg.muted`(→#CDB891 ≈5.5:1)·`fg.brand`(→#DE9A5E ≈4.6:1)를 14px 본문(nav·설명·링크)용으로 상향, `criticalSolid`는 `bg.critical #A9302A`+크림(≈5.9:1)로 교체(§1.4), 라이트 `bg.brand`는 §1.3와 일치하는 #A64C34(≈4.83:1). 구현 중 실측 재확인.
- **포커스:** focus-visible 링은 기존 `stroke.brand` 유지(테라코타). 배경 대비 식별 가능한지 확인.
- **reduced-motion:** §2 중화 규칙을 전 컴포넌트 공통 적용.
- **상태 의미:** Toggle 상태 칩·Segmented는 `data-state`/`aria` 유지(재질 변경이 aria 계약을 바꾸지 않음).

## 6. 회귀 영향

- **토큰 스왑 = 전역 재도색.** 컴포넌트가 `vars.color.*`를 참조하므로 토큰 교체 순간 홈·블로그·어드민이 모두 즉시 재색된다. `tokens.test.ts`로 컨트랙트 채움 검증, 주요 화면 육안 확인(disabled·surface 대비 깨짐 없는지).
- **Timeline 완전 제거:** `shared/ui/Timeline`(컴포넌트·스토리·테스트·공개 API)과 홈 사용처(경력/활동/학력 섹션)를 **모두 제거한다**(사용자 결정, 대체 없음). 홈은 해당 섹션이 사라지므로 `pages/home` 조립·테스트를 함께 수정한다. `experience`·`activities`·`education` 데이터가 고아가 되면 사용 여부를 확인해 정리한다(외과적 변경 원칙).

## 7. 구현 분해 (플랜 3단계)

각 단계는 자족적이며 `npm run ci` 통과가 완료 기준.

```
플랜 1  컬러 토큰 재정립
        palette 램프 교체 → 시맨틱(dark/light) 재매핑(+bg.critical 추가) → tokens.test 갱신 → 전역 재도색 검증
플랜 2  모션·재질 파운데이션 + Button 파일럿
        spring 이징·촉감 시맨틱 추가 · finish/shadow 헬퍼 · Button.css 재작성(criticalSolid→bg.critical 재매핑 포함, TDD)
플랜 3  나머지 프리미티브 확산 + Timeline 완전 제거
        Toggle·Segmented·Select 재설계 등 컴포넌트별. Timeline 삭제(컴포넌트 + 홈 섹션)
```

## 8. 성공 기준

- 팔레트·시맨틱(dark/light)이 컨트랙트를 빠짐없이 채우고 `tokens.test`·`type-check` 통과.
- Button 등 프리미티브가 스타일가이드 v2와 일치(색·마감·모션), reduced-motion에서 중화.
- 주요 화면(홈·블로그·어드민)이 새 토큰으로 대비 깨짐 없이 렌더.
- `npm run ci`(fsd·lint·type-check·test·build) 통과.

## 9. 리뷰 반영 결정

1. **`river`(파랑) 추가 = 확정** — informative용 슬레이트블루. §1.1.
2. **light=대낮 · dark=밤** — 같은 팔레트에서 dark는 명도만 낮춘 파생(새 색 안 만듦). §1.2.
3. **Timeline 전부 제거 = 확정** — 컴포넌트 + 페이지(홈 경력/활동/학력)까지, 대체 없음. §6.
4. **코덱스 리뷰 반영** — dark 텍스트 대비 AA 상향(muted #CDB891·brand #DE9A5E), `criticalSolid`용 `bg.critical` 추가(§1.4), 라이트 `bg.brand` 정합(#A64C34). 별건으로 리뷰가 짚은 `blog:import`(마이그레이션된 MDX 의존)는 이 스펙 범위 밖 → 사용자 판단.
