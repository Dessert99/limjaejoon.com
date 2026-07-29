/** 토큰 전시 — 값을 마크업에 복사하지 않고 로드된 스타일시트에서 이름을 훑어 var() 로 참조한다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect, useMemo, useRef, useState } from 'react';

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

/** 셀렉터에 걸린 커스텀 프로퍼티 이름 수집 — 토큰 목록의 출처를 CSS 한 곳으로 유지하는 장치 */
const readTokenNames = (selectorPart: string, prefix: string): string[] => {
  const names = new Set<string>();

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
          names.add(name);
        }
      }
    });
  }

  return Array.from(names);
};

/** 뷰포트가 바뀌면 다시 읽는다 — clamp() 토큰은 폭에 따라 값이 달라져 한 번 읽으면 거짓말이 된다 */
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
    return () => {
      window.removeEventListener('resize', read);
    };
  }, [property]);

  return [ref, value] as const;
};

/** :root 에 선언된 값 그대로 — semantic 이 어떤 primitive 를 가리키는지 드러난다 */
function DeclaredValue({ name }: { name: string }) {
  // 선언값은 폭과 무관해 마운트 후 다시 읽을 이유가 없다 — 렌더 중 한 번 읽는다
  const value = useMemo(() => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }, [name]);

  return <code className='text-body-sm text-subtle'>{value}</code>;
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
      <h2 className='mb-6 text-label text-subtle uppercase'>{title}</h2>
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
function ColorRow({ name }: { name: string }) {
  const [darkRef, darkValue] = useComputed<HTMLDivElement>('background-color');
  const [lightRef, lightValue] =
    useComputed<HTMLDivElement>('background-color');

  return (
    <tr className='border-t border-border'>
      <td className='py-2 pr-4 text-body-sm font-medium'>{name}</td>
      <td className='py-2 pr-4'>
        <DeclaredValue name={name} />
      </td>
      <td className='py-2 pr-4'>
        <div className='flex items-center gap-2'>
          <div
            ref={darkRef}
            className='size-8 rounded-sm border border-border-strong'
            style={{ backgroundColor: `var(${name})` }}
          />
          <code className='text-body-sm text-subtle'>{darkValue}</code>
        </div>
      </td>
      <td
        className='py-2'
        data-surface='light'>
        <div className='flex items-center gap-2'>
          <div
            ref={lightRef}
            className='size-8 rounded-sm border border-border-strong'
            style={{ backgroundColor: `var(${name})` }}
          />
          <code className='text-body-sm text-subtle'>{lightValue}</code>
        </div>
      </td>
    </tr>
  );
}

function Ramp({ prefix }: { prefix: string }) {
  const names = useMemo(() => {
    return readTokenNames(':root', prefix);
  }, [prefix]);

  return (
    <div className='flex flex-wrap gap-2'>
      {names.map((name) => {
        return (
          <div
            key={name}
            className='w-24'>
            <div
              className='h-14 rounded-sm border border-border'
              style={{ backgroundColor: `var(${name})` }}
            />
            <p className='mt-1 text-body-sm break-all text-subtle'>
              {name.replace(prefix, '')}
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
    <div className='rounded-lg border border-border bg-surface p-6 text-foreground'>
      <p className='text-label text-subtle uppercase'>{label}</p>
      <p className='mt-2 text-statement'>같은 클래스, 다른 문맥</p>
      <p className='mt-2 text-body text-muted'>
        bg-surface text-foreground 만 쓴다.
      </p>
      <button
        type='button'
        className='mt-4 rounded-sm bg-accent px-4 py-2 text-accent-foreground transition duration-quick ease-standard hover:bg-accent-hover'>
        accent
      </button>
    </div>
  );
}

function TypeRow({ name }: { name: string }) {
  const [ref, size] = useComputed<HTMLParagraphElement>('font-size');

  return (
    <div className='border-t border-border py-4'>
      <div className='flex gap-3 text-body-sm text-subtle'>
        <span className='font-medium text-foreground'>
          {name.replace('--text-', '')}
        </span>
        <DeclaredValue name={name} />
        <span>→ {size}</span>
      </div>
      <p
        ref={ref}
        className='mt-2 break-keep'
        style={{
          fontSize: `var(${name})`,
          lineHeight: `var(${name}--line-height, normal)`,
          letterSpacing: `var(${name}--letter-spacing, normal)`,
        }}>
        임재준 프론트엔드 Handcrafted 0123
      </p>
    </div>
  );
}

function SpacingRow({ name }: { name: string }) {
  const [ref, width] = useComputed<HTMLDivElement>('width');

  return (
    <div className='flex items-center gap-4 border-t border-border py-2'>
      <span className='w-40 shrink-0 text-body-sm'>{name}</span>
      <code className='w-24 shrink-0 text-body-sm text-subtle'>{width}</code>
      <div
        ref={ref}
        className='h-4 rounded-sm bg-accent'
        style={{ width: `var(${name})` }}
      />
    </div>
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
  render: () => {
    const semantic = readTokenNames(':root', '--color-');

    return (
      <Page>
        <Section title='semantic — dark 기본과 light 반전'>
          <table className='w-full text-left'>
            <thead>
              <tr className='text-label text-subtle uppercase'>
                <th className='pb-2 font-normal'>token</th>
                <th className='pb-2 font-normal'>declared</th>
                <th className='pb-2 font-normal'>:root (dark)</th>
                <th className='pb-2 font-normal'>data-surface=light</th>
              </tr>
            </thead>
            <tbody>
              {semantic.map((name) => {
                return (
                  <ColorRow
                    key={name}
                    name={name}
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
      </Page>
    );
  },
};

export const Typography: Story = {
  render: () => {
    const scale = readTokenNames(':root', '--text-');

    return (
      <Page>
        <Section title='scale — statement 이상은 clamp, 뷰포트를 바꾸면 → 값이 따라 움직인다'>
          {scale.map((name) => {
            return (
              <TypeRow
                key={name}
                name={name}
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
    const spacing = readTokenNames(':root', '--spacing-');
    const container = readTokenNames(':root', '--container-');
    const breakpoint = readTokenNames(':root', '--breakpoint-');
    const radius = readTokenNames(':root', '--ds-radius-');

    return (
      <Page>
        <Section title='spacing — 전부 clamp, 뷰포트를 바꾸면 폭이 움직인다'>
          {spacing.map((name) => {
            return (
              <SpacingRow
                key={name}
                name={name}
              />
            );
          })}
        </Section>

        <Section title='container'>
          {container.map((name) => {
            return (
              <div
                key={name}
                className='flex items-center gap-4 border-t border-border py-2'>
                <span className='w-40 shrink-0 text-body-sm'>{name}</span>
                <DeclaredValue name={name} />
              </div>
            );
          })}
        </Section>

        <Section title='breakpoint'>
          {breakpoint.map((name) => {
            return (
              <div
                key={name}
                className='flex items-center gap-4 border-t border-border py-2'>
                <span className='w-40 shrink-0 text-body-sm'>{name}</span>
                <DeclaredValue name={name} />
              </div>
            );
          })}
        </Section>

        <Section title='radius'>
          <div className='flex flex-wrap gap-4'>
            {radius.map((name) => {
              return (
                <div
                  key={name}
                  className='w-28'>
                  <div
                    className='h-16 border border-border-strong bg-surface-raised'
                    style={{ borderRadius: `var(${name})` }}
                  />
                  <p className='mt-1 text-body-sm text-subtle'>
                    {name.replace('--ds-radius-', '')}
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

/** 상태를 쥐는 전시라 별도 컴포넌트로 분리한다 — 훅은 컴포넌트 안에서만 산다 */
function MotionTokens() {
  const eases = readTokenNames(':root', '--ease-');
  const durations = readTokenNames(':root', '--ds-duration-');
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
          className='rounded-sm bg-accent px-4 py-2 text-accent-foreground transition duration-quick ease-standard hover:bg-accent-hover'>
          {moved ? '되돌리기' : '이동'}
        </button>
        <p className='mt-2 text-body-sm text-subtle'>
          툴바의 Motion 을 Reduced 로 바꾸면 전부 즉시 도착해야 한다.
        </p>
      </Section>

      <Section title='ease — duration 은 800ms 로 고정'>
        {eases.map((name) => {
          return (
            <div
              key={name}
              className='border-t border-border py-3'>
              <span className='text-body-sm'>
                {name.replace('--ease-', '')}
              </span>
              <div className='mt-2 h-6 rounded-sm bg-surface'>
                <div
                  className='size-6 rounded-sm bg-accent transition-transform'
                  style={{
                    transitionTimingFunction: `var(${name})`,
                    transitionDuration: 'var(--ds-duration-800)',
                    transform: moved ? 'translateX(90%)' : 'translateX(0)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </Section>

      <Section title='duration — ease 는 standard 로 고정'>
        {durations.map((name) => {
          return (
            <div
              key={name}
              className='border-t border-border py-3'>
              <span className='text-body-sm'>
                {name.replace('--ds-duration-', '')}ms
              </span>
              <div className='mt-2 h-6 rounded-sm bg-surface'>
                <div
                  className='size-6 rounded-sm bg-accent transition-transform'
                  style={{
                    transitionTimingFunction: 'var(--ease-standard)',
                    transitionDuration: `var(${name})`,
                    transform: moved ? 'translateX(90%)' : 'translateX(0)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </Section>
    </Page>
  );
}

export const Motion: Story = {
  render: () => {
    return <MotionTokens />;
  },
};

export const Layers: Story = {
  render: () => {
    const layers = readTokenNames(':root', '--ds-z-');

    return (
      <Page>
        <Section title='z — semantic 승격을 하지 않는 유일한 계층'>
          {layers.map((name) => {
            return (
              <div
                key={name}
                className='flex items-center gap-4 border-t border-border py-2'>
                <span className='w-48 shrink-0 text-body-sm'>{name}</span>
                <DeclaredValue name={name} />
              </div>
            );
          })}
        </Section>
      </Page>
    );
  },
};
