/** 공용 Slider — Radix Slider 위에 트랙/레인지/썸 스타일만 입힌 범위 입력 */
import { Slider as SliderPrimitive } from 'radix-ui'; // 값↔좌표 계산·키보드 스텝·ARIA slider·폼 input을 Radix가 처리
import { forwardRef } from 'react';
import { range, root, thumb, track } from './Slider.css';

/** 루트 — value/min/max/step과 onValueChange를 받는 컨테이너 */
const Root = forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={[root, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Root.displayName = 'Slider.Root';

/** 트랙 — 전체 범위 바 */
const Track = forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Track>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Track>
>(({ className, ...props }, ref) => {
  return (
    <SliderPrimitive.Track
      ref={ref}
      className={[track, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Track.displayName = 'Slider.Track';

/** 레인지 — 채워진 구간 */
const Range = forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Range>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Range>
>(({ className, ...props }, ref) => {
  return (
    <SliderPrimitive.Range
      ref={ref}
      className={[range, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Range.displayName = 'Slider.Range';

/** 썸 — 드래그 손잡이, 접근성 이름은 사용처에서 aria-label로 */
const Thumb = forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>
>(({ className, ...props }, ref) => {
  return (
    <SliderPrimitive.Thumb
      ref={ref}
      className={[thumb, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Thumb.displayName = 'Slider.Thumb';

/** 네임스페이스 — <Slider.Root><Slider.Track><Slider.Range/></Slider.Track><Slider.Thumb/></Slider.Root> */
export const Slider = { Root, Track, Range, Thumb };
