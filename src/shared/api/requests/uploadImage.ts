import { api } from "@shared/api/instance";

interface UploadImageParams {
  file: File;
}

export type UploadImageConfig = RequestConfig<UploadImageParams>;

export const uploadImage = async ({ params, config }: UploadImageConfig) => {
  const formData = new FormData();
  formData.append("file", params.file);

  return api.post<{ url: string }>("upload/image", formData, {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data",
      ...config?.headers
    }
  });
};

