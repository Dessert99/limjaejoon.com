import { SITE } from '@/config/site';
import type { Metadata } from 'next';

export const OG_IMAGE_PATH = '/opengraph-image.png';

export const SITE_OPEN_GRAPH = {
  locale: 'ko_KR',
  siteName: SITE.name,
  images: [
    {
      url: OG_IMAGE_PATH,
      width: 1200,
      height: 630,
      alt: `${SITE.name} — ${SITE.role}`,
    },
  ],
};

export const buildPageMetadata = ({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata => {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...SITE_OPEN_GRAPH,
      type: 'website',
      title: `${title} | ${SITE.name}`,
      description,
      url: path,
    },
  };
};
