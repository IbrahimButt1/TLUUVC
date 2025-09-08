
"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

const data = [
    { name: 'New York', value: 15 },
    { name: 'London', value: 12 },
    { name: 'Bangalore', value: 10 },
    { name: 'Toronto', value: 8 },
    { name: 'Berlin', value: 7 },
    { name: 'Sydney', value: 5 },
    { name: 'Other', value: 43 },
]

export default function TrafficByCityChart() {
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
