/** 본문 링크가 이 블로그 글을 가리키면 slug와 #소제목, 아니면 null. 노션에서 붙인 절대 주소와 상대 주소를 같이 받는다. */
export const parsePostHref = (
  href: string | undefined
): { slug: string; hash: string } | null => {
  const match =
    /^(?:https:\/\/(?:www\.)?limjaejoon\.com)?\/blog\/([^/?#]+)\/?(#.+)?$/.exec(
      href ?? ''
    );

  return match
    ? { slug: decodeURIComponent(match[1]), hash: match[2] ?? '' }
    : null;
};
