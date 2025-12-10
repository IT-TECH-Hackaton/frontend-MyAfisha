export const getImageUrl = (imageUrl?: string | null): string => {
  if (!imageUrl) {
    return "/placeholder.svg";
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  const baseURL = import.meta.env.VITE_BASE_API_URL || import.meta.env.BASE_API_URL || "http://localhost:8081/api";
  
  if (imageUrl.startsWith("/")) {
    const baseWithoutApi = baseURL.replace(/\/api\/?$/, "");
    return `${baseWithoutApi}${imageUrl}`;
  }

  return imageUrl;
};

