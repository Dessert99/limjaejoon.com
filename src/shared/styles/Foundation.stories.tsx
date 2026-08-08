/** 토큰 전시 — 값을 마크업에 복사하지 않고 로드된 스타일시트에서 이름·선언값을 훑어 var() 로 참조한다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect, useRef, useState } from 'react';

/** 이름과 "선언된 그대로"의 값 — semantic 이 어떤 primitive 를 가리키는지가 여기 남는다 */
type Token = { name: string; value: string };

// 트랙 안에서 움직이는 표본의 크기 — transform 계산과 마크업이 같은 값을 봐야 한다
const SAMPLE_SIZE = '1.5rem';

/** 중첩 규칙(@layer·@media)까지 내려가며 스타일 규칙만 방문한다 */
const walkStyleRules = (
  rules: CSSRuleList,
  visit: (rule: CSSStyleRule) => void
): void => {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule) {
      visit(rule);
    } else if ('cssRules' in rule) {
      walkStyleRules((rule as CSSGroupingRule).cssRules, visit);
    }
  }
};

/** CSSOM 에서 직접 읽는다 — getComputedStyle 은 var() 를 이미 풀어버려 매핑이 사라진다 */
const readTokens = (selectorPart: string, prefix: string): Token[] => {
  const found = new Map<string, string>();

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      // 다른 오리진 스타일시트는 접근이 막힌다 — 우리 토큰은 어차피 거기 없다
      continue;
    }

    walkStyleRules(rules, (rule) => {
      if (!rule.selectorText.includes(selectorPart)) {
        return;
      }
      for (const name of Array.from(rule.style)) {
        // --text-hero--line-height 같은 수식 키는 기본 토큰이 아니다
        if (name.startsWith(prefix) && !name.slice(2).includes('--')) {
          found.set(name, rule.style.getPropertyValue(name).trim());
        }
      }
    });
  }

  return Array.from(found, ([name, value]) => {
    return { name, value };
  });
};

/** 실제로 계산된 값 — clamp 토큰은 폭에, 색 토큰은 data-surface 에 따라 달라져 한 번 읽으면 거짓말이 된다 */
const useComputed = <T extends HTMLElement>(property: string) => {
  const ref = useRef<T>(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    const read = (): void => {
      if (ref.current) {
        setValue(getComputedStyle(ref.current).getPropertyValue(property));
      }
    };

    read();
    window.addEventListener('resize', read);
    // 툴바의 surface 토글은 리사이즈 없이 속성만 바꾼다 — 안 보면 표시값이 이전 상태에 머문다
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-surface'],
    });

    return () => {
      window.removeEventListener('resize', read);
      observer.disconnect();
    };
  }, [property]);

  return [ref, value] as const;
};

function Declared({ value }: { value: string }) {
  return <code className='text-body-sm text-muted-foreground'>{value}</code>;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className='border-b border-border py-10'>
      <h2 className='mb-6 text-label text-muted-foreground uppercase'>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-svh bg-background text-foreground'>
      <div className='mx-auto max-w-content px-gutter py-10'>{children}</div>
    </div>
  );
}

/** 같은 var() 를 두 문맥에서 동시에 칠해 섹션 반전이 실제로 도는지 눈으로 확인한다 */
function ColorRow({ token }: { token: Token }) {
  const [rootRef, rootValue] = useComputed<HTMLDivElement>('background-color');
  const [lightRef, lightValue] =
    useComputed<HTMLDivElement>('background-color');

  return (
    <tr className='border-t border-border'>
      <td className='py-2 pr-4 text-body-sm font-medium'>{token.name}</td>
      <td className='py-2 pr-4'>
        <Declared value={token.value} />
      </td>
      <td className='py-2 pr-4'>
        <div className='flex items-center gap-2'>
          <div
            ref={rootRef}
            className='size-8 rounded-sm border border-input'
            style={{ backgroundColor: `var(${token.name})` }}
          />
          <code className='text-body-sm text-muted-foreground'>
            {rootValue}
          </code>
        </div>
      </td>
      <td
        className='py-2'
        data-surface='light'>
        <div className='flex items-center gap-2'>
          <div
            ref={lightRef}
            className='size-8 rounded-sm border border-input'
            style={{ backgroundColor: `var(${token.name})` }}
          />
          <code className='text-body-sm text-muted-foreground'>
            {lightValue}
          </code>
        </div>
      </td>
    </tr>
  );
}

function Ramp({ prefix }: { prefix: string }) {
  const tokens = readTokens(':root', prefix);

  return (
    <div className='flex flex-wrap gap-2'>
      {tokens.map((token) => {
        return (
          <div
            key={token.name}
            className='w-24'>
            <div
              className='h-14 rounded-sm border border-border'
              style={{ backgroundColor: `var(${token.name})` }}
            />
            <p className='mt-1 text-body-sm break-all text-muted-foreground'>
              {token.name.replace(prefix, '')}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/** 같은 클래스가 문맥만 바꿔 뒤집히는지 — 컴포넌트가 자기 밝기를 몰라도 되는 게 이 설계의 목표다 */
function SurfaceCard({ label }: { label: string }) {
  return (
    <div className='rounded-lg border border-border bg-card p-6 text-foreground'>
      <p className='text-label text-muted-foreground uppercase'>{label}</p>
      <p className='mt-2 text-statement'>같은 클래스, 다른 문맥</p>
      <p className='mt-2 text-body text-muted-foreground'>
        bg-card text-foreground 만 쓴다.
      </p>
      <button
        type='button'
        className='mt-4 rounded-sm bg-primary px-4 py-2 text-primary-foreground transition duration-quick ease-standard hover:bg-primary/90'>
        primary
      </button>
    </div>
  );
}

function TypeRow({ token }: { token: Token }) {
  const [ref, size] = useComputed<HTMLParagraphElement>('font-size');

  return (
    <div className='border-t border-border py-4'>
      <div className='flex gap-3 text-body-sm text-muted-foreground'>
        <span className='font-medium text-foreground'>
          {token.name.replace('--text-', '')}
        </span>
        <Declared value={token.value} />
        <span>→ {size}</span>
      </div>
      <p
        ref={ref}
        className='mt-2 break-keep'
        style={{
          fontSize: `var(${token.name})`,
          lineHeight: `var(${token.name}--line-height, normal)`,
          letterSpacing: `var(${token.name}--letter-spacing, normal)`,
        }}>
        임재준 프론트엔드 Handcrafted 0123
      </p>
    </div>
  );
}

function SpacingRow({ token }: { token: Token }) {
  const [ref, width] = useComputed<HTMLDivElement>('width');

  return (
    <div className='flex items-center gap-4 border-t border-border py-2'>
      <span className='w-40 shrink-0 text-body-sm'>{token.name}</span>
      <code className='w-24 shrink-0 text-body-sm text-muted-foreground'>
        {width}
      </code>
      <div
        ref={ref}
        className='h-4 rounded-sm bg-primary'
        style={{ width: `var(${token.name})` }}
      />
    </div>
  );
}

function ValueRow({ token }: { token: Token }) {
  return (
    <div className='flex items-center gap-4 border-t border-border py-2'>
      <span className='w-48 shrink-0 text-body-sm'>{token.name}</span>
      <Declared value={token.value} />
    </div>
  );
}

/** 퍼센트 transform 은 제 몸 기준이라, 트랙 폭만 한 래퍼를 옮겨야 표본이 트랙을 가로지른다 */
function MotionTrack({
  moved,
  easing,
  duration,
}: {
  moved: boolean;
  easing: string;
  duration: string;
}) {
  return (
    <div className='mt-2 overflow-hidden rounded-sm bg-card'>
      <div
        className='w-full transition-transform'
        style={{
          transitionTimingFunction: easing,
          transitionDuration: duration,
          transform: moved
            ? `translateX(calc(100% - ${SAMPLE_SIZE}))`
            : 'translateX(0)',
        }}>
        <div
          className='rounded-sm bg-primary'
          style={{ width: SAMPLE_SIZE, height: SAMPLE_SIZE }}
        />
      </div>
    </div>
  );
}

/** 상태를 쥐는 전시라 별도 컴포넌트로 분리한다 — 훅은 컴포넌트 안에서만 산다 */
function MotionTokens() {
  const eases = readTokens(':root', '--ease-');
  const durations = readTokens(':root', '--ds-duration-');
  const [moved, setMoved] = useState(false);

  return (
    <Page>
      <Section title='재생'>
        <button
          type='button'
          onClick={() => {
            setMoved((previous) => {
              return !previous;
            });
          }}
          className='rounded-sm bg-primary px-4 py-2 text-primary-foreground transition duration-quick ease-standard hover:bg-primary/90'>
          {moved ? '되돌리기' : '이동'}
        </button>
        <p className='mt-2 text-body-sm text-muted-foreground'>
          툴바의 Motion 을 Reduced 로 바꾸면 전부 즉시 도착해야 한다.
        </p>
      </Section>

      <Section title='ease — duration 은 800ms 로 고정'>
        {eases.map((token) => {
          return (
            <div
              key={token.name}
              className='border-t border-border py-3'>
              <span className='mr-3 text-body-sm'>
                {token.name.replace('--ease-', '')}
              </span>
              <Declared value={token.value} />
              <MotionTrack
                moved={moved}
                easing={`var(${token.name})`}
                duration='var(--ds-duration-800)'
              />
            </div>
          );
        })}
      </Section>

      <Section title='duration — ease 는 standard 로 고정'>
        {durations.map((token) => {
          return (
            <div
              key={token.name}
              className='border-t border-border py-3'>
              <span className='mr-3 text-body-sm'>
                {token.name.replace('--ds-duration-', '')}
              </span>
              <Declared value={token.value} />
              <MotionTrack
                moved={moved}
                easing='var(--ease-standard)'
                duration={`var(${token.name})`}
              />
            </div>
          );
        })}
      </Section>
    </Page>
  );
}

const meta = {
  title: 'Foundation/Tokens',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  // 루트를 dark 로 고정한다 — 툴바가 light 면 두 칸이 모두 light 가 되어 반전 비교가 무의미해진다
  globals: { surface: 'dark' },
  render: () => {
    const semantic = readTokens(':root', '--color-');

    return (
      <Page>
        <Section title='semantic — dark 기본과 light 반전'>
          <table className='w-full text-left'>
            <thead>
              <tr className='text-label text-muted-foreground uppercase'>
                <th className='pb-2 font-normal'>token</th>
                <th className='pb-2 font-normal'>declared</th>
                <th className='pb-2 font-normal'>:root (dark)</th>
                <th className='pb-2 font-normal'>data-surface=light</th>
              </tr>
            </thead>
            <tbody>
              {semantic.map((token) => {
                return (
                  <ColorRow
                    key={token.name}
                    token={token}
                  />
                );
              })}
            </tbody>
          </table>
        </Section>

        <Section title='섹션 반전 확인'>
          <div className='grid gap-grid-gap md:grid-cols-2'>
            <SurfaceCard label='기본 (dark)' />
            <div data-surface='light'>
              <SurfaceCard label='data-surface=light' />
            </div>
          </div>
        </Section>

        <Section title='primitive — neutral'>
          <Ramp prefix='--ds-neutral-' />
        </Section>

        <Section title='primitive — accent'>
          <Ramp prefix='--ds-accent-' />
        </Section>

        <Section title='primitive — danger'>
          <Ramp prefix='--ds-danger-' />
        </Section>
      </Page>
    );
  },
};

export const Typography: Story = {
  render: () => {
    const scale = readTokens(':root', '--text-');

    return (
      <Page>
        <Section title='scale — statement 이상은 clamp, 뷰포트를 바꾸면 → 값이 따라 움직인다'>
          {scale.map((token) => {
            return (
              <TypeRow
                key={token.name}
                token={token}
              />
            );
          })}
        </Section>

        <Section title='family'>
          <p className='font-body text-body-lg'>
            font-body — 임재준 Frontend Engineer
          </p>
          <p className='mt-2 font-display text-statement'>
            font-display — 임재준 Frontend Engineer
          </p>
        </Section>
      </Page>
    );
  },
};

export const Layout: Story = {
  render: () => {
    const spacing = readTokens(':root', '--spacing-');
    const container = readTokens(':root', '--container-');
    const breakpoint = readTokens(':root', '--breakpoint-');
    const radius = readTokens(':root', '--ds-radius-');

    return (
      <Page>
        <Section title='spacing — 전부 clamp, 뷰포트를 바꾸면 폭이 움직인다'>
          {spacing.map((token) => {
            return (
              <SpacingRow
                key={token.name}
                token={token}
              />
            );
          })}
        </Section>

        <Section title='container'>
          {container.map((token) => {
            return (
              <ValueRow
                key={token.name}
                token={token}
              />
            );
          })}
        </Section>

        <Section title='breakpoint'>
          {breakpoint.map((token) => {
            return (
              <ValueRow
                key={token.name}
                token={token}
              />
            );
          })}
        </Section>

        <Section title='radius'>
          <div className='flex flex-wrap gap-4'>
            {radius.map((token) => {
              return (
                <div
                  key={token.name}
                  className='w-28'>
                  <div
                    className='h-16 border border-input bg-secondary'
                    style={{ borderRadius: `var(${token.name})` }}
                  />
                  <p className='mt-1 text-body-sm text-muted-foreground'>
                    {token.name.replace('--ds-radius-', '')} {token.value}
                  </p>
                </div>
              );
            })}
          </div>
        </Section>
      </Page>
    );
  },
};

export const Motion: Story = {
  render: () => {
    return <MotionTokens />;
  },
};

export const Layers: Story = {
  render: () => {
    const layers = readTokens(':root', '--ds-z-');

    return (
      <Page>
        <Section title='z — semantic 승격을 하지 않는 유일한 계층'>
          {layers.map((token) => {
            return (
              <ValueRow
                key={token.name}
                token={token}
              />
            );
          })}
        </Section>
      </Page>
    );
  },
};
