'use client';

import { useMemo } from 'react';
import { Bar, XAxis, YAxis, ResponsiveContainer, ComposedChart, Line, Tooltip, Legend, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import type { ManifestEntry } from '@/lib/manifest';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ManifestChartProps {
    entries: ManifestEntry[];
}

const chartConfig = {
  credit: {
    label: "Credit",
    color: "hsl(var(--chart-2))",
  },
  debit: {
    label: "Debit",
    color: "hsl(var(--chart-1))",
  },
  balance: {
    label: "Balance",
    color: "hsl(var(--primary))",
  }
} satisfies ChartConfig;

export default function ManifestChart({ entries }: ManifestChartProps) {
    const chartData = useMemo(() => {
        let runningBalance = 0;
        // Entries are sorted descending, so we reverse for chronological order
        const sortedEntries = [...entries].reverse();

        return sortedEntries.map(entry => {
            if (entry.type === 'credit') {
                runningBalance += entry.amount;
            } else {
                runningBalance -= entry.amount;
            }
            return {
                date: format(new Date(entry.date), 'MMM d'),
                credit: entry.type === 'credit' ? entry.amount : 0,
                debit: entry.type === 'debit' ? entry.amount : 0,
                balance: runningBalance,
            };
        });
    }, [entries]);

    if (chartData.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No data to display in the chart yet.</p>;
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis 
                        dataKey="date" 
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        fontSize={12}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        fontSize={12}
                        tickFormatter={(value) => `$${value}`}
                    />
                     <ChartTooltip
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                    <Legend />
                    <Bar dataKey="credit" fill="var(--color-credit)" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="debit" fill="var(--color-debit)" radius={[4, 4, 0, 0]} stackId="a" />
                    <Line type="monotone" dataKey="balance" stroke="var(--color-balance)" strokeWidth={2} dot={false} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
