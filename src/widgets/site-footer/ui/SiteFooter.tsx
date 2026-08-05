/** 사이트 푸터 — main 밖에 선다. section·main 안에 중첩되면 contentinfo 랜드마크가 되지 않는다 */
import { SITE, SOCIAL_LINKS } from '@/shared/config';
import { Container } from '@/shared/ui';

export function SiteFooter() {
  return (
    <footer className='bg-background py-section-sm text-foreground'>
      <Container className='flex flex-wrap items-center justify-between gap-6 border-t border-border pt-8'>
        <ul className='flex flex-wrap gap-6'>
          {SOCIAL_LINKS.map((link) => {
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className='text-body text-muted transition-colors duration-quick ease-standard hover:text-accent'>
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
        <p className='text-body-sm text-subtle'>
          © {SITE.nameEn} · {SITE.roleEn}
        </p>
      </Container>
    </footer>
  );
}
