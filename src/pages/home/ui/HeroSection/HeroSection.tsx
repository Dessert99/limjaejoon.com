/** Hero — 첫 화면. 등장 순서는 보조 문구 → 제목이고 로드 애니메이션(preloader)은 두지 않는다 */
import { HERO } from '../../config/hero';
import { Container, MaskReveal, Media } from '@/shared/ui';

// 섹션을 region 랜드마크로 만들려면 이름이 필요하다 — id 만으로는 랜드마크 목록에 안 뜬다
const TITLE_ID = 'hero-title';

export function HeroSection() {
  return (
    // tabIndex=-1 — 내비게이션이 프로그램적으로 포커스를 옮길 목적지다(탭 순서에는 안 들어간다)
    <section
      id='top'
      tabIndex={-1}
      aria-labelledby={TITLE_ID}
      className='relative flex min-h-svh flex-col justify-end pb-section-sm'>
      {/* MediaReveal 을 씌우지 않는다 — 늘 화면 안이라 관찰자가 곧장 in 을 보고해 아무 일도 안 일어난다.
          로드 시점 마스크가 필요해지면 MaskReveal 처럼 trigger='mount' 를 MediaReveal 에도 연다(실물 에셋이 들어온 뒤) */}
      {/* 배경 미디어는 Container 밖이다 — bleed 로 흉내 내면 스크롤바 폭만큼 가로가 넘친다 */}
      {/* z 는 유일하게 primitive 를 직접 쓰는 계층이다(style-foundation 2절) */}
      <div className='absolute inset-0 z-(--ds-z-base)'>
        <Media
          src={null}
          alt='작업 공간 사진'
          ratio='hero'
          priority
          className='h-full'
        />
      </div>

      <Container
        size='wide'
        className='relative z-(--ds-z-content)'>
        <div className='flex flex-col gap-6'>
          {/* 의미 엘리먼트는 등장 래퍼 안에 둔다 — 래퍼가 div 라 밖에 두면 문단·제목 경계가 사라진다 */}
          {/* 보조 문구가 먼저 온다 — 제목이 먼저 서면 나머지가 뒤늦게 따라붙는 인상이 된다 */}
          <MaskReveal
            trigger='mount'
            staggerIndex={1}
            className='text-body-lg text-muted'>
            <p>{HERO.supporting}</p>
          </MaskReveal>

          <MaskReveal
            trigger='mount'
            staggerIndex={2}
            className='text-hero break-keep text-foreground'>
            <h1 id={TITLE_ID}>{HERO.headline}</h1>
          </MaskReveal>

          <MaskReveal
            trigger='mount'
            staggerIndex={3}
            className='text-label text-subtle uppercase'>
            <p className='flex flex-wrap gap-x-6 gap-y-2'>
              <span>{HERO.location}</span>
              <span>{HERO.availability}</span>
            </p>
          </MaskReveal>
        </div>
      </Container>
    </section>
  );
}
