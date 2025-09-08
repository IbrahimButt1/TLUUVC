"use client"

import { useState, useEffect } from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts"

const initialData = [
  { name: 'Pakistan', value: 45, color: 'hsl(var(--chart-1))' },
  { name: 'India', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'UK', value: 15, color: 'hsl(var(--chart-3))' },
  { name: 'Canada', value: 10, color: 'hsl(var(--chart-4))' },
  { name: 'Other', value: 5, color: 'hsl(var(--chart-5))' },
]

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (!percent) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export default function TrafficByCountryChart() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    // Simulate dynamic data fetching
    const interval = setInterval(() => {
        setData(prevData => {
            const total = 100;
            let remaining = total;
            const newData = prevData.map((item, index) => {
                if (index === prevData.length - 1) {
                    return { ...item, value: remaining };
                }
                const change = Math.floor(Math.random() * 6) - 3; // -3 to +3
                let newValue = item.value + change;
                if (newValue < 5) newValue = 5; // Keep a base value
                remaining -= newValue;
                return { ...item, value: newValue };
            });
            // Adjust 'Other' to make total 100
            newData[newData.length - 1].value = Math.max(0, remaining);
            return newData;
        });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            <Tooltip
                cursor={{fill: 'hsl(var(--muted))'}}
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                }}
            />
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
            >
                {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-sm mt-4">
            {data.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span>{item.name}</span>
                </div>
            ))}
        </div>
    </div>
  )
}
