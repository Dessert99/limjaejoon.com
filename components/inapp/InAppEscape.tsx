'use client';

import { useEffect } from 'react';
import { escapeTargets } from './escapeTargets';

/** 인앱 브라우저로 들어오면 크롬, 없으면 기본 브라우저로 내보낸다. 전부 막히면 인앱에 그대로 둔다. */
export function InAppEscape() {
  useEffect(() => {
    const targets = escapeTargets(navigator.userAgent, location.href);
    if (targets.length === 0) {
      return;
    }

    // 한 탭에서 한 번만 시도한다. 라인 출구처럼 같은 페이지를 다시 여는 시도가 무한히 돌지 않게 막는다
    try {
      if (sessionStorage.getItem('in-app-escape-tried')) {
        return;
      }
      sessionStorage.setItem('in-app-escape-tried', '1');
    } catch {
      // 기록을 못 남기면 반복을 막을 수 없어 시도하지 않는다
      return;
    }

    let step = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tryNext = () => {
      if (step >= targets.length) {
        return;
      }
      location.href = targets[step++];
      // 키우면 실패한 시도에서 다음 주소로 넘어가기까지 오래 멈춰 있고, 줄이면 앱이 뜨기 전에 다음 주소를 덮어쓴다
      timer = setTimeout(tryNext, 1500);
    };
    // 다른 앱이 열리면 인앱 화면이 가려진다. 남은 시도를 멈추고, 카톡이면 빈 인앱 창이 남지 않게 닫는다
    const onHidden = () => {
      if (document.visibilityState !== 'hidden') {
        return;
      }
      clearTimeout(timer);
      if (navigator.userAgent.includes('KAKAOTALK')) {
        location.href = 'kakaotalk://inappbrowser/close';
      }
    };

    document.addEventListener('visibilitychange', onHidden);
    tryNext();
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onHidden);
    };
  }, []);

  return null;
}
