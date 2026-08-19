import '@/styles/global.css';
import { pretendard } from '@/styles/fonts';
import { RouteTransition } from '@/components/transition/RouteTransition';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  // 하위 페이지의 상대 경로 canonical·og:url 을 절대 URL 로 만드는 기준 도메인
  metadataBase: new URL('https://www.limjaejoon.com'),
  // 홈의 <title> 이자, 제목을 안 준 페이지가 물려받는 값
  title: 'limjaejoon',
  // 홈의 meta description. 검색 스니펫이자 og:description·twitter:description 으로 상속된다
  description: '개발자 임재준입니다.',
  openGraph: {
    // 이 페이지를 사이트로 볼지 글로 볼지. 글 상세는 article 을 쓴다
    type: 'website',
    // og:locale. 미리보기를 읽는 쪽에 알려주는 언어·지역
    locale: 'ko_KR',
    // og:site_name. 노션 멘션처럼 좁은 미리보기에서 제목 앞에 붙는 사이트 이름
    siteName: 'limjaejoon',
    // og:url. 공유된 링크가 가리키는 정본 주소
    url: 'https://www.limjaejoon.com',
    // og:title. 카톡·노션 미리보기 카드의 굵은 첫 줄
    title: 'limjaejoon',
    images: [
      {
        // og:image. app/opengraph-image.png 를 가리키는 미리보기 카드 그림
        url: '/opengraph-image.png',
        // og:image:width. 크롤러가 내려받기 전에 카드 자리를 잡는 데 쓴다
        width: 1200,
        // og:image:height. 1200x630 은 카톡·슬랙이 큰 카드로 그리는 비율
        height: 630,
        // og:image:alt. 이미지를 못 띄우는 환경과 스크린 리더가 읽는 설명
        alt: 'limjaejoon',
      },
    ],
  },
  twitter: {
    // 트위터 카드 모양. large 는 이미지를 크게 깔고 그 아래 제목을 놓는다
    card: 'summary_large_image',
    // twitter:title. 안 주면 og:title 을 물려받지만 홈은 못박아 둔다
    title: 'limjaejoon',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='ko'
      data-scroll-behavior='smooth'
      className={pretendard.variable}>
      <body>
        <RouteTransition>{children}</RouteTransition>
      </body>
    </html>
  );
}
