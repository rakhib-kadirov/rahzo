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
import Friends from '@/app/ui/friends/index';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const links = [
  {
    name: 'Посты',
    href: '/dashboard/posts',
    amount: 0
  },
  {
    name: 'Друзья',
    href: '/',
    amount: 0
  },
];

const aboutMe = [
  {
    paragraph: 'About'
  }
]

const contact = [
  {
    phone: '+79998887766',
    email: 'info@rahzo.com',
    otherLinks: 'www.rahzo.com'
  }
]

export default function NavLinksRight() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch('/api/auth/userPosts')
        const response = await data.json()

        if (Array.isArray(response.posts)) {
          setPosts(response.posts);
        } else {
          console.error("Unexpected data format:", response);
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className='justify-self-center grid gap-6'>
      <div className='justify-center text-center'>
        {/* {infoName.map((info) => {
          return ( */}
        <div key={session?.user?.first_name}>
          <div className='flex justify-center text-center'>
            <Link href={`/dashboard/profile/${session?.user?.id}`}>
              <h4 className='text-[20px] font-semibold text-gray-700'>{session?.user?.first_name} {session?.user?.last_name}</h4>
            </Link>
          </div>
          {/* <h6>{info.href}</h6>
              <h6>{info.location}</h6> */}
        </div>
        {/* )
        })} */}
      </div>
      <div className='flex justify-around'>
        <Link
          href='/dashboard/posts'
          className={clsx(
            "h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 w-auto text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
            {
              "bg-sky-100 text-blue-600": pathname === links[0].href
            }
          )}
        >
          <p key={posts.length} className="hidden md:block text-center text-[20px] font-bold text-gray-700">{posts.length}</p>
          <p key='Посты' className="hidden md:block text-center text-[16px] font-bold text-gray-700">Посты</p>
        </Link>
        <div className='w-px h-py bg-blue-300' />
        <Link
          href={links[1].href}
          className={clsx(
            "h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 w-auto text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
            {
              "bg-sky-100 text-blue-600": pathname === links[1].href
            }
          )}
        >
          <p key={links[1].amount} className="hidden md:block text-center text-[20px] font-bold text-gray-700">{links[1].amount}</p>
          <p key={links[1].name} className="hidden md:block text-center text-[16px] font-bold text-gray-700">{links[1].name}</p>
        </Link>
      </div>
      <div className='grid gap-2'>
        <h4 className='text-[16px] font-semibold text-gray-700'>О себе</h4>
        {aboutMe.map((about) => {
          return (
            <p className='text-[#475569]' key={about.paragraph}>{about.paragraph}</p>
          )
        })}
      </div>
      <div className='grid gap-2'>
        <h4 className='text-[16px] font-semibold text-gray-700'>Контактная информация</h4>
        {contact.map((contact) => {
          return (
            <div className='text-[#475569]' key={contact.phone}>
              <p key={contact.phone}>{contact.phone}</p>
              <p key={contact.email}>{contact.email}</p>
              <p key={contact.otherLinks}>{contact.otherLinks}</p>
            </div>
          )
        })}
      </div>
      <div>
        <Friends />
      </div>
    </div>
  );
}
