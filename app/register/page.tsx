import AcmeLogo from "@/app/ui/acme-logo"
// import Login from "@/app/ui/login/index"
import Link from "next/link"
import Register from "../ui/register"

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="flex justify-center mx-auto flex w-full max-w-[400px] flex-col p-4 md:-mt-32">
                <div className="flex h-32 w-full items-center justify-center md:h-32">
                    <div className="flex text-white justify-center md:w-36">
                        <AcmeLogo />
                    </div>
                </div>
                <Register />
                <p className="flex justify-center">или&nbsp;<Link href='/login' className='text-blue-500'>войти</Link></p>
            </div>
        </main>
    )
}