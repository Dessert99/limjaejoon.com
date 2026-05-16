'use client';
// 관광지 상세 페이지 본문 — CSR + Suspense
// useSuspenseQuery 두 개를 차례로 호출: common이 먼저 suspend → unsuspend → intro suspend → unsuspend
// (이전 RSC + Promise.all 병렬 패턴에서 전환된 이유: detailIntro2가 contentTypeId 필수 → common 응답 의존)
import Image from 'next/image';

import { WishlistButton } from '@/features/tour/components/WishlistButton/WishlistButton';
import { useTourCommonSuspenseQuery } from '@/features/tour/hooks/queries/useTourCommonSuspenseQuery';
import { useTourIntroSuspenseQuery } from '@/features/tour/hooks/queries/useTourIntroSuspenseQuery';

import * as s from '@/app/(protected)/tour/[contentId]/detail.css';

interface Props {
  contentId: string;
}

export function TourDetailContent({ contentId }: Props) {
  // 1단계: common 호출 (contentTypeId만 필요) — 완료 시까지 Suspense
  const commonQuery = useTourCommonSuspenseQuery(contentId);
  const tour = commonQuery.data;

  // 2단계: common.contentTypeId 확보 후 intro 호출 — 완료 시까지 Suspense
  const introQuery = useTourIntroSuspenseQuery(contentId, tour.contentTypeId);
  const intro = introQuery.data;

  return (
    <main className={s.container}>
      <div className={s.imageWrapper}>
        {tour.firstImage ? (
          <Image
            src={tour.firstImage}
            alt={tour.title}
            fill
            priority
            sizes='(min-width: 768px) 56rem, 100vw'
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className={s.imagePlaceholder}>이미지 없음</div>
        )}
      </div>

      <div className={s.titleRow}>
        <h1 className={s.title}>{tour.title}</h1>
        <WishlistButton
          contentId={tour.contentId}
          title={tour.title}
          firstImage={tour.firstImage}
          addr={tour.addr}
        />
      </div>

      {tour.addr && <p className={s.addr}>{tour.addr}</p>}

      <div className={s.divider} />

      {/* 외부 API HTML — ADR 0006 §3 신뢰 전제 */}
      {tour.overview && (
        <div
          className={s.overview}
          dangerouslySetInnerHTML={{ __html: tour.overview }}
        />
      )}

      {tour.homepage && (
        <div
          className={s.homepage}
          dangerouslySetInnerHTML={{ __html: tour.homepage }}
        />
      )}

      {Object.keys(intro.raw).length > 0 && (
        <section aria-label='상세 소개 정보'>
          <div className={s.introDivider} />
          {Object.entries(intro.raw).map(([key, value]) => {
            return value ? (
              <p
                key={key}
                className={s.introItem}>
                <strong>{key}:</strong>{' '}
                {typeof value === 'string' ? value : JSON.stringify(value)}
              </p>
            ) : null;
          })}
        </section>
      )}
    </main>
  );
}
