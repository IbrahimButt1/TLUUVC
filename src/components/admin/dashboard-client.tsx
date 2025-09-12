'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { ArrowRight, BookUser } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { SiteSettings } from '@/lib/site-settings';
import type { ManifestEntry } from '@/lib/manifest';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';


interface Stat {
  title: string;
  value: string | number;
  href: string;
  className?: string;
}

interface DashboardClientProps {
  settings: SiteSettings;
  stats: Stat[];
  financialStats: Stat[];
  lastManifestEntry: ManifestEntry | null;
}

export default function DashboardClient({
  settings,
  stats,
  financialStats,
  lastManifestEntry
}: DashboardClientProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="grid gap-8">
      <Card
        className={cn(
          'transition-all duration-500 ease-out',
          isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        )}
      >
        <CardHeader>
          <CardTitle className="text-2xl">Welcome, {settings.username}</CardTitle>
          <CardDescription>
            You are the manager of The LUU Visa Consultant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Here is a summary of your website's content and financials. Select an option from
            the left to manage it.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link href={stat.href} key={stat.title}>
            <div
              className={cn(
                'transition-all duration-500 ease-out',
                isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            </div>
          </Link>
        ))}
      </div>
      
       <div>
        <h2 className="text-2xl font-bold mb-4">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {financialStats.map((stat, index) => (
            <Link href={stat.href} key={stat.title}>
                <div
                className={cn(
                    'transition-all duration-500 ease-out',
                    isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                )}
                style={{ transitionDelay: `${(stats.length + index) * 100}ms` }}
                >
                <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform">
                    <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                        </CardTitle>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    </CardHeader>
                    <CardContent>
                    <p className={cn("text-3xl font-bold", stat.className)}>{stat.value}</p>
                    </CardContent>
                </Card>
                </div>
            </Link>
            ))}
        </div>
      </div>

       <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
         <Card
            className={cn(
                'transition-all duration-500 ease-out',
                isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            )}
            style={{ transitionDelay: `${(stats.length + financialStats.length) * 100}ms` }}
        >
            <CardHeader>
                <CardTitle>Last Manifest Entry</CardTitle>
                <CardDescription>The most recent transaction recorded.</CardDescription>
            </CardHeader>
            <CardContent>
                {lastManifestEntry ? (
                     <div className="flex items-center space-x-4">
                        <div className="p-3 bg-muted rounded-full">
                           <BookUser className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{lastManifestEntry.clientName}</p>
                            <p className="text-sm text-muted-foreground">{lastManifestEntry.description}</p>
                        </div>
                        <div className="text-right">
                           <p className={cn("font-bold text-lg", lastManifestEntry.type === 'credit' ? 'text-green-600' : 'text-red-600')}>
                             {lastManifestEntry.type === 'credit' ? '+' : '-'}${lastManifestEntry.amount.toFixed(2)}
                           </p>
                           <p className="text-xs text-muted-foreground">{format(new Date(lastManifestEntry.date), 'MMM d, yyyy')}</p>
                        </div>
                     </div>
                ) : (
                    <p className="text-muted-foreground">No manifest entries have been recorded yet.</p>
                )}
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
