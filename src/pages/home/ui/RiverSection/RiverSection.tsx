/** RiverSection — 홈 둘째 섹션. 도시에서 강가로 이동한 장면 */
import { riverScene } from '@/widgets/scene-backdrop';
import { SceneSection } from '../SceneSection/SceneSection';

/** 강가 섹션 — 장면만 확정됐고 담을 문구는 미정이라 콘텐츠를 비워 둔다 */
export function RiverSection() {
  return <SceneSection scene={riverScene} />;
}
