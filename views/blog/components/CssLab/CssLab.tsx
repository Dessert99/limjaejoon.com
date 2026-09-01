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

// CSS 안에서는 이 태그들만 마크다운이 만든 것이다. 나머지 태그는 syntax: "<angle>" 같은 값이 잘린 것
const MARKDOWN_TAG = /^(?:p|em|strong|code|a|br)$/;

/** 자식 트리에서 텍스트만 긁어모은다. CSS에 빈 줄이 있어 문단으로 쪼개져도 살아남는다. */
const textOf = (node: ReactNode): string => {
  if (typeof node === 'string') {
    return node;
  }

  if (Array.isArray(node)) {
    return (node as ReactNode[]).map(textOf).join('');
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    // <image>만은 HTML 파서가 img로 바꿔 버린다. CSS 안에 img가 나올 일은 이것뿐이다
    const tag = node.type === 'img' ? 'image' : node.type;

    // 마크다운이 만든 태그면 빈 줄에서 쪼갠 문단이다. 사라진 줄바꿈을 되돌린다
    const restored =
      typeof tag === 'string' && !MARKDOWN_TAG.test(tag) ? `<${tag}>` : '\n';

    return restored + textOf(node.props.children);
  }

  return '';
};

/** 마크다운이 넘긴 자식 중 태그 이름이 맞는 것만 고른다. */
const childrenOfType = (children: ReactNode, tag: string): LabChild[] => {
  return Children.toArray(children).filter((child): child is LabChild => {
    return isValidElement(child) && child.type === tag;
  });
};

/** 본문에 쓴 <css-lab>. 단계 라디오·무대·현재 단계 CSS를 함께 낸다. 전환은 CSS가 하고 JS는 안 돈다. */
export function CssLab({
  id,
  children,
}: {
  id?: string;
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
    JSON.stringify([id, steps, textOf(stage?.props.children)])
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

      {steps.map((step, index) => {
        return (
          <div
            key={index}
            data-step={index}
            className='css-lab-code border-t border-blog-border [&_pre]:rounded-none [&_pre]:whitespace-pre-wrap'
            dangerouslySetInnerHTML={{ __html: highlightCss(step.css) }}
          />
        );
      })}
    </div>
  );
}
