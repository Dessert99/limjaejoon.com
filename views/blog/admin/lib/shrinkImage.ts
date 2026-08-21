/** 올리기 전 브라우저에서 줄인다. 최적화 계층이 없어 올린 크기가 그대로 독자에게 간다. */
export const shrinkImage = async (file: File, name: string): Promise<File> => {
  const original = new File([file], `${name}.${file.type.split('/')[1]}`, {
    type: file.type,
  });

  try {
    const bitmap = await createImageBitmap(file);
    // 본문 폭이 54rem이라 1600이면 레티나 2배까지 덮는다. 줄이면 확대했을 때 뭉개진다
    const scale = Math.min(1, 1600 / bitmap.width);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    if (!context) {
      return original;
    }

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
      // 0.85 밑으로 내리면 캡처 속 글자부터 뭉개지는 게 보인다
      canvas.toBlob(resolve, 'image/webp', 0.85);
    });

    if (!blob) {
      return original;
    }

    const shrunk = new File([blob], `${name}.webp`, { type: 'image/webp' });

    // 이미 잘 압축된 파일은 다시 인코딩하면 오히려 커진다
    return shrunk.size < original.size ? shrunk : original;
  } catch {
    // 변환이 막혀도 붙여넣기는 되게 원본을 그대로 보낸다
    return original;
  }
};
