// import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
// import Table from '@/app/ui/invoices/table';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
// import { fetchInvoicesPages } from '@/app/lib/data';
import { Metadata } from 'next';
import Profile from '@/app/ui/profile/profile';
import Link from 'next/link';
import { auth } from '@/auth';
import { useSession } from 'next-auth/react';

export const metadata: Metadata = {
    title: 'Profile',
}

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string,
        page?: string
    }>
}) {
    // const totalPages = await fetchInvoicesPages(query)

    return (
        <div >
            <div className="flex w-full items-center gap-6">
                <h1 className={`${lusitana.className} text-2xl`}>Profile</h1>
            </div>
            {/* <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search invoices..." />
            </div> */}
            <Suspense>
                <Profile />
            </Suspense>
            {/* <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div> */}
        </div>
    );
}