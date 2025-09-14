'use client';

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
    query?: Record<string, string>;
    onPageChange?: (page: number) => void;
}

export default function PaginationControls({
    currentPage,
    totalPages,
    basePath,
    query = {},
    onPageChange,
}: PaginationControlsProps) {
    const router = useRouter();
    const pathname = usePathname();

    const changePage = (newPage: number) => {
        if (onPageChange) {
            onPageChange(newPage);
        } else {
            // Filter out unnecessary params to prevent URL bloat
            const filteredQuery: Record<string, string> = {};
            for (const key in query) {
                if (key !== 'status' && key !== 'value' && query[key]) {
                    filteredQuery[key] = query[key]!;
                }
            }

            const params = new URLSearchParams(filteredQuery);
            params.set("page", String(newPage));

            const search = params.toString();
            const queryStr = search ? `?${search}` : "";

            router.push(`${pathname}${queryStr}`);
        }
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
            </Button>

            <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
            </span>

            <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    );
}
