'use client';

import { useRef } from 'react';
import {
  siCss,
  siDocker,
  siEslint,
  siExpo,
  siGit,
  siGithub,
  siGsap,
  siHtml5,
  siJavascript,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPrettier,
  siRadixui,
  siReact,
  siReacthookform,
  siReactquery,
  siShadcnui,
  siSupabase,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
  siVercel,
  siVitest,
} from 'simple-icons';
import { gsap, useGSAP } from '@/lib/motion/gsap';

/** 어바웃 뒤에 깔리는 기술 로고 판. 첫 로고부터 끝까지 빛이 한 번 훑고 지나가기를 반복한다. */
export function TechGrid() {
  const gridRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      // 모션을 줄여달라는 기기에서는 이 블록이 통째로 안 돌아, 로고가 흐린 채로 멈춰 있는다
      media.add('(prefers-reduced-motion: no-preference)', () => {
        // repeatDelay 3이 끝까지 훑고 나서 다시 시작하기까지 쉬는 초. 키우면 판이 오래 잠잠하다
        gsap.timeline({ repeat: -1, repeatDelay: 3 }).to('[data-tech-cell]', {
          // 0.7이 빛의 정점. 낮추면 지나가는 빛이 은은해진다
          opacity: 0.7,
          // duration 0.2에 밝아지고 yoyo로 같은 0.2에 걸쳐 흐려져, 로고 하나가 0.4초 동안 반짝인다
          duration: 0.2,
          // sine.inOut이라 켜지고 꺼지는 양끝이 뭉툭해 깜빡임이 아니라 숨쉬듯 보인다
          ease: 'sine.inOut',
          // repeat·yoyo를 stagger 안에 넣어야 로고마다 따로 되돌아온다. 밖에 두면 다 켜진 뒤 다 꺼진다
          // each 0.15가 빛이 넘어가는 간격. duration보다 짧아 세 개쯤 겹친 채 물결이 흐른다
          stagger: { each: 0.15, repeat: 1, yoyo: true },
        });
      });

      return () => {
        return media.revert();
      };
    },
    { scope: gridRef }
  );

  return (
    <ul
      ref={gridRef}
      aria-label='써온 기술'
      className='absolute inset-0 -z-10 grid auto-rows-fr grid-cols-4 p-home-gutter sm:grid-cols-6 lg:grid-cols-8'>
      {[
        siHtml5,
        siCss,
        siJavascript,
        siTypescript,
        siReact,
        siNextdotjs,
        siExpo,
        siNodedotjs,
        siNestjs,
        siSupabase,
        siReactquery,
        siReacthookform,
        siTailwindcss,
        siRadixui,
        siShadcnui,
        siGsap,
        siThreedotjs,
        siVitest,
        siEslint,
        siPrettier,
        siGit,
        siGithub,
        siVercel,
        siDocker,
      ].map((icon) => {
        return (
          // 후광과 번짐이 span 밖으로 나가 있어, 칸을 통째로 채운 이 li를 잘라야 자국이 안 남는다
          <li
            key={icon.slug}
            data-tech-slot
            className='grid place-items-center'>
            <span
              data-tech-cell
              // -inset-3이 후광 크기, blur-lg가 번지는 정도. 키우면 로고가 하얀 안개 위에 뜬 것처럼 멀어진다
              className="relative isolate block opacity-[0.16] before:absolute before:-inset-3 before:-z-10 before:rounded-full before:bg-home-tech-halo before:blur-lg before:content-['']"
              style={{ color: `#${icon.hex}` }}>
              <svg
                role='img'
                aria-label={icon.title}
                viewBox='0 0 24 24'
                className='size-9 fill-current sm:size-11'>
                <path d={icon.path} />
              </svg>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
