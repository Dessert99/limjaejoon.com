/** 베지어 곡선 에디터 — cubic-bezier 제어점 2개를 드래그·키보드로 조작하는 SVG 에디터 */
import { useRef, useState } from 'react';
import { BEZIER_Y_MAX, BEZIER_Y_MIN, clampBezierPoint } from '../model/bezier';
import type { BezierPoints } from '../model/presets';
import * as s from './BezierEditor.css';

const SIZE = 300; // SVG 내부 좌표계 한 변 — 화면 크기는 CSS가 결정한다
const Y_RANGE = BEZIER_Y_MAX - BEZIER_Y_MIN; // y축 표시 범위 = 2 (오버슈트 포함)
const KEY_STEP = 0.02; // 화살표 한 번당 이동량 — 드래그로 어려운 미세조정 용도

/** 진행률 x(0~1) → SVG x 좌표 */
const toSvgX = (x: number) => x * SIZE;

/** 진행률 y → SVG y 좌표 — SVG는 아래로 갈수록 커져서 상하를 뒤집는다 */
const toSvgY = (y: number) => ((BEZIER_Y_MAX - y) / Y_RANGE) * SIZE;

/** 제어점 인덱스 — 0이면 P1(x1,y1), 1이면 P2(x2,y2) */
type HandleIndex = 0 | 1;

type BezierEditorProps = {
  points: BezierPoints;
  onChange: (points: BezierPoints) => void;
};

/** 드래그 가능한 cubic-bezier 에디터 — 값은 부모가 소유하는 controlled 컴포넌트 */
export function BezierEditor({ points, onChange }: BezierEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<HandleIndex | null>(null);
  const [x1, y1, x2, y2] = points;

  // 포인터 화면 좌표 → 진행률 좌표 — SVG가 CSS로 스케일돼도 비율 환산이라 정확하다
  const pointFromEvent = (event: React.PointerEvent): [number, number] => {
    const rect = svgRef.current!.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = BEZIER_Y_MAX - ((event.clientY - rect.top) / rect.height) * Y_RANGE;
    return clampBezierPoint(x, y);
  };

  const updateHandle = (index: HandleIndex, x: number, y: number) => {
    const next: BezierPoints = index === 0 ? [x, y, x2, y2] : [x1, y1, x, y];
    onChange(next);
  };

  const handlePointerDown =
    (index: HandleIndex) => (event: React.PointerEvent<SVGCircleElement>) => {
      // 핸들 밖으로 나가도 move를 계속 받도록 캡처 — 없으면 빠른 드래그가 끊긴다
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(index);
    };

  const handlePointerMove = (index: HandleIndex) => (event: React.PointerEvent) => {
    if (dragging !== index) return;
    const [x, y] = pointFromEvent(event);
    updateHandle(index, x, y);
  };

  const handleKeyDown = (index: HandleIndex) => (event: React.KeyboardEvent) => {
    const [currentX, currentY] = index === 0 ? [x1, y1] : [x2, y2];
    const deltas: Record<string, [number, number]> = {
      ArrowLeft: [-KEY_STEP, 0],
      ArrowRight: [KEY_STEP, 0],
      ArrowUp: [0, KEY_STEP],
      ArrowDown: [0, -KEY_STEP],
    };
    const delta = deltas[event.key];
    if (!delta) return;
    event.preventDefault(); // 화살표 키가 페이지 스크롤로 새지 않게
    const [x, y] = clampBezierPoint(currentX + delta[0], currentY + delta[1]);
    updateHandle(index, x, y);
  };

  const handleProps = (index: HandleIndex, x: number, y: number) => ({
    cx: toSvgX(x),
    cy: toSvgY(y),
    r: 10,
    tabIndex: 0,
    // 2차원 값이라 표준 role이 없다 — slider + valuetext로 좌표를 읽어준다
    role: 'slider',
    'aria-label': `제어점 ${index + 1}`,
    'aria-valuenow': x,
    'aria-valuemin': 0,
    'aria-valuemax': 1,
    'aria-valuetext': `x ${x.toFixed(2)}, y ${y.toFixed(2)}`,
    className: s.handle,
    onPointerDown: handlePointerDown(index),
    onPointerMove: handlePointerMove(index),
    onPointerUp: () => setDragging(null),
    onKeyDown: handleKeyDown(index),
  });

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={s.svg}
      aria-label='cubic-bezier 곡선 에디터'>
      <rect
        x={0}
        y={toSvgY(1)}
        width={SIZE}
        height={toSvgY(0) - toSvgY(1)}
        className={s.unitArea}
      />
      <line
        x1={toSvgX(0)}
        y1={toSvgY(0)}
        x2={toSvgX(1)}
        y2={toSvgY(1)}
        className={s.baseline}
      />
      <line
        x1={toSvgX(0)}
        y1={toSvgY(0)}
        x2={toSvgX(x1)}
        y2={toSvgY(y1)}
        className={s.arm}
      />
      <line
        x1={toSvgX(1)}
        y1={toSvgY(1)}
        x2={toSvgX(x2)}
        y2={toSvgY(y2)}
        className={s.arm}
      />
      <path
        d={`M ${toSvgX(0)} ${toSvgY(0)} C ${toSvgX(x1)} ${toSvgY(y1)}, ${toSvgX(x2)} ${toSvgY(y2)}, ${toSvgX(1)} ${toSvgY(1)}`}
        className={s.curve}
      />
      <circle {...handleProps(0, x1, y1)} />
      <circle {...handleProps(1, x2, y2)} />
    </svg>
  );
}
