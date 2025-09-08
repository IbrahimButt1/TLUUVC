"use client"

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

const initialData = [
    { name: 'Karachi', value: 25 },
    { name: 'Lahore', value: 20 },
    { name: 'Islamabad', value: 15 },
    { name: 'Faisalabad', value: 10 },
    { name: 'Rawalpindi', value: 8 },
    { name: 'Multan', value: 5 },
    { name: 'Other', value: 17 },
];

export default function TrafficByCityChart() {
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
                const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
                let newValue = item.value + change;
                if (newValue < 3) newValue = 3; // Keep a base value
                remaining -= newValue;
                return { ...item, value: newValue };
            });
            // Adjust the 'Other' category to make the total 100
            newData[newData.length - 1].value = Math.max(0, remaining);
            return newData;
        });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={data} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis 
                dataKey="name" 
                type="category" 
                width={80} 
                tickLine={false} 
                axisLine={false} 
                fontSize={12}
            />
            <Tooltip
                cursor={{fill: 'hsl(var(--muted))'}}
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                }}
                formatter={(value: number) => [`${value}%`, 'Traffic']}
            />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}
