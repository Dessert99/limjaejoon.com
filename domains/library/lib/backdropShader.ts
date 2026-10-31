/** 화면 전체 사각형에 uv를 깔아 주는 정점 셰이더. */
export const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/** 배경 사진을 cover로 잘라 center를 중심으로 zoom만큼 확대하는 조각 셰이더. */
export const fragment = /* glsl */ `
  uniform sampler2D map;
  uniform vec2 cover;
  uniform float zoom;
  uniform vec2 center;
  varying vec2 vUv;
  void main() {
    vec2 uv = (center + (vUv - 0.5) / zoom - 0.5) * cover + 0.5;
    gl_FragColor = texture2D(map, uv);
  }
`;
