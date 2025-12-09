import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";

import { Button } from "@shared/ui/button";
import { cn } from "@shared/lib/utils";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onUpload: (file: File) => Promise<void>;
  className?: string;
}

export const AvatarUpload = ({ currentAvatarUrl, onUpload, className }: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      await onUpload(file);
    } catch (error) {
      console.error("Ошибка загрузки аватара:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("relative", className)}>
      <div
        onClick={handleClick}
        className='group relative cursor-pointer overflow-hidden rounded-full'
      >
        {preview ? (
          <img
            src={preview}
            alt='Аватар'
            className='h-20 w-20 object-cover transition-opacity group-hover:opacity-80'
          />
        ) : (
          <div className='flex h-20 w-20 items-center justify-center bg-primary/10 transition-colors group-hover:bg-primary/20'>
            <Camera className='h-10 w-10 text-primary' />
          </div>
        )}
        <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
          {isUploading ? (
            <Loader2 className='h-6 w-6 animate-spin text-white' />
          ) : (
            <Camera className='h-6 w-6 text-white' />
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className='hidden'
      />
    </div>
  );
};

