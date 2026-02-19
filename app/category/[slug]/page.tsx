// 레거시 `/category/[slug]` 경로를 신규 `/handbook/[slug]`로 전달하기 위해 사용합니다.
import { redirect } from 'next/navigation';

interface LegacyCategoryPageProps {
  // App Router에서 전달하는 동적 라우트 파라미터 Promise 입니다.
  params: Promise<{ slug: string }>;
}

// 레거시 카테고리 경로를 신규 handbook 경로로 리다이렉트합니다.
export default async function LegacyCategoryPage({ params }: LegacyCategoryPageProps) {
  // params Promise를 해제해 현재 경로의 slug 값을 얻습니다.
  const { slug } = await params;
  // 기존 북마크/링크 호환성을 유지하기 위해 handbook 상세로 이동시킵니다.
  redirect(`/handbook/${slug}`);
}
