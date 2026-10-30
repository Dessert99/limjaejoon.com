import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { highlightCss } from '@/domains/posts/lib/markdownPlugins';

/** css-lab의 한 단계. 그 단계에서 새로 얹는 CSS만 담는다. */
type CssLabStep = {
  label: string;
  css: string;
};

// 단계는 누적된다. i단계 CSS는 i번 이후 라디오가 켜져 있는 동안 살아 있어야 한다
const stageWhileChecked = (
  labId: string,
  index: number,
  total: number
): string => {
  const checked = Array.from({ length: total - index }, (_, offset) => {
    return `#${labId}-${index + offset}:checked`;
  });

  return `#${labId}:has(${checked.join(', ')}) .css-lab-stage`;
};

/** 한 글에 데모가 여럿이어도 라디오 name과 선택자가 안 겹치도록 내용에서 id를 짓는다. */
const cssLabId = (seed: string): string => {
  // 서버와 브라우저가 같은 값을 내야 해서 난수·카운터를 못 쓴다. FNV-1a로 내용을 접는다
  let folded = 0x811c9dc5;

  for (let at = 0; at < seed.length; at += 1) {
    folded = Math.imul(folded ^ seed.charCodeAt(at), 0x01000193);
  }

  return `css-lab-${(folded >>> 0).toString(36)}`;
};

/** 무대에 얹을 단계별 CSS와 코드 패널 전환 규칙을 한 덩이 스타일시트로 만든다. */
const buildCssLabStyle = (labId: string, steps: CssLabStep[]): string => {
  // prose.css가 본문에서 건드리는 태그. 여기 빠진 태그는 무대 안까지 블로그 서체가 따라 들어온다
  const proseTags =
    'a, ul, ol, li, img, table, th, td, code, pre, blockquote, hr, h2, h3, strong';

  return [
    // .prose-post a와 같은 (0,1,1)로 맞춰 문서 순서로 이기고, 뒤에 오는 작성자 CSS에는 진다
    `.css-lab-stage :is(${proseTags}) { all: revert; }`,
    ...steps.map((step, index) => {
      const stage = stageWhileChecked(labId, index, steps.length);

      // @keyframes·@property도 @scope 안에서 그대로 산다. 다만 이름은 문서 전역이다
      return `@scope (${stage}) {\n${step.css}\n}`;
    }),
    `#${labId} .css-lab-code { display: none; }`,
    ...Array.from({ length: steps.length }, (_, index) => {
      const code = `.css-lab-code[data-step='${index}']`;

      return `#${labId}:has(#${labId}-${index}:checked) ${code} { display: block; }`;
    }),
    // 코드가 넘쳐야 스크롤 타임라인이 산다. 짧으면 애니메이션째로 죽어서 마스크도 안 걸리라고 키프레임 안에 넣었다
    `@supports (animation-timeline: scroll()) {
  #${labId} .css-lab-code pre {
    animation: ${labId}-fade linear both;
    animation-timeline: scroll(self);
  }

  /* 2rem을 키우면 잘린 쪽이 더 길게 흐려지고, 줄이면 칼로 자른 듯 끊긴다. 마스크를 2rem 밀어둬 시작은 아래만, 끝은 위만 흐려진다 */
  @keyframes ${labId}-fade {
    from { mask: linear-gradient(transparent, #000 2rem, #000 calc(100% - 2rem), transparent) 0 -2rem / 100% calc(100% + 2rem) no-repeat; }
    to { mask: linear-gradient(transparent, #000 2rem, #000 calc(100% - 2rem), transparent) 0 0 / 100% calc(100% + 2rem) no-repeat; }
  }
}`,
  ].join('\n');
};

type LabChild = ReactElement<{ label?: string; children?: ReactNode }>;

/** 자식 트리에서 CSS 원문을 되돌린다. remarkCssLab 덕에 여기 오는 태그는 잘린 CSS 값뿐이다. */
const textOf = (node: ReactNode): string => {
  if (typeof node === 'string') {
    return node;
  }

  if (Array.isArray(node)) {
    return (node as ReactNode[]).map(textOf).join('');
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    // syntax: "<angle>" 같은 값을 HTML 파서가 태그로 읽는다. <image>만은 img로 개명까지 한다
    const tag = node.type === 'img' ? 'image' : node.type;

    return (
      (typeof tag === 'string' ? `<${tag}>` : '') + textOf(node.props.children)
    );
  }

  return '';
};

/** 마크다운이 넘긴 자식 중 태그 이름이 맞는 것만 고른다. */
const childrenOfType = (children: ReactNode, tag: string): LabChild[] => {
  return Children.toArray(children).filter((child): child is LabChild => {
    return isValidElement(child) && child.type === tag;
  });
};

/** 본문에 쓴 <css-lab>. 단계 라디오·무대·현재 단계 CSS(code="off"면 생략)를 낸다. 전환은 CSS가 하고 JS는 안 돈다. */
export function CssLab({
  id,
  code,
  children,
}: {
  id?: string;
  code?: string;
  children?: ReactNode;
}) {
  const stage = childrenOfType(children, 'css-html')[0];
  const steps: CssLabStep[] = childrenOfType(children, 'css-step').map(
    (step) => {
      return {
        label: step.props.label ?? '',
        css: textOf(step.props.children).trim(),
      };
    }
  );

  if (steps.length === 0) {
    return null;
  }

  // id는 거들 뿐이다. 안 적어도, 겹쳐 적어도 내용이 다르면 다른 id가 나온다
  const labId = cssLabId(
    JSON.stringify([id, code, steps, textOf(stage?.props.children)])
  );

  return (
    <div
      id={labId}
      className='overflow-hidden rounded-lg border border-blog-border'>
      <style
        dangerouslySetInnerHTML={{ __html: buildCssLabStyle(labId, steps) }}
      />

      <div className='flex flex-wrap gap-1 border-b border-blog-border bg-blog-muted p-2'>
        {steps.map((step, index) => {
          return (
            <label
              key={index}
              className='cursor-pointer rounded-md px-3 py-1.5 text-sm text-blog-muted-foreground transition-colors has-[:checked]:bg-blog-background has-[:checked]:text-blog-foreground has-[:focus-visible]:outline-2'>
              <input
                type='radio'
                name={labId}
                id={`${labId}-${index}`}
                defaultChecked={index === 0}
                className='sr-only'
              />
              {step.label || `${index + 1}단계`}
            </label>
          );
        })}
      </div>

      {/* min-h를 키우면 단계를 오갈 때 무대 높이가 덜 출렁인다 */}
      <div className='css-lab-stage flex min-h-48 flex-wrap items-center justify-center gap-4 p-8'>
        {stage?.props.children}
      </div>

      {code !== 'off' &&
        steps.map((step, index) => {
          return (
            <div
              key={index}
              data-step={index}
              // pre의 h를 키우면 한 번에 보이는 코드 줄이 늘고, 줄이면 단계를 오갈 때 패널이 덜 출렁인다
              // 스크롤 쪽 끝을 마스크로 지우면 이 검정이 비쳐, 아직 볼 코드가 남았다고 알린다
              className='css-lab-code border-t border-blog-border bg-blog-overlay [&_pre]:h-64 [&_pre]:overflow-y-auto [&_pre]:rounded-none [&_pre]:whitespace-pre-wrap'
              dangerouslySetInnerHTML={{ __html: highlightCss(step.css) }}
            />
          );
        })}
    </div>
  );
}
