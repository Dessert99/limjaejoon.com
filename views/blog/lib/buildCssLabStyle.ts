/** css-lab의 한 단계. 그 단계에서 새로 얹는 CSS만 담는다. */
export type CssLabStep = {
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
export const cssLabId = (seed: string): string => {
  // 서버와 브라우저가 같은 값을 내야 해서 난수·카운터를 못 쓴다. FNV-1a로 내용을 접는다
  let folded = 0x811c9dc5;

  for (let at = 0; at < seed.length; at += 1) {
    folded = Math.imul(folded ^ seed.charCodeAt(at), 0x01000193);
  }

  return `css-lab-${(folded >>> 0).toString(36)}`;
};

/** 무대에 얹을 단계별 CSS와 코드 패널 전환 규칙을 한 덩이 스타일시트로 만든다. */
export const buildCssLabStyle = (
  labId: string,
  steps: CssLabStep[]
): string => {
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
  ].join('\n');
};
