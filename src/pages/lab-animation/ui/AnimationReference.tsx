/** 정리 섹션 — animation 단축 속성 요약과 transition 대비 (플레이그라운드 복습) */
import * as s from './AnimationReference.css';

// 세부 속성 8종 — 역할·기본값·예시. name이 없으면 아무것도 재생되지 않는 게 흔한 함정
const SUB_PROPERTIES = [
  {
    name: 'animation-name',
    role: '재생할 @keyframes 이름 — 없으면 아무 일도 일어나지 않는다',
    initial: 'none',
    examples: 'slide, bounce',
  },
  {
    name: 'animation-duration',
    role: '한 사이클이 걸리는 시간',
    initial: '0s',
    examples: '1.2s, 1200ms',
  },
  {
    name: 'animation-timing-function',
    role: '속도 곡선 — 전체가 아니라 키프레임 구간마다 적용',
    initial: 'ease',
    examples: 'linear, steps(4)',
  },
  {
    name: 'animation-delay',
    role: '시작 전 대기 시간',
    initial: '0s',
    examples: '0.5s',
  },
  {
    name: 'animation-iteration-count',
    role: '반복 횟수 — 소수면 중간에 끊긴다',
    initial: '1',
    examples: '3, 1.5, infinite',
  },
  {
    name: 'animation-direction',
    role: '재생 방향 — alternate는 짝수 회차를 거꾸로',
    initial: 'normal',
    examples: 'reverse, alternate',
  },
  {
    name: 'animation-fill-mode',
    role: '재생 밖 시간(대기 중·종료 후)의 모습',
    initial: 'none',
    examples: 'forwards, both',
  },
  {
    name: 'animation-play-state',
    role: '재생/일시정지 — 멈춘 지점에서 이어진다',
    initial: 'running',
    examples: 'paused',
  },
];

// transition과의 차이 — 같은 보간 엔진이지만 재생 모델이 다르다
const COMPARISONS = [
  {
    aspect: '시작 계기',
    transition: '속성값이 바뀌는 순간에만 (hover, 클래스 토글 등)',
    animation: '적용되는 순간 스스로 재생 — 트리거가 필요 없다',
  },
  {
    aspect: '장면 수',
    transition: '시작·끝 두 장면의 보간',
    animation: '@keyframes로 다단계 장면 구성',
  },
  {
    aspect: '반복',
    transition: '한 번뿐',
    animation: 'iteration-count로 유한·무한 반복',
  },
  {
    aspect: '끝난 뒤',
    transition: '바뀐 속성값이 곧 결과 — 되돌아갈 일이 없다',
    animation: '기본값은 원래 모습으로 복귀 — fill-mode로 제어',
  },
  {
    aspect: '일시정지',
    transition: '불가',
    animation: 'play-state로 가능',
  },
];

/** animation 단축 속성·transition 대비 요약 — 플레이그라운드에서 만진 것을 문법으로 복습 */
export function AnimationReference() {
  return (
    <section
      aria-label='정리'
      className={s.root}>
      <h2 className={s.heading}>정리 — animation도 단축 속성이다</h2>
      <p className={s.paragraph}>
        위에서 조작한 값들은 각각 독립된 CSS 속성이고,{' '}
        <code className={s.code}>animation</code>은 이들을 한 줄로 묶는 단축
        속성(shorthand)이다. 장면은 <code className={s.code}>@keyframes</code>
        가, 재생 방식은 <code className={s.code}>animation-*</code>이 맡는다.
      </p>

      <div className={s.block}>
        <h3 className={s.subheading}>세부 속성 정리</h3>
        <div className={s.tableWrap}>
          <table
            aria-label='세부 속성 정리'
            className={s.table}>
            <thead>
              <tr>
                <th className={s.th}>속성</th>
                <th className={s.th}>역할</th>
                <th className={s.th}>기본값</th>
                <th className={s.th}>예시 값</th>
              </tr>
            </thead>
            <tbody>
              {SUB_PROPERTIES.map((property) => {
                return (
                  <tr key={property.name}>
                    <td className={s.td}>
                      <code className={s.code}>{property.name}</code>
                    </td>
                    <td className={s.td}>{property.role}</td>
                    <td className={s.td}>
                      <code className={s.code}>{property.initial}</code>
                    </td>
                    <td className={s.td}>
                      <code className={s.code}>{property.examples}</code>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className={s.block}>
        <h3 className={s.subheading}>기본 문법</h3>
        <pre className={s.codeBlock}>
          <code>
            {'animation: slide 1.2s ease 0.5s infinite alternate both running;\n'}
            {'/*         name duration timing delay count direction fill play-state */'}
          </code>
        </pre>
        <p className={s.paragraph}>
          transition처럼 시간 값 두 개 중 앞이 duration, 뒤가 delay다. 그리고
          name이 <code className={s.code}>none</code>·
          <code className={s.code}>forwards</code>처럼 다른 값의 키워드와
          겹치면 그 키워드로 먼저 해석된다 — 키프레임 이름은 키워드를 피해서
          짓는다.
        </p>
      </div>

      <div className={s.block}>
        <h3 className={s.subheading}>transition과 무엇이 다른가</h3>
        <div className={s.tableWrap}>
          <table
            aria-label='transition과 비교'
            className={s.table}>
            <thead>
              <tr>
                <th className={s.th}>관점</th>
                <th className={s.th}>transition</th>
                <th className={s.th}>animation</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISONS.map((row) => {
                return (
                  <tr key={row.aspect}>
                    <td className={s.td}>{row.aspect}</td>
                    <td className={s.td}>{row.transition}</td>
                    <td className={s.td}>{row.animation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
