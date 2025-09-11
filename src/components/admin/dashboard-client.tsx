"use client";

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from '@/lib/utils';
import type { SiteSettings } from '@/lib/site-settings';

interface Stat {
    title: string;
    value: number;
    href: string;
}

interface DashboardClientProps {
    settings: SiteSettings;
    stats: Stat[];
}

export default function DashboardClient({ settings, stats }: DashboardClientProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="grid gap-8">
            <Card className={cn(
                "transition-all duration-500 ease-out",
                 isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            )}>
                <CardHeader>
                    <CardTitle className="text-2xl">Welcome, {settings.username}</CardTitle>
                    <CardDescription>
                        You are the manager of The LUU Visa Consultant.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Here is a summary of your website's content. Select an option from the left to manage it.</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Link href={stat.href} key={stat.title}>
                        <div className={cn(
                            "transition-all duration-500 ease-out",
                            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                        )} style={{transitionDelay: `${index * 100}ms`}}>
                        <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
