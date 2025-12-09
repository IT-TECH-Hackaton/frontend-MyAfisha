import { useMutation } from "@tanstack/react-query";

import type { UploadImageConfig } from "../requests/uploadImage";
import { uploadImage } from "../requests/uploadImage";

export const useUploadImageMutation = (
  settings?: MutationSettings<UploadImageConfig, typeof uploadImage>
) =>
  useMutation({
    mutationKey: ["uploadImage"],
    mutationFn: ({ params, config }) =>
      uploadImage({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

