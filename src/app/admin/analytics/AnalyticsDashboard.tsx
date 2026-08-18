'use client';

import { Users, UserCheck, ShoppingCart, DollarSign } from 'lucide-react';
import {
  LineChart,
  Line,
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
}

export default function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
  const stats = [
    { name: 'Total Visitors', value: data.totalVisitors, icon: Users },
    { name: 'Unique Visitors', value: data.uniqueVisitors, icon: UserCheck },
    { name: 'Total Orders', value: data.totalOrders, icon: ShoppingCart },
    { name: 'Total Revenue (Completed)', value: `₹${data.totalRevenue.toFixed(2)}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-cream-100">Analytics</h1>
        <p className="mt-2 font-body text-cream-200/70">Metrics and performance overview</p>
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
          <h2 className="font-display text-xl font-semibold text-cream-100 mb-6">Revenue (Last 7 Days)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.revenueOverTime} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A3424" />
                <XAxis dataKey="date" stroke="#E6D5B8" tick={{ fill: '#E6D5B8', opacity: 0.7 }} />
                <YAxis stroke="#E6D5B8" tick={{ fill: '#E6D5B8', opacity: 0.7 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2C1B12', borderColor: '#C9A26A', borderRadius: '8px', color: '#FFF6E5' }} 
                  itemStyle={{ color: '#C9A26A' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#C9A26A" strokeWidth={3} dot={{ r: 4, fill: '#C9A26A' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gold-200/20 bg-choco-400 p-6 shadow-warm-md">
          <h2 className="font-display text-xl font-semibold text-cream-100 mb-6">Top Products (Demand)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topProducts} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A3424" />
                <XAxis dataKey="name" stroke="#E6D5B8" tick={{ fill: '#E6D5B8', opacity: 0.7 }} />
                <YAxis stroke="#E6D5B8" tick={{ fill: '#E6D5B8', opacity: 0.7 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2C1B12', borderColor: '#C9A26A', borderRadius: '8px', color: '#FFF6E5' }}
                  itemStyle={{ color: '#C9A26A' }}
                  cursor={{ fill: '#3E271A' }}
                />
                <Bar dataKey="quantity" fill="#C9A26A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
