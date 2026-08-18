import { prisma } from '../../../lib/prisma';
import AnalyticsDashboard from './AnalyticsDashboard';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const range = (searchParams.range as string) || '7d';
  
  let daysCount = 7;
  if (range === '30d') daysCount = 30;
  if (range === '90d') daysCount = 90;

  const now = new Date();
  const startDate = new Date(now.getTime() - daysCount * 24 * 60 * 60 * 1000);

  const [
    totalVisitors,
    uniqueVisitorsData,
    totalOrders,
    totalRevenueData,
    recentOrders,
    topProductsData,
  ] = await Promise.all([
    prisma.pageVisit.count({ where: { createdAt: { gte: startDate } } }),
    prisma.pageVisit.groupBy({
      by: ['ipHash'],
      where: { createdAt: { gte: startDate } },
    }),
    prisma.order.count({ where: { createdAt: { gte: startDate } } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: 'completed', createdAt: { gte: startDate } }
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, total: true },
    }),
    prisma.orderItem.groupBy({
      by: ['productName'],
      where: { createdAt: { gte: startDate } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
  ]);

  const uniqueVisitors = uniqueVisitorsData.length;
  const totalRevenue = totalRevenueData._sum.total || 0;

  // Process revenue data for chart
  const days = Array.from({ length: daysCount }, (_, i) => {
    const d = new Date(now.getTime() - (daysCount - 1 - i) * 24 * 60 * 60 * 1000);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dateString: d.toISOString().split('T')[0],
      revenue: 0,
    };
  });

  recentOrders.forEach(order => {
    const orderDate = order.createdAt.toISOString().split('T')[0];
    const day = days.find(d => d.dateString === orderDate);
    if (day) {
      day.revenue += order.total;
    }
  });

  const topProducts = topProductsData.map(item => ({
    name: item.productName,
    quantity: item._sum.quantity || 0,
  }));

  const data = {
    totalVisitors,
    uniqueVisitors,
    totalOrders,
    totalRevenue,
    revenueOverTime: days,
    topProducts,
    currentRange: range,
  };

  return <AnalyticsDashboard data={data} />;
}
