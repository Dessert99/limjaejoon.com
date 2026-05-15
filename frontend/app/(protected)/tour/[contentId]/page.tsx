// 관광지 상세 페이지 — RSC 셸 (generateMetadata만 유지) + 본문은 클라이언트 Suspense
// 본문이 CSR로 전환된 이유: KorService2 detailIntro2가 contentTypeId 필수 → common 응답 의존 체이닝
// useSuspenseQuery 두 개로 깔끔하게 표현하는 게 자연스러움 (ADR 0004 갱신 대상)
import type { Metadata } from 'next';
import { Suspense } from 'react';

import { TourDetailContent } from '@/features/tour/components/TourDetailContent';
import { fetchTourCommonOnServer } from '@/features/tour/api/tour.server';

interface PageProps {
  params: Promise<{ contentId: string }>;
}

// generateMetadata: SEO/OG는 보호 페이지라 효용 작지만 탭 제목·공유 미리보기 정도는 유지
// detailCommon2는 contentId만으로 호출 가능하므로 여기서 안전하게 사용
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { contentId } = await params;
  try {
    const tour = await fetchTourCommonOnServer(contentId);
    return {
      title: tour.title,
      description: tour.overview
        ? tour.overview.replace(/<[^>]+>/g, '').slice(0, 160)
        : tour.title,
      openGraph: {
        title: tour.title,
        images: tour.firstImage ? [{ url: tour.firstImage }] : [],
      },
    };
  } catch {
    return { title: '관광지 상세' };
  }
}

export default async function TourDetailPage({ params }: PageProps) {
  const { contentId } = await params;

  return (
    <Suspense fallback={<div style={{ padding: '5rem 1rem' }}>로딩 중…</div>}>
      <TourDetailContent contentId={contentId} />
    </Suspense>
  );
}
