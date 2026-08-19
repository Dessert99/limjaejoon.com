import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'jaejoon labs',
  description: '마음껏 실험하는 공간',
  alternates: { canonical: '/lab' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/lab',
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

export default function LabPage() {
  return <main className='min-h-svh' />;
}
