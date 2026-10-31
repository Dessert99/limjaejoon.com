/** 붙여넣기·드롭에 딸려 온 것 중 이미지만 고른다. */
export const imagesFrom = (files: FileList): File[] => {
  return Array.from(files).filter((file) => {
    return file.type.startsWith('image/');
  });
};
