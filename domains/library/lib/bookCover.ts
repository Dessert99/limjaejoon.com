import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

/** 캔버스 전체에 미세한 명암 잡음을 뿌려 종이 결처럼 보이게 한다. */
const grain = (context: CanvasRenderingContext2D, strength: number) => {
  const { width, height } = context.canvas;
  const image = context.getImageData(0, 0, width, height);
  const { data } = image;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * strength;

    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
  }

  context.putImageData(image, 0, 0);
};

/** 제목과 바탕색으로 책 표지를 캔버스에 그려 텍스처로 만든다. 로고가 있으면 받아진 뒤 가운데에 얹어 다시 그린다. */
export const drawBookCover = (
  title: string,
  color: string,
  logo: string | null,
  onRepaint: () => void
): CanvasTexture => {
  const canvas = document.createElement('canvas');

  // 표지 비율 3:4. 해상도를 올리면 글자가 또렷해지는 대신 텍스처 메모리가 는다
  canvas.width = 384;
  canvas.height = 512;

  const context = canvas.getContext('2d');
  const texture = new CanvasTexture(canvas);

  // 캔버스 색은 sRGB라 그대로 두면 three가 선형으로 오해해 표지가 뿌옇게 뜬다
  texture.colorSpace = SRGBColorSpace;

  const paint = (image?: HTMLImageElement) => {
    if (!context) {
      return;
    }

    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 위쪽 밝은 띠. 뒷줄 책은 이 띠만 앞줄 위로 보이므로 제목이 여기 들어간다. 알파를 키우면 띠가 도드라진다
    context.fillStyle = 'rgba(255, 255, 255, 0.14)';
    context.fillRect(0, 0, canvas.width, 120);

    // 책등 쪽 어두운 접힘선. 표지가 평면 색면으로 보이지 않게 한다
    const fold = context.createLinearGradient(0, 0, 40, 0);

    fold.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
    fold.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = fold;
    context.fillRect(0, 0, 40, canvas.height);

    // 가장자리로 갈수록 살짝 어두워지는 비네트. 표지 가운데가 도톰하게 부풀어 보인다
    const vignette = context.createRadialGradient(192, 240, 120, 192, 256, 380);

    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
    context.fillStyle = vignette;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#f5f1e8';
    // 52px은 띠 높이 120 안에 여유 있게 들어가는 크기. 키우면 긴 제목이 오른쪽으로 넘친다
    context.font = '700 52px ui-sans-serif, system-ui, sans-serif';
    context.textBaseline = 'middle';
    context.fillText(title, 44, 62);

    if (image) {
      // 로고 한 변 160px. 키우면 표지를 꽉 채운 포스터가 되고, 줄이면 출판사 마크처럼 작아진다
      const size = 160;
      const tint = document.createElement('canvas');
      const tintContext = tint.getContext('2d');

      tint.width = size;
      tint.height = size;

      if (tintContext) {
        // 브랜드 SVG는 검정이라 그대로 얹으면 표지에 구멍처럼 보인다. 제목과 같은 크림색으로 물들인다
        tintContext.drawImage(image, 0, 0, size, size);
        tintContext.globalCompositeOperation = 'source-in';
        tintContext.fillStyle = '#f5f1e8';
        tintContext.fillRect(0, 0, size, size);
        // 0.85는 로고 진하기. 올리면 제목보다 로고가 먼저 눈에 들어오고, 내리면 표지에 찍힌 박처럼 가라앉는다
        context.globalAlpha = 0.85;
        // 띠 아래 남은 면(120~512)의 한가운데. 가로는 표지 중심 192, 세로는 316이 로고 중심이다
        context.drawImage(tint, 192 - size / 2, 316 - size / 2);
        context.globalAlpha = 1;
      }
    }

    // 12는 결의 세기. 키우면 거친 재생지, 줄이면 매끈한 코팅지가 된다
    grain(context, 12);
  };

  paint();

  if (logo) {
    const image = new Image();

    image.onload = () => {
      paint(image);
      texture.needsUpdate = true;
      onRepaint();
    };
    image.src = `/images/logos/${logo}.svg`;
  }

  return texture;
};

/** 종이 단면의 낱장 줄무늬. 행마다 밝기를 흔든 가로줄이라 옆에서 보면 종이가 겹쳐 쌓인 것처럼 보인다. */
export const drawPageEdges = (): CanvasTexture => {
  const canvas = document.createElement('canvas');

  // 세로 256줄이 두께 3.5cm에 깔리므로 줄 하나가 종이 한두 장 몫이다
  canvas.width = 8;
  canvas.height = 256;

  const context = canvas.getContext('2d');

  if (context) {
    for (let y = 0; y < canvas.height; y += 1) {
      // 밝기 폭 200~236. 폭을 넓히면 줄무늬가 또렷해지고 좁히면 매끈한 면이 된다
      const light = 200 + Math.random() * 36;

      context.fillStyle = `rgb(${light + 12}, ${light + 4}, ${light - 14})`;
      context.fillRect(0, y, canvas.width, 1);
    }
  }

  const texture = new CanvasTexture(canvas);

  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;

  return texture;
};

/** 더미 앞에 세우는 이름표. 크림색 종이에 분류 이름만 찍는다. */
export const drawLabel = (text: string): CanvasTexture => {
  const canvas = document.createElement('canvas');

  canvas.width = 256;
  canvas.height = 96;

  const context = canvas.getContext('2d');

  if (context) {
    context.fillStyle = '#efe7d6';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#2a2622';
    context.font = '700 38px ui-sans-serif, system-ui, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 2);
    grain(context, 10);
  }

  const texture = new CanvasTexture(canvas);

  texture.colorSpace = SRGBColorSpace;

  return texture;
};
