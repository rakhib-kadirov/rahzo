import SideNav from '@/app/ui/dashboard/sidenav';

// export const experimental_ppr = true

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-items-center h-screen md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-1/6">
                <SideNav />
            </div>
            <div className="justify-self-stretch pt-[8] md:overflow-y-auto md:pt-8 w-5/6">{children}</div>
        </div>
    );
}