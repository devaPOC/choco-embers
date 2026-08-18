'use client';

import { Users, UserCheck, ShoppingCart, DollarSign, Calendar } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface AnalyticsData {
  totalVisitors: number;
  uniqueVisitors: number;
  totalOrders: number;
  totalRevenue: number;
  revenueOverTime: { date: string; dateString: string; revenue: number }[];
  topProducts: { name: string; quantity: number }[];
  currentRange: string;
}

export default function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set('range', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const stats = [
    { name: 'Visitors', value: data.totalVisitors, icon: Users },
    { name: 'Unique Visitors', value: data.uniqueVisitors, icon: UserCheck },
    { name: 'Orders', value: data.totalOrders, icon: ShoppingCart },
    { name: 'Revenue', value: `₹${data.totalRevenue.toFixed(2)}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-cream-100">Analytics</h1>
          <p className="mt-2 font-body text-cream-200/70">Metrics and performance overview</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-gold-200/20 bg-choco-400 px-4 py-2 shadow-warm-md">
          <Calendar className="h-5 w-5 text-gold-200" />
          <select
            value={data.currentRange}
            onChange={handleRangeChange}
            className="bg-transparent font-label text-sm font-semibold uppercase tracking-wider text-cream-100 focus:outline-none cursor-pointer"
          >
            <option value="7d" className="bg-choco-500">Last 7 Days</option>
            <option value="30d" className="bg-choco-500">Last 30 Days</option>
            <option value="90d" className="bg-choco-500">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="rounded-2xl border border-gold-200/20 bg-choco-400 p-6 shadow-warm-md">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-200/10 text-gold-200">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-label text-xs uppercase tracking-wider text-cream-200/50">{stat.name}</p>
                  <p className="font-display text-3xl font-semibold text-cream-100">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gold-200/20 bg-choco-400 p-6 shadow-warm-md">
          <h2 className="font-display text-xl font-semibold text-cream-100 mb-6">Revenue Overview</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueOverTime} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A26A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C9A26A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A3424" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#E6D5B8" 
                  tick={{ fill: '#E6D5B8', opacity: 0.7, fontSize: 12 }} 
                  tickMargin={10}
                  minTickGap={20}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#E6D5B8" 
                  tick={{ fill: '#E6D5B8', opacity: 0.7, fontSize: 12 }} 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2C1B12', borderColor: '#C9A26A', borderRadius: '8px', color: '#FFF6E5', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }} 
                  itemStyle={{ color: '#C9A26A', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C9A26A" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gold-200/20 bg-choco-400 p-6 shadow-warm-md">
          <h2 className="font-display text-xl font-semibold text-cream-100 mb-6">Top Products (Demand)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topProducts} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A3424" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#E6D5B8" 
                  tick={{ fill: '#E6D5B8', opacity: 0.7, fontSize: 12 }} 
                  tickMargin={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#E6D5B8" 
                  tick={{ fill: '#E6D5B8', opacity: 0.7, fontSize: 12 }} 
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2C1B12', borderColor: '#C9A26A', borderRadius: '8px', color: '#FFF6E5', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#C9A26A', fontWeight: 'bold' }}
                  cursor={{ fill: '#3E271A', opacity: 0.4 }}
                />
                <Bar dataKey="quantity" fill="#C9A26A" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
