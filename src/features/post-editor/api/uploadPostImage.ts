/** post editor image upload client — admin token 을 header 로 전달한다 */
export type UploadPostImageResponse = {
  url: string;
  path: string;
};

/** 이미지 파일을 admin upload API 로 전송하고 public URL 을 받는다 */
export const uploadPostImage = async (
  file: File,
  token: string
): Promise<UploadPostImageResponse> => {
  const body = new FormData();
  body.set('file', file);

  const response = await fetch('/api/admin/images', {
    method: 'POST',
    headers: { 'x-admin-post-token': token },
    body,
  });

  if (!response.ok) {
    throw new Error(`Image upload failed: ${response.status}`);
  }

  return response.json() as Promise<UploadPostImageResponse>;
};
