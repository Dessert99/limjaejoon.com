import { SpaceStage } from '@/views/labs/components/SpaceStage/SpaceStage';
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
  return (
    <div className='relative h-svh bg-labs-void text-labs-star'>
      {/* 위쪽만 남색으로 들뜬 하늘 — at 좌표를 옮기면 은하수가 걸린 방향이 바뀐다 */}
      <div className='absolute inset-0 bg-radial-[at_50%_0%] from-labs-deep to-transparent to-55%' />

      <div className='absolute inset-0'>
        <SpaceStage />
      </div>
    </div>
  );
}
