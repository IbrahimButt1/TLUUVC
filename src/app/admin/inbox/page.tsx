import InboxClient from "@/components/admin/inbox-client";
import InboxList from "@/components/admin/inbox-list";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function InboxPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Email Inbox</h1>
            {/* This client component will handle marking emails as read */}
            <InboxClient />
            
            {/* Suspense boundary for the email list */}
            <Suspense fallback={<InboxSkeleton />}>
                <InboxList />
            </Suspense>
        </div>
    );
}

function InboxSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
        </div>
    )
}
