// import CardWrapper from '@/app/ui/dashboard/cards';
// import RevenueChart from '@/app/ui/dashboard/revenue-chart';
// import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
// import { lusitana } from '@/app/ui/fonts';
// // import { fetchCardData } from '@/app/lib/data';
// import { Suspense } from 'react';
// import {
//     RevenueChartSkeleton,
//     LatestInvoicesSkeleton,
//     CardsSkeleton,
//     CardSkeleton
// } from '@/app/ui/skeletons';
import NavLinksHorizontal from '@/app/ui/dashboard/sidebar-top/nav-links';
import NavLinksRight from '@/app/ui/dashboard/sidebar-right/nav-links';
import WritePost from '@/app/ui/dashboard/write-post/index'
import Posts from '@/app/ui/dashboard/userPosts';

export default async function Page() {
    // const {
    //     numberOfInvoices,
    //     numberOfCustomers,
    //     totalPaidInvoices,
    //     totalPendingInvoices,
    // } = await fetchCardData();
    return (
        <main className='flex'>
            <div className='w-2/3 md:w-full md:px-6 md:mb-[20px]'>
                <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-2">
                    {/* <Suspense fallback={<CardSkeleton />}>
                        <CardWrapper />
                    </Suspense> */}
                    <NavLinksHorizontal />
                </div>
                <div>
                    <WritePost />
                </div>
                <div>
                    <Posts />
                </div>
            </div>
            <div className='w-1/3 md:hidden'>
                <NavLinksRight />
            </div>
        </main>
    );
}