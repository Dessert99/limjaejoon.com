// MDX 파이프라인의 마지막 rehype 단계.
// rehype-slug가 헤딩에 id를 붙인 뒤 호출되어, "헤딩 ~ 다음 헤딩 직전"의 납작한 형제들을
// <section>으로 묶는다. 클라이언트(TableOfContents)가 이 섹션에 data-active를 토글해
// "읽고 있는 부분" 배경을 칠하기 위한 DOM 경계를 만들어 주는 역할.

// hast 트리에서 우리가 만지는 노드만 추린 최소 타입 (@types/hast 의존 없이 자립)
interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}
interface HastRoot {
  type: 'root';
  children: HastNode[];
}

// TOC가 추적하는 범위와 동일하게 h1~h3만 섹션 경계로 본다 (h4 이하는 섹션 내용으로 흡수)
const HEADING_TAG = /^h[1-3]$/;

// 입력: 블록들이 한 줄로 나열된 hast root → 출력: 헤딩 단위 <section>으로 그룹핑된 root
export const rehypeSectionWrap = () => {
  return (tree: HastRoot) => {
    const grouped: HastNode[] = [];
    // 현재 누적 중인 섹션. 헤딩을 만나기 전엔 아직 없음(null)
    let current: HastNode | null = null;
    // 첫 헤딩 이전 도입부 — 감쌀 헤딩이 없으므로 섹션 밖에 그대로 둔다
    const preamble: HastNode[] = [];

    for (const node of tree.children) {
      const isHeading =
        node.type === 'element' &&
        !!node.tagName &&
        HEADING_TAG.test(node.tagName);

      if (isHeading) {
        // 새 헤딩 = 이전 섹션의 끝. 모아둔 섹션을 확정해 결과에 넣는다
        if (current) {
          grouped.push(current);
        }
        // 헤딩의 slug(rehype-slug가 넣은 id)를 섹션에 연결 → 클라이언트가 activeSlug와 매칭
        const id = (node.properties?.id as string | undefined) ?? '';
        current = {
          type: 'element',
          tagName: 'section',
          properties: { 'data-heading-section': id },
          children: [node],
        };
      } else if (current) {
        // 헤딩 이후의 본문 블록들 → 현재 섹션에 흡수
        current.children?.push(node);
      } else {
        preamble.push(node);
      }
    }
    // 마지막 섹션은 다음 헤딩이 없어 루프 안에서 push되지 않으므로 여기서 마무리
    if (current) {
      grouped.push(current);
    }

    // 변환 후 모양: [도입부 노드..., <section>..., <section>...]
    tree.children = [...preamble, ...grouped];
  };
};
