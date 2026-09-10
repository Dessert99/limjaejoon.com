import { TransitionLink } from '@/components/transition/TransitionLink';

/** 블로그 상단 내비. 스크롤해도 붙어 있고 다른 섹션으로 건너뛴다. */
export function BlogNav() {
  return (
    <nav
      aria-label='주요 메뉴'
      className='sticky top-0 z-(--z-sticky) flex items-center gap-6 border-b border-blog-border bg-blog-background px-blog-gutter py-4'>
      {/* mr-auto가 브랜드를 왼쪽 끝으로 밀어 링크를 오른쪽에 모은다 */}
      <span className='mr-auto text-xs tracking-widest text-blog-muted-foreground uppercase'>
        blog
      </span>

      {[
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
        { label: 'Labs', href: '/labs' },
      ].map((route) => {
        return (
          <TransitionLink
            key={route.href}
            href={route.href}
            className='text-base font-medium text-blog-foreground transition-colors duration-200 ease-in-out hover:text-blog-primary'>
            {route.label}
          </TransitionLink>
        );
      })}
    </nav>
  );
}
