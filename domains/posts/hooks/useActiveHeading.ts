import { useEffect, useState } from 'react';

/** 지금 화면 위쪽에 들어온 제목을 골라 목차에서 짚어준다. */
export const useActiveHeading = (headingIds: string[]): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null);
  // 배열은 렌더마다 새 참조라 문자열로 눌러야 옵저버가 매번 다시 붙지 않는다
  const key = headingIds.join('|');

  useEffect(() => {
    const elements = key
      .split('|')
      .map((id) => {
        return document.getElementById(id);
      })
      .filter((element): element is HTMLElement => {
        return element !== null;
      });

    if (elements.length === 0) {
      return;
    }

    const inBand = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          inBand.set(entry.target.id, entry.isIntersecting);
        });

        // 밴드 안에 여러 제목이 겹치면 본문 순서상 가장 위의 것을 잡는다
        const current = elements.find((element) => {
          return inBand.get(element.id);
        });

        if (current) {
          setActiveId(current.id);
        }
      },
      // 화면 위 96px(내비 높이)부터 아래 30%까지만 감지 밴드다. 밴드를 넓히면 여러 제목이 겹쳐 잡힌다
      { rootMargin: '-96px 0px -70% 0px' }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [key]);

  return activeId;
};
