import Message from "@/app/ui/message/message";
import { Suspense } from "react";

export default function Page() {
    return (
        <>
            <Suspense>
                <Message />
            </Suspense>
        </>
    )
}