'use client'

import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/sidebar-left/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import Search from '@/app/ui/search'
import { serverSignOut } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import { Suspense } from 'react';

interface User {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
}

export default function SideNav() {
  const { data: session } = useSession()
  const user = session?.user as User

  return (
    <div className="flex h-full flex-col px-3 pt-4 md:px-2 pt-[8] md:pt-[20px]">
      <Link
        // className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        className='flex items-center justify-center max-lg:hidden'
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <div className='flex py-8 max-lg:hidden'>
        <Suspense fallback={<div>Загрузка...</div>}>
          <Search />
        </Suspense>
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:w-[40%] md:m-auto md:rounded-[8px] md:space-x-0 max-lg:bg-white">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-100 md:hidden md:block"></div>
        <form
          action={async () => {
            await serverSignOut(); // Вызов серверной функции
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-between gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium max-lg:bg-white hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <div className="hidden md:hidden md:block">
              <p>{user?.first_name}</p>
            </div>
            <ArrowRightStartOnRectangleIcon className="w-6" />
          </button>
        </form>
      </div>
    </div >
  );
}
