
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This page just redirects to the client management page, as a ledger
// is only meaningful for a specific client.
export default function LedgerRedirectPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/admin/client-balances');
    }, [router]);

    return (
        <div className="flex items-center justify-center h-full">
            <p>Redirecting to client management...</p>
        </div>
    );
}
