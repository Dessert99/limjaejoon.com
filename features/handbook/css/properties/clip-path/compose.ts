const pick = (
  map: Record<string, string>,
  token: string,
  fallback: string
): string => {
  return map[token] ?? fallback;
};

const circleRadiusMap: Record<string, string> = {
  'clip-circle-radius-25': '25%',
  'clip-circle-radius-40': '40%',
  'clip-circle-radius-55': '55%',
};

const circleCenterXMap: Record<string, string> = {
  'clip-circle-cx-35': '35%',
  'clip-circle-cx-50': '50%',
  'clip-circle-cx-65': '65%',
};

const circleCenterYMap: Record<string, string> = {
  'clip-circle-cy-35': '35%',
  'clip-circle-cy-50': '50%',
  'clip-circle-cy-65': '65%',
};

const ellipseRadiusXMap: Record<string, string> = {
  'clip-ellipse-rx-30': '30%',
  'clip-ellipse-rx-45': '45%',
  'clip-ellipse-rx-60': '60%',
};

const ellipseRadiusYMap: Record<string, string> = {
  'clip-ellipse-ry-20': '20%',
  'clip-ellipse-ry-35': '35%',
  'clip-ellipse-ry-50': '50%',
};

const ellipseCenterXMap: Record<string, string> = {
  'clip-ellipse-cx-35': '35%',
  'clip-ellipse-cx-50': '50%',
  'clip-ellipse-cx-65': '65%',
};

const ellipseCenterYMap: Record<string, string> = {
  'clip-ellipse-cy-35': '35%',
  'clip-ellipse-cy-50': '50%',
  'clip-ellipse-cy-65': '65%',
};

const polygonP1XMap: Record<string, string> = {
  'clip-polygon-p1x-0': '0%',
  'clip-polygon-p1x-12': '12%',
  'clip-polygon-p1x-24': '24%',
};

const polygonP1YMap: Record<string, string> = {
  'clip-polygon-p1y-0': '0%',
  'clip-polygon-p1y-10': '10%',
  'clip-polygon-p1y-20': '20%',
};

const polygonP2XMap: Record<string, string> = {
  'clip-polygon-p2x-76': '76%',
  'clip-polygon-p2x-88': '88%',
  'clip-polygon-p2x-100': '100%',
};

const polygonP2YMap: Record<string, string> = {
  'clip-polygon-p2y-0': '0%',
  'clip-polygon-p2y-10': '10%',
  'clip-polygon-p2y-20': '20%',
};

const polygonP3XMap: Record<string, string> = {
  'clip-polygon-p3x-76': '76%',
  'clip-polygon-p3x-88': '88%',
  'clip-polygon-p3x-100': '100%',
};

const polygonP3YMap: Record<string, string> = {
  'clip-polygon-p3y-80': '80%',
  'clip-polygon-p3y-90': '90%',
  'clip-polygon-p3y-100': '100%',
};

const polygonP4XMap: Record<string, string> = {
  'clip-polygon-p4x-0': '0%',
  'clip-polygon-p4x-12': '12%',
  'clip-polygon-p4x-24': '24%',
};

const polygonP4YMap: Record<string, string> = {
  'clip-polygon-p4y-80': '80%',
  'clip-polygon-p4y-90': '90%',
  'clip-polygon-p4y-100': '100%',
};

const pathMXMap: Record<string, string> = {
  'clip-path-mx-16': '16',
  'clip-path-mx-24': '24',
  'clip-path-mx-32': '32',
};

const pathMYMap: Record<string, string> = {
  'clip-path-my-12': '12',
  'clip-path-my-20': '20',
  'clip-path-my-28': '28',
};

const pathL2XMap: Record<string, string> = {
  'clip-path-l2x-184': '184',
  'clip-path-l2x-204': '204',
  'clip-path-l2x-224': '224',
};

const pathL2YMap: Record<string, string> = {
  'clip-path-l2y-12': '12',
  'clip-path-l2y-20': '20',
  'clip-path-l2y-28': '28',
};

const pathL3XMap: Record<string, string> = {
  'clip-path-l3x-184': '184',
  'clip-path-l3x-204': '204',
  'clip-path-l3x-224': '224',
};

const pathL3YMap: Record<string, string> = {
  'clip-path-l3y-124': '124',
  'clip-path-l3y-136': '136',
  'clip-path-l3y-148': '148',
};

const pathL4XMap: Record<string, string> = {
  'clip-path-l4x-16': '16',
  'clip-path-l4x-24': '24',
  'clip-path-l4x-32': '32',
};

const pathL4YMap: Record<string, string> = {
  'clip-path-l4y-124': '124',
  'clip-path-l4y-136': '136',
  'clip-path-l4y-148': '148',
};

const rectTopMap: Record<string, string> = {
  'clip-rect-top-0': '0%',
  'clip-rect-top-8': '8%',
  'clip-rect-top-16': '16%',
};

const rectRightMap: Record<string, string> = {
  'clip-rect-right-84': '84%',
  'clip-rect-right-92': '92%',
  'clip-rect-right-100': '100%',
};

const rectBottomMap: Record<string, string> = {
  'clip-rect-bottom-84': '84%',
  'clip-rect-bottom-92': '92%',
  'clip-rect-bottom-100': '100%',
};

const rectLeftMap: Record<string, string> = {
  'clip-rect-left-0': '0%',
  'clip-rect-left-8': '8%',
  'clip-rect-left-16': '16%',
};

const xywhXMap: Record<string, string> = {
  'clip-xywh-x-0': '0%',
  'clip-xywh-x-8': '8%',
  'clip-xywh-x-16': '16%',
};

const xywhYMap: Record<string, string> = {
  'clip-xywh-y-0': '0%',
  'clip-xywh-y-8': '8%',
  'clip-xywh-y-16': '16%',
};

const xywhWidthMap: Record<string, string> = {
  'clip-xywh-width-68': '68%',
  'clip-xywh-width-84': '84%',
  'clip-xywh-width-100': '100%',
};

const xywhHeightMap: Record<string, string> = {
  'clip-xywh-height-68': '68%',
  'clip-xywh-height-84': '84%',
  'clip-xywh-height-100': '100%',
};

export const composeClipPathCircle = (
  radiusToken: string,
  centerXToken: string,
  centerYToken: string
): string => {
  const radius = pick(circleRadiusMap, radiusToken, '40%');
  const centerX = pick(circleCenterXMap, centerXToken, '50%');
  const centerY = pick(circleCenterYMap, centerYToken, '50%');

  return `circle(${radius} at ${centerX} ${centerY})`;
};

export const composeClipPathEllipse = (
  radiusXToken: string,
  radiusYToken: string,
  centerXToken: string,
  centerYToken: string
): string => {
  const radiusX = pick(ellipseRadiusXMap, radiusXToken, '45%');
  const radiusY = pick(ellipseRadiusYMap, radiusYToken, '35%');
  const centerX = pick(ellipseCenterXMap, centerXToken, '50%');
  const centerY = pick(ellipseCenterYMap, centerYToken, '50%');

  return `ellipse(${radiusX} ${radiusY} at ${centerX} ${centerY})`;
};

export const composeClipPathPolygon = (
  p1xToken: string,
  p1yToken: string,
  p2xToken: string,
  p2yToken: string,
  p3xToken: string,
  p3yToken: string,
  p4xToken: string,
  p4yToken: string
): string => {
  const p1x = pick(polygonP1XMap, p1xToken, '12%');
  const p1y = pick(polygonP1YMap, p1yToken, '10%');
  const p2x = pick(polygonP2XMap, p2xToken, '88%');
  const p2y = pick(polygonP2YMap, p2yToken, '10%');
  const p3x = pick(polygonP3XMap, p3xToken, '88%');
  const p3y = pick(polygonP3YMap, p3yToken, '90%');
  const p4x = pick(polygonP4XMap, p4xToken, '12%');
  const p4y = pick(polygonP4YMap, p4yToken, '90%');

  return `polygon(${p1x} ${p1y}, ${p2x} ${p2y}, ${p3x} ${p3y}, ${p4x} ${p4y})`;
};

export const composeClipPathPath = (
  mxToken: string,
  myToken: string,
  l2xToken: string,
  l2yToken: string,
  l3xToken: string,
  l3yToken: string,
  l4xToken: string,
  l4yToken: string
): string => {
  const mx = pick(pathMXMap, mxToken, '24');
  const my = pick(pathMYMap, myToken, '20');
  const l2x = pick(pathL2XMap, l2xToken, '204');
  const l2y = pick(pathL2YMap, l2yToken, '20');
  const l3x = pick(pathL3XMap, l3xToken, '204');
  const l3y = pick(pathL3YMap, l3yToken, '136');
  const l4x = pick(pathL4XMap, l4xToken, '24');
  const l4y = pick(pathL4YMap, l4yToken, '136');

  return `path("M ${mx} ${my} L ${l2x} ${l2y} L ${l3x} ${l3y} L ${l4x} ${l4y} Z")`;
};

export const composeClipPathRect = (
  topToken: string,
  rightToken: string,
  bottomToken: string,
  leftToken: string
): string => {
  const top = pick(rectTopMap, topToken, '8%');
  const right = pick(rectRightMap, rightToken, '92%');
  const bottom = pick(rectBottomMap, bottomToken, '92%');
  const left = pick(rectLeftMap, leftToken, '8%');

  return `rect(${top} ${right} ${bottom} ${left})`;
};

export const composeClipPathXywh = (
  xToken: string,
  yToken: string,
  widthToken: string,
  heightToken: string
): string => {
  const x = pick(xywhXMap, xToken, '8%');
  const y = pick(xywhYMap, yToken, '8%');
  const width = pick(xywhWidthMap, widthToken, '84%');
  const height = pick(xywhHeightMap, heightToken, '84%');

  return `xywh(${x} ${y} ${width} ${height})`;
};
