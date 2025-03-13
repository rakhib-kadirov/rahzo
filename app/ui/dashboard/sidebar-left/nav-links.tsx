'use client'

import {
  UserGroupIcon,
  HomeIcon,
  ChatBubbleOvalLeftIcon,
  ChatBubbleBottomCenterTextIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  {
    name: 'Главная',
    href: '/dashboard', 
    icon: HomeIcon
  },
  {
    name: 'Сообщения',
    href: '/dashboard/message',
    icon: ChatBubbleOvalLeftIcon,
  },
  {
    name: 'Друзья',
    href: '/dashboard/friends',
    icon: UserGroupIcon
  },
  {
    name: 'Настройки',
    href: '/dashboard/settings',
    icon: Cog8ToothIcon
  },
  {
    name: 'Помощь',
    href: '/dashboard/help',
    icon: ChatBubbleBottomCenterTextIcon
  },
];

export default function NavLinks() {
  const pathname = usePathname()
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex lg:h-[48px] grow items-center justify-center lg:gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 max-lg:bg-white md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden lg:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
