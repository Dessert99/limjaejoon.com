/** 미디어 — aspect-ratio 와 object-fit 만 소유한다. transform·clip-path 는 MediaReveal 몫이다(설계 7.3) */
import Image from 'next/image';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/lib';

/** 비율 이름 — tokens.css 의 --aspect-* 와 짝이다. shared 가 소유해야 entities 가 참조할 수 있다 */
export type MediaRatio = 'hero' | 'thumbnail' | 'gallery';

/** src 가 null 이면 비율만 맞춘 자리표시를 그린다 — 에셋 확보 전 레이아웃을 잡기 위한 상태다 */
type MediaProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  src: string | null;
  alt: string;
  ratio: MediaRatio;
  priority?: boolean;
  sizes?: string;
};

const RATIO_CLASS = {
  hero: 'aspect-hero',
  thumbnail: 'aspect-thumbnail',
  gallery: 'aspect-gallery',
} as const;

/** 프로젝트 썸네일·Hero·Gallery 가 공유하는 이미지 표시 층 */
export function Media({
  src,
  alt,
  ratio,
  priority = false,
  // fill 은 srcset 을 만들 때 이 값에 기대므로 좁힐 수 있으면 소비자가 좁혀 준다
  sizes = '100vw',
  className,
  ...rest
}: MediaProps) {
  return (
    <div
      className={cn('relative overflow-hidden', RATIO_CLASS[ratio], className)}
      {...rest}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className='object-cover'
        />
      ) : (
        // 빈 문자열 src 로 <img> 를 그리면 깨진 아이콘이 뜨고 스크린리더에도 잡힌다 — 아예 만들지 않는다
        <div
          aria-hidden='true'
          className='size-full bg-surface-raised'
        />
      )}
    </div>
  );
}
