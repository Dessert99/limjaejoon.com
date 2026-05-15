'use client';
// 검색 결과 카드 — 클릭 시 상세 페이지 이동, 우상단에 위시리스트 토글 버튼 포함
import Image from 'next/image';
import Link from 'next/link';

import type { TourItem } from '@/features/tour/types';
import { WishlistButton } from './WishlistButton';
import * as s from './TourCard.css';

interface TourCardProps {
  item: TourItem;
}

export function TourCard({ item }: TourCardProps) {
  return (
    <div className={s.card}>
      {/* 카드 본문 클릭 → 상세 페이지 이동 */}
      <Link
        href={`/tour/${item.contentId}`}
        className={s.imageWrapper}
        aria-label={`${item.title} 상세 보기`}>
        {item.firstImage ? (
          <Image
            src={item.firstImage}
            alt={item.title}
            fill
            sizes='(min-width: 768px) 33vw, 50vw'
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className={s.imagePlaceholder}>이미지 없음</div>
        )}
      </Link>

      <div className={s.body}>
        <Link
          href={`/tour/${item.contentId}`}
          style={{ textDecoration: 'none', color: 'inherit' }}>
          <p className={s.title}>{item.title}</p>
        </Link>
        {item.addr && <p className={s.addr}>{item.addr}</p>}
      </div>

      {/* 위시리스트 토글 버튼 — 카드 우상단 절대 위치 */}
      <div className={s.wishlistBtn}>
        <WishlistButton
          contentId={item.contentId}
          title={item.title}
          firstImage={item.firstImage}
          addr={item.addr}
        />
      </div>
    </div>
  );
}
