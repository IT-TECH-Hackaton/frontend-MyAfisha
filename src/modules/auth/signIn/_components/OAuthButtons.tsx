import { useState } from "react";
import { Loader2 } from "lucide-react";

import { PATHS } from "@shared/constants";
import { Button } from "@shared/ui/button";
import { toast } from "@shared/lib/hooks/use-toast";
import { api } from "@shared/api/instance";

type OAuthProvider = "yandex" | "vk";

interface OAuthProviderConfig {
  name: string;
  icon: string;
  color: string;
}

const providers: Record<OAuthProvider, OAuthProviderConfig> = {
  yandex: {
    name: "Яндекс",
    icon: "Я",
    color: "bg-[#FC3F1D] hover:bg-[#FC3F1D]/90 text-white"
  },
  vk: {
    name: "ВКонтакте",
    icon: "VK",
    color: "bg-[#0077FF] hover:bg-[#0077FF]/90 text-white"
  }
};

export const OAuthButtons = () => {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    try {
      setLoadingProvider(provider);
      if (provider === "yandex") {
        const callbackUrl = `${window.location.origin}${PATHS.OAUTH_CALLBACK}`;
        const response = await api.get<{ authUrl: string; state: string } | { fake: boolean; message: string }>(
          "auth/yandex",
          {
            params: { redirect_uri: callbackUrl }
          }
        );
        if ("authUrl" in response.data && response.data.authUrl) {
          window.location.href = response.data.authUrl;
        } else if ("fake" in response.data && response.data.fake) {
          toast({
            title: "Фейковый режим",
            description: "Используйте POST /api/auth/yandex/fake для разработки"
          });
        }
      } else if (provider === "vk") {
        toast({
          className: "bg-yellow-800 text-white hover:bg-yellow-700",
          title: "В разработке",
          description: "Авторизация через ВКонтакте пока не поддерживается"
        });
      }
    } catch (error: any) {
      setLoadingProvider(null);
      toast({
        className: "bg-red-800 text-white hover:bg-red-700",
        title: "Ошибка",
        description: `Не удалось начать авторизацию через ${providers[provider].name}`
      });
    }
  };

  return (
    <div className='space-y-3'>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>Или войдите через</span>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-3'>
        {Object.entries(providers).map(([provider, config]) => (
          <Button
            key={provider}
            type='button'
            variant='outline'
            className={`${config.color} ${loadingProvider === provider ? "opacity-50" : ""}`}
            onClick={() => handleOAuthLogin(provider as OAuthProvider)}
            disabled={loadingProvider !== null}
          >
            {loadingProvider === provider ? (
              <Loader2 className='h-4 w-4 animate-spin text-white' />
            ) : (
              <span className='text-sm font-medium text-white'>{config.icon}</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

