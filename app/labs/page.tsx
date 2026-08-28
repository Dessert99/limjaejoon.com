import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'jaejoon labs',
  description: '마음껏 실험하는 공간',
  alternates: { canonical: '/labs' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/labs',
    title: 'jaejoon labs',
    description: '마음껏 실험하는 공간',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'limjaejoon labs',
      },
    ],
  },
};

export default function LabsPage() {
  // 무대는 layout이 깔아두므로, 열매를 아직 안 고른 이 라우트는 본문이 없다
  return null;
}
