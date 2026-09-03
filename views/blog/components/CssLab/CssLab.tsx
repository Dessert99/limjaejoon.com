import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  buildCssLabStyle,
  cssLabId,
  type CssLabStep,
} from '../../lib/buildCssLabStyle';
import { highlightCss } from '../../lib/markdownPlugins';

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
