/** 본문 링크가 이 블로그 글을 가리키면 그 slug, 아니면 null. 노션에서 붙인 절대 주소와 상대 주소를 같이 받는다. */
export const parsePostSlug = (href: string | undefined): string | null => {
  const match =
    /^(?:https:\/\/(?:www\.)?limjaejoon\.com)?\/blog\/([^/?#]+)\/?$/.exec(
      href ?? ''
    );

  return match ? decodeURIComponent(match[1]) : null;
};
