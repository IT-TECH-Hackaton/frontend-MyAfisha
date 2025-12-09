import { LogoutButton } from "@modules/auth";

import { useGetProfileQuery } from "../api/hooks/useGetProfileQuery";

export const ProfilePage = () => {
  const { data, isPending } = useGetProfileQuery({});

  if (isPending) return <div className=''>Загрузка...</div>;

  return (
    <div className='flex min-h-svh'>
      <div className='m-auto'>
        <div className='flex gap-5'>
          <h1 className='text-2xl'>Привет {data?.data.firstName}</h1>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};
