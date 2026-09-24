'use client';

import { useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type Group, type Mesh, type MeshBasicMaterial } from 'three';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { drawBookCover, drawLabel, drawPageEdges } from './bookCover';
import { fitCover } from './fitCover';

/** 책 한 권이 대표하는 대주제. group이 같은 책끼리 한 더미에 쌓이고, 클릭하면 slug로 열린다. */
export type BookTopic = {
  slug: string;
  title: string;
  group: string;
  color: string;
  logo: string | null;
};

/** 테이블 위 책 한 권의 자리와 기울기. slot이 x·z, body가 y와 회전을 맡는다. */
type Pose = {
  x: number;
  z: number;
  y: number;
  rotationX: number;
  rotationY: number;
};

// 책 한 권의 가로·두께·세로(m). 키우면 화면에 들어가는 권수가 준다
const [width, thickness, height] = [0.18, 0.03, 0.25];
// 표지판 두께. 키우면 하드커버처럼 두툼해지고 줄이면 페이퍼백에 가까워진다
const board = 0.003;
// 뒤 더미가 앞 더미 옆으로 비켜 보이는 데 필요한 최소 폭. 이보다 좁으면 대각선 대신 지그재그로 놓는다
const minLateral = 0.15;
// 펼친 줄의 가로 간격, 줄 사이 높이, 한 줄 최대 권수. 뒷줄은 앞줄 위 공중에 뜬다. 높이를 줄이면 줄끼리 겹친다
const columnGap = 0.22;
const rowStep = 0.27;
const maxColumns = 3;
// 더미에 눈으로 보이는 최대 권수. 넘치는 책은 펼칠 때만 나온다
const pileCap = 5;
// 기댄 각도(rad)와 그때 앞아래 모서리가 테이블에 닿는 높이. 각도를 바꾸면 높이도 따라 바뀌어 뜨거나 파묻히지 않는다
const lean = 1.0;
const restingY =
  (thickness / 2) * Math.cos(lean) + (height / 2) * Math.sin(lean);

/** 테이블 위 분류별 책 더미. 앞에서 뒤로 대각선으로 놓이고, 더미를 누르면 그 분류가 앞쪽에 줄지어 펼쳐지며, 책을 누르면 그 책이 카메라 앞으로 날아온다. */
export function BookPile({
  topics,
  spreadGroup,
  openSlug,
  onSpread,
  onOpen,
  onArrive,
}: {
  topics: BookTopic[];
  spreadGroup: string | null;
  openSlug: string;
  onSpread: (group: string) => void;
  onOpen: (slug: string) => void;
  onArrive: () => void;
}) {
  const aspect = useThree((state) => {
    return state.viewport.aspect;
  });
  const invalidate = useThree((state) => {
    return state.invalidate;
  });
  const slots = useRef<(Group | null)[]>([]);
  const bodies = useRef<(Group | null)[]>([]);
  const shadows = useRef<(Group | null)[]>([]);
  const labels = useRef<(Mesh | null)[]>([]);
  // 책마다 지금 배치에서 테이블 위 제자리. 날아간 책이 돌아올 곳이다
  const homes = useRef<Pose[]>([]);
  const flight = useRef<{
    tween: gsap.core.Tween;
    index: number;
    from: Pose;
  } | null>(null);
  // 테이블을 떠나 있는 책. 더미 배치 트윈이 이 책을 테이블로 끌어내리지 않게 비켜 간다
  const flying = useRef('');
  // 책이 테이블에 내려앉을 때마다 올려 더미 배치를 다시 돌린다
  const [landings, setLandings] = useState(0);

  const groups = useMemo(() => {
    return [
      ...new Set(
        topics.map((topic) => {
          return topic.group;
        })
      ),
    ];
  }, [topics]);
  const covers = useMemo(() => {
    return topics.map((topic) => {
      // 로고는 늦게 받아져 표지를 다시 그리므로, 멈춰 있는 방에 한 프레임 그려 달라고 한다
      return drawBookCover(topic.title, topic.color, topic.logo, invalidate);
    });
  }, [topics, invalidate]);
  const labelTextures = useMemo(() => {
    return groups.map((group) => {
      return drawLabel(group);
    });
  }, [groups]);
  const pages = useMemo(() => {
    return drawPageEdges();
  }, []);

  useEffect(() => {
    return () => {
      covers.forEach((cover) => {
        cover.dispose();
      });
      labelTextures.forEach((label) => {
        label.dispose();
      });
      pages.dispose();
    };
  }, [covers, labelTextures, pages]);

  // 어떤 깊이에서 화면에 보이는 테이블 폭(m). 카메라 화각(Stage와 같은 식)과 화면 비율로 구한다
  const visibleWidth = (depth: number) => {
    const fov = 44 * fitCover(aspect)[1];

    return 2 * depth * Math.tan((fov / 2) * (Math.PI / 180)) * aspect;
  };

  // 맨 앞 더미를 카메라에 최대한 가까이(1.6) 두되, 대각선이 그 깊이의 화면 폭에 안 들어가면 한 단계씩 물린다
  // 2.5까지 물려도 안 들어가면 좌우로 번갈아 놓는 지그재그로 바꾼다. 뒤 더미가 앞 더미 옆으로 비켜야 이름표가 보인다
  const diagonalLateral = (depth: number) => {
    return Math.min(
      0.3,
      (visibleWidth(depth) - width - 0.1) / Math.max(groups.length - 1, 1)
    );
  };
  const depths = [1.6, 1.8, 2.0, 2.2, 2.5];
  const diagonalDepth = depths.find((depth) => {
    return diagonalLateral(depth) >= minLateral;
  });
  const zigzagDepth = depths.find((depth) => {
    return visibleWidth(depth) >= minLateral * 2 + width + 0.1;
  });
  const frontDepth = diagonalDepth ?? zigzagDepth ?? 2.5;
  const zigzag = diagonalDepth === undefined;
  const lateral = zigzag ? minLateral : diagonalLateral(frontDepth);
  // 더미 사이 깊이 간격. 지그재그는 두 칸 뒤 더미가 같은 쪽에 서므로 앞 더미 위로 올라올 만큼 더 벌린다
  const pileStep = zigzag ? 0.45 : 0.32;

  // 펼친 줄에 놓을 권수. 좁은 화면이면 2권, 넓어도 3권까지만 두고 나머지는 뒷줄로
  const spreadCount = topics.filter((topic) => {
    return topic.group === spreadGroup;
  }).length;
  const columns = Math.max(
    1,
    Math.min(
      maxColumns,
      spreadCount,
      Math.floor((visibleWidth(frontDepth) - 0.06) / columnGap)
    )
  );

  useGSAP(
    () => {
      const pileX = (index: number) => {
        return zigzag
          ? (index % 2 ? 1 : -1) * lateral
          : (index - (groups.length - 1) / 2) * lateral;
      };
      const pileZ = (index: number) => {
        return -(frontDepth + index * pileStep);
      };
      // 펼치는 동안 다른 더미는 화면 밖으로 비켜 줄이 뻗을 자리를 비운다. 원래 있던 쪽으로 나간다
      const asideX = (index: number) => {
        const side = pileX(index) >= 0 ? 1 : -1;

        return side * (visibleWidth(-pileZ(index)) / 2 + width * 1.5);
      };
      const pileSize = (group: string) => {
        return Math.min(
          pileCap,
          topics.filter((topic) => {
            return topic.group === group;
          }).length
        );
      };

      groups.forEach((group, index) => {
        const label = labels.current[index];
        const aside = spreadGroup !== null && group !== spreadGroup;

        if (label) {
          gsap.to(label.position, {
            x: aside ? asideX(index) : pileX(index),
            // 이름표는 더미 위 앞 가장자리에 선다. 뒤 더미에 가려지지 않고 펼쳐서 더미가 비면 바닥에 내려앉는다
            y: (group === spreadGroup ? 0 : pileSize(group) * thickness) + 0.03,
            z: pileZ(index) + height / 2 - 0.02,
            duration: 0.8,
            ease: 'power3.out',
          });
        }
      });

      topics.forEach((topic, index) => {
        const slot = slots.current[index];
        const body = bodies.current[index];
        const shadow = shadows.current[index];

        if (!slot || !body || !shadow) {
          return;
        }

        const groupIndex = groups.indexOf(topic.group);
        // 더미 안에서 몇 번째로 쌓이는지가 곧 펼쳤을 때의 순서다
        const siblings = topics.filter((other) => {
          return other.group === topic.group;
        });
        const layer = siblings.indexOf(topic);
        const spread = topic.group === spreadGroup;
        const aside = spreadGroup !== null && !spread;
        const column = layer % columns;
        const row = Math.floor(layer / columns);

        // 펼치면 첫 줄은 테이블에 기대고 다음 줄부터 그 위 공중에 층층이 뜬다. 더미는 짝수·홀수 권을 반대로 살짝 틀어 손으로 쌓은 느낌을 낸다
        const target = spread
          ? {
              x: (column - (columns - 1) / 2) * columnGap,
              z: -(frontDepth - 0.1),
              y: restingY + row * rowStep,
              rotationX: lean,
              rotationY: 0,
            }
          : {
              x:
                (aside ? asideX(groupIndex) : pileX(groupIndex)) +
                (layer % 2) * 0.02,
              z: pileZ(groupIndex),
              y: thickness / 2 + Math.min(layer, pileCap - 1) * thickness,
              rotationX: 0,
              rotationY: (layer % 2 ? 1 : -1) * 0.1,
            };

        homes.current[index] = target;

        if (topic.slug === flying.current) {
          return;
        }

        // 더미 상한을 넘는 책은 펼칠 때만 보인다
        body.visible = spread || layer < pileCap;

        // 0.06초씩 어긋나게 출발해야 한 권씩 미끄러지는 게 보인다
        const delay = layer * 0.06;
        const motion = { duration: 0.8, ease: 'power3.out', delay };

        gsap.to(slot.position, { x: target.x, z: target.z, ...motion });
        gsap.to(body.position, { y: target.y, ...motion });
        gsap.to(body.rotation, {
          x: target.rotationX,
          y: target.rotationY,
          ...motion,
        });
        // 기댄 책은 앞 모서리만 닿으므로 그늘을 앞(+z)으로 당기고 납작하게 편다
        gsap.to(shadow.position, { z: spread ? 0.08 : 0, ...motion });
        gsap.to(shadow.scale, {
          x: spread ? 0.34 : 0.32,
          y: spread ? 0.22 : 0.4,
          ...motion,
        });
        shadow.children.forEach((disc, ring) => {
          gsap.to((disc as Mesh).material as MeshBasicMaterial, {
            // 더미에선 맨 아래 한 권 밑에만, 펼침에선 바닥에 닿은 첫 줄에만 남긴다. 세 원판이 바깥 0.12, 가운데 0.16, 안쪽 0.24로 겹쳐 가운데가 제일 진하다
            opacity:
              (spread && row === 0) || (!spread && layer === 0)
                ? [0.12, 0.16, 0.24][ring]
                : 0,
            duration: 0.5,
            delay,
          });
        });
      });
    },
    {
      dependencies: [
        spreadGroup,
        frontDepth,
        zigzag,
        lateral,
        pileStep,
        columns,
        topics,
        groups,
        landings,
      ],
    }
  );

  // 주소의 책을 따라 움직인다. 클릭과 공유 링크가 같은 길을 타고, 책이 닫히면 같은 궤적을 거꾸로 돌아간다
  useGSAP(
    () => {
      if (!openSlug) {
        if (flight.current) {
          // 링크로 들어오면 접힌 더미에서 떠났으므로, 돌아갈 곳을 지금 배치의 제자리로 바꿔 끼운다
          Object.assign(
            flight.current.from,
            homes.current[flight.current.index]
          );
          flight.current.tween.reverse();
        }
        return;
      }

      const index = topics.findIndex((topic) => {
        return topic.slug === openSlug;
      });
      const slot = slots.current[index];
      const body = bodies.current[index];
      const shadow = shadows.current[index];

      if (!slot || !body || !shadow) {
        return;
      }

      // 펼치는 트윈이 아직 돌고 있으면 날아가는 책을 붙잡아 끌어당긴다
      gsap.killTweensOf([slot.position, body.position, body.rotation]);
      flying.current = openSlug;

      const from: Pose = {
        x: slot.position.x,
        z: slot.position.z,
        y: body.position.y,
        rotationX: body.rotation.x,
        rotationY: body.rotation.y,
      };
      // 카메라(높이 0.55) 앞 0.55m. 줄이면 책이 화면을 더 채우고, 키우면 작게 멈춘다
      const distance = 0.55;
      // 카메라가 3° 내려다보므로 시선 중심 높이에 세우고 그만큼 눕혀야 표지가 정면으로 선다
      const arrivalY = 0.55 - distance * Math.tan(0.052);
      const faceX = Math.PI / 2 - 0.052;
      const progress = { p: 0 };

      const tween = gsap.to(progress, {
        p: 1,
        // 1.5초. 줄이면 휙 날아오고, 키우면 두 바퀴가 느긋하게 읽힌다
        duration: 1.5,
        // 천천히 떠서 천천히 내려앉는다. out 계열로 바꾸면 확 튀어나와 끝에서 오래 감속한다
        ease: 'sine.inOut',
        onUpdate: () => {
          const { p } = progress;

          slot.position.x = from.x * (1 - p);
          slot.position.z = from.z + (-distance - from.z) * p;
          // 0.22m 높이의 호. 키우면 더 높이 솟았다 내려오고, 0이면 곧장 직선으로 온다
          body.position.y =
            from.y + (arrivalY - from.y) * p + 0.22 * Math.sin(Math.PI * p);
          body.rotation.x = from.rotationX + (faceX - from.rotationX) * p;
          body.rotation.y = from.rotationY * (1 - p);
          // 세로축으로 두 바퀴. 정수 바퀴여야 표지가 정면으로 멈추고, 늘리면 도는 게 빨라져 표지가 번쩍인다
          slot.rotation.y = 2 * Math.PI * 2 * p;
          // 테이블을 떠난 책 밑에 그늘이 남으면 안 된다
          shadow.visible = p === 0;
        },
        onComplete: onArrive,
        onReverseComplete: () => {
          flying.current = '';
          // 돌아오는 사이 더미가 접히거나 펼쳐졌으면 비켜 있던 이 책만 옛 자리에 남으므로 배치를 다시 맞춘다
          setLandings((count) => {
            return count + 1;
          });
        },
      });

      flight.current = { tween, index, from };
    },
    { dependencies: [openSlug] }
  );

  const hover = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    document.body.style.cursor = 'pointer';
  };
  const unhover = () => {
    document.body.style.cursor = '';
  };

  return (
    <group>
      {groups.map((group, index) => {
        return (
          // 더미 위에 세운 이름표. 눌러도 더미를 누른 것과 같다
          <mesh
            key={group}
            ref={(label) => {
              labels.current[index] = label;
            }}
            position={[0, 0.03, -frontDepth]}
            // 살짝 뒤로 기대 낮은 카메라에서 글자가 정면으로 읽힌다
            rotation-x={-0.25}
            onPointerOver={hover}
            onPointerOut={unhover}
            onClick={(event) => {
              event.stopPropagation();
              onSpread(group);
            }}>
            <boxGeometry args={[0.16, 0.06, 0.004]} />
            {[0, 1, 2, 3, 5].map((face) => {
              return (
                <meshStandardMaterial
                  key={face}
                  attach={`material-${face}`}
                  color='#efe7d6'
                  roughness={0.9}
                />
              );
            })}
            <meshStandardMaterial
              attach='material-4'
              map={labelTextures[index]}
              roughness={0.9}
            />
          </mesh>
        );
      })}
      {topics.map((topic, index) => {
        return (
          // slot이 테이블 위 자리, body가 그 위에서 눕고 기대는 책, shadow는 바닥에 남는 그늘
          <group
            key={topic.title}
            ref={(slot) => {
              slots.current[index] = slot;
            }}
            position={[0, 0, -frontDepth]}>
            <group
              ref={(shadow) => {
                shadows.current[index] = shadow;
              }}
              rotation-x={-Math.PI / 2}
              position={[0, 0.002, 0]}>
              {/* 정점 알파·텍스처 알파는 이 환경에서 안 그려져, 반지름이 다른 원판 셋을 겹쳐 단계적으로 풀리게 한다 */}
              {[0.5, 0.4, 0.28].map((radius) => {
                return (
                  <mesh
                    key={radius}
                    raycast={() => {
                      return;
                    }}>
                    <circleGeometry args={[radius, 32]} />
                    <meshBasicMaterial
                      color='#000000'
                      transparent
                      depthWrite={false}
                      opacity={0}
                    />
                  </mesh>
                );
              })}
            </group>
            <group
              ref={(body) => {
                bodies.current[index] = body;
              }}
              onPointerOver={hover}
              onPointerOut={unhover}
              onClick={(event) => {
                event.stopPropagation();

                // 책 한 권이 테이블을 떠나 있는 동안(돌아오는 중 포함)에는 다른 책을 받지 않는다
                if (flying.current) {
                  return;
                }

                if (topic.group === spreadGroup) {
                  document.body.style.cursor = '';
                  onOpen(topic.slug);
                } else {
                  onSpread(topic.group);
                }
              }}>
              {/* 앞표지. 면 순서는 +x, -x, +y, -y, +z, -z라 위(+y)에만 표지 그림이 간다 */}
              <mesh position={[0, thickness / 2 - board / 2, 0]}>
                <boxGeometry args={[width, board, height]} />
                {[0, 1, 3, 4, 5].map((face) => {
                  return (
                    <meshStandardMaterial
                      key={face}
                      attach={`material-${face}`}
                      color={topic.color}
                      roughness={0.6}
                    />
                  );
                })}
                {/* roughness 0.55는 코팅지의 은은한 광택. 내리면 벽난로 빛이 표지에 번들거린다 */}
                <meshStandardMaterial
                  attach='material-2'
                  map={covers[index]}
                  roughness={0.55}
                />
              </mesh>
              {/* 뒤표지 */}
              <mesh position={[0, -(thickness / 2 - board / 2), 0]}>
                <boxGeometry args={[width, board, height]} />
                <meshStandardMaterial
                  color={topic.color}
                  roughness={0.6}
                />
              </mesh>
              {/* 책등. 왼쪽(-x) 가장자리에서 앞뒤 표지를 잇는다 */}
              <mesh position={[-(width / 2 - board / 2), 0, 0]}>
                <boxGeometry args={[board, thickness, height]} />
                <meshStandardMaterial
                  color={topic.color}
                  roughness={0.6}
                />
              </mesh>
              {/* 속지. 표지보다 3mm 안쪽으로 들어가 표지가 살짝 튀어나온 하드커버 단면이 된다 */}
              <mesh position={[board, 0, 0]}>
                <boxGeometry
                  args={[
                    width - board * 2,
                    thickness - board * 2,
                    height - 0.006,
                  ]}
                />
                <meshStandardMaterial
                  map={pages}
                  roughness={0.95}
                />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}
