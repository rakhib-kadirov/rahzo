import AcmeLogo from "@/app/ui/acme-logo"
import LoginForm from "@/app/ui/login-form"
import Link from "next/link"
import { Suspense } from 'react';

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="flex justify-center mx-auto flex w-full max-w-[400px] flex-col p-4 md:-mt-32">
                <div className="flex h-32 w-full items-center justify-center md:h-32">
                    <div className="flex text-white justify-center md:w-36">
                        <AcmeLogo />
                    </div>
                </div>
                <Suspense>
                    <LoginForm />
                </Suspense>
                <p className="flex justify-center">или&nbsp;<Link href='/register' className='text-blue-500'>зарегистрироваться</Link></p>
            </div>
        </main>
    )
}