// import Pagination from '@/app/ui/invoices/pagination';
// import Table from '@/app/ui/invoices/table';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
// import { fetchInvoicesPages } from '@/app/lib/data';
import { Metadata } from 'next';
import Message from '@/app/ui/message/message';

export const metadata: Metadata = {
    title: 'Profile',
}

export default async function Page() {

    return (
        <div >
            <div className="flex w-full items-center gap-6">
                <h1 className={`${lusitana.className} text-2xl`}>Profile</h1>
            </div>
            {/* <Suspense> */}
                <Message />
            {/* </Suspense> */}
        </div>
    );
}