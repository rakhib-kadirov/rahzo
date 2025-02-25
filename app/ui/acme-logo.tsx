'use client'

import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center jus leading-none text-white`}
    >
      {/* <GlobeAltIcon className="h-24 w-24 rotate-[15deg]" /> */}
      <Image src='/logo.png' alt='logotype' width={150} height={150} />
    </div>
  );
}
