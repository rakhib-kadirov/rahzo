import SideNav from '@/app/ui/dashboard/sidenav';

// export const experimental_ppr = true

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex max-lg:relative justify-items-center h-screen md:flex-row md:overflow-hidden">
            <div className="max-lg:w-full min-md:flex-none w-1/6 max-lg:fixed max-lg:bottom-0">
                <SideNav />
            </div>
            <div className="justify-self-stretch pt-[8] md:overflow-y-auto md:pt-8 w-5/6 md:w-full">{children}</div>
        </div>
    );
}