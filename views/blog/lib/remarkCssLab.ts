import type { Root, RootContent } from 'mdast';
import type { Processor } from 'unified';
import type { VFile } from 'vfile';

// 여는 태그가 나오는 자리와, 그 짝이 닫히는 자리
const OPEN = /^<css-lab[\s>]/;
const CLOSE = '</css-lab>';

/**
 * <css-lab> 구간을 원문 그대로 되살린다.
 *
 * 마크다운은 빈 줄에서 HTML 블록을 끊는다. 그래서 CSS 중간에 빈 줄이 하나라도 있으면
 * 뒷부분이 문단이나 코드 블록으로 재해석돼, 작성자가 쓴 적 없는 <p>·<pre>·<span>이
 * 그 CSS 안에 섞여 들어간다. 쪼개진 노드를 원본 문자열로 되돌려 그 일이 아예 없게 한다.
 */
export const remarkCssLab = function (this: Processor) {
  return (tree: Root, file: VFile): void => {
    const source = String(file);

    for (let at = 0; at < tree.children.length; at += 1) {
      const node = tree.children[at];

      if (node.type !== 'html' || !OPEN.test(node.value)) {
        continue;
      }

      const start = node.position?.start.offset;
      // 닫는 태그를 품은 노드까지가 한 덩이다. 못 찾으면 손대지 않고 둔다
      const until = tree.children.findIndex((sibling, index) => {
        return (
          index >= at &&
          source
            .slice(sibling.position?.start.offset, sibling.position?.end.offset)
            .includes(CLOSE)
        );
      });
      const end = tree.children[until]?.position?.end.offset;

      if (start === undefined || end === undefined || until === at) {
        continue;
      }

      // 닫는 태그 뒤에 붙은 본문까지 삼키면 그 문단의 마크다운이 죽는다. 잘라서 다시 파싱한다
      const closed = source.indexOf(CLOSE, start) + CLOSE.length;
      const tail: RootContent[] =
        closed < end
          ? (this.parse(source.slice(closed, end)) as Root).children
          : [];

      tree.children.splice(
        at,
        until - at + 1,
        {
          type: 'html',
          value: source.slice(start, closed),
        },
        ...tail
      );
    }
  };
};
