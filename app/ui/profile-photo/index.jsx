import Image from 'next/image'
import { Suspense } from 'react';

export default function ProfilePhoto() {
    return (
        <Suspense>
            <div className="flex flex-row items-center leading-none text-white">
                {/* <GlobeAltIcon className="h-24 w-24 rotate-[15deg]" /> */}
                <Image
                    src='/amy-burns.png'
                    width={32}
                    height={32}
                    alt='Profile photo'
                />
            </div>
        </Suspense>
    );
}
