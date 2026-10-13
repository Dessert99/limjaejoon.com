/** 인앱이면 바깥 브라우저로 나가 볼 주소를 시도할 순서대로 준다. 크롬 → 앱 전용 출구 → 기본 브라우저. 인앱이 아니면 빈 배열 */
export const escapeTargets = (userAgent: string, href: string): string[] => {
  // 카톡·인스타·페북·스레드(Barcelona)·라인·네이버·다음, 그리고 안드로이드 WebView 공통 표식
  if (
    !/KAKAOTALK|Instagram|FBAN|FBAV|FB_IAB|Barcelona| Line\/|NAVER\(inapp|DaumApps|; wv\)/.test(
      userAgent
    )
  ) {
    return [];
  }

  const url = new URL(href);
  const scheme = url.protocol.slice(0, -1);
  // intent는 '#Intent'를 구분자로 써서 원래 해시는 실을 수 없다
  const hostPath = `${url.host}${url.pathname}${url.search}`;

  const kakao = userAgent.includes('KAKAOTALK')
    ? [`kakaotalk://web/openExternal?url=${encodeURIComponent(href)}`]
    : [];
  const lineUrl = new URL(href);
  lineUrl.searchParams.set('openExternalBrowser', '1');
  const line = / Line\//.test(userAgent) ? [lineUrl.href] : [];

  if (userAgent.includes('Android')) {
    return [
      `intent://${hostPath}#Intent;scheme=${scheme};package=com.android.chrome;end`,
      ...kakao,
      ...line,
      // package를 빼면 OS가 기본 브라우저(또는 선택 창)로 연다
      `intent://${hostPath}#Intent;scheme=${scheme};action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end`,
    ];
  }

  if (/iPhone|iPad|iPod/.test(userAgent)) {
    return [
      `${scheme === 'https' ? 'googlechromes' : 'googlechrome'}://${hostPath}`,
      ...kakao,
      ...line,
      // iOS 17+에서 Safari를 여는 스킴. 막는 인앱이 있어 마지막 수단으로만 쓴다
      `x-safari-${href}`,
    ];
  }

  return [];
};
