/** 정리 섹션 — transition 단축 속성 요약과 타이밍 프리셋 의미 (노션 학습 노트 재정리) */
import * as s from './TransitionReference.css';

// 세부 속성 4종 — 역할·기본값·예시. duration이 0이면 아무 변화도 안 보이는 게 흔한 함정
const SUB_PROPERTIES = [
  {
    name: 'transition-property',
    role: '어떤 CSS 속성에 전환을 적용할지 지정',
    initial: 'all',
    examples: 'opacity, transform, none',
  },
  {
    name: 'transition-duration',
    role: '시작부터 끝까지 걸리는 시간 — 0이면 전환이 보이지 않는다',
    initial: '0s',
    examples: '0.3s, 300ms',
  },
  {
    name: 'transition-timing-function',
    role: '시간에 따른 진행 속도 곡선 (가속·감속)',
    initial: 'ease',
    examples: 'linear, cubic-bezier(...), steps(...)',
  },
  {
    name: 'transition-delay',
    role: '시작 전 대기 시간',
    initial: '0s',
    examples: '0.1s',
  },
];

// 프리셋 키워드 5종 — 전부 cubic-bezier의 고정 좌표. 쓰임새 직관까지 함께 정리
const PRESET_MEANINGS = [
  {
    name: 'linear',
    curve: 'cubic-bezier(0, 0, 1, 1)',
    meaning:
      '처음부터 끝까지 같은 속도. 기계적인 느낌이라 진행률 표시처럼 시간 자체를 보여줄 때 어울린다.',
  },
  {
    name: 'ease',
    curve: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    meaning:
      '기본값. 빠르게 출발해 부드럽게 감속한다. 고민 없이 쓰기 좋은 범용 곡선.',
  },
  {
    name: 'ease-in',
    curve: 'cubic-bezier(0.42, 0, 1, 1)',
    meaning:
      '느리게 출발해 점점 가속. 끝에서 가장 빠르므로 화면 밖으로 사라지는 퇴장 연출에 어울린다.',
  },
  {
    name: 'ease-out',
    curve: 'cubic-bezier(0, 0, 0.58, 1)',
    meaning:
      '빠르게 출발해 점점 감속. 반응이 즉각적으로 느껴져 화면에 나타나는 진입 연출의 기본기.',
  },
  {
    name: 'ease-in-out',
    curve: 'cubic-bezier(0.42, 0, 0.58, 1)',
    meaning:
      '양 끝이 완만하고 중간이 빠르다. 화면 안에서 A→B로 이동·변형할 때 자연스럽다.',
  },
];

/** transition 단축 속성·프리셋 요약 — 플레이그라운드에서 만진 것을 문법으로 복습 */
export function TransitionReference() {
  return (
    <section
      aria-label='정리'
      className={s.root}>
      <h2 className={s.heading}>정리 — transition은 단축 속성이다</h2>
      <p className={s.paragraph}>
        위에서 조작한 네 가지는 각각 독립된 CSS 속성이고,{' '}
        <code className={s.code}>transition</code>은 이들을 한 줄로 묶는 단축
        속성(shorthand)이다.
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
            {'transition: opacity 0.3s ease-in 0.1s;\n'}
            {'/*          property duration timing delay */'}
          </code>
        </pre>
        <p className={s.paragraph}>
          단축 속성 안에 시간 값이 두 개 나오면 앞의 것이 duration, 뒤의 것이
          delay로 해석된다 — 순서를 바꾸면 의미가 달라진다. 반면 property와
          timing-function의 위치는 비교적 자유롭다.
        </p>
        <p className={s.paragraph}>
          쉼표로 나열하면 속성마다 다른 설정을 줄 수도 있다:{' '}
          <code className={s.code}>
            transition: opacity 0.3s ease, transform 0.5s ease-out 0.1s;
          </code>
        </p>
      </div>

      <div className={s.block}>
        <h3 className={s.subheading}>타이밍 프리셋, 결국 전부 곡선이다</h3>
        <div className={s.tableWrap}>
          <table
            aria-label='타이밍 프리셋'
            className={s.table}>
            <thead>
              <tr>
                <th className={s.th}>키워드</th>
                <th className={s.th}>동일한 곡선</th>
                <th className={s.th}>의미와 쓰임새</th>
              </tr>
            </thead>
            <tbody>
              {PRESET_MEANINGS.map((preset) => {
                return (
                  <tr key={preset.name}>
                    <td className={s.td}>
                      <code className={s.code}>{preset.name}</code>
                    </td>
                    <td className={s.td}>
                      <code className={s.code}>{preset.curve}</code>
                    </td>
                    <td className={s.td}>{preset.meaning}</td>
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
