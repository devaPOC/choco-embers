import { prisma } from '../../../lib/prisma';
import AnalyticsDashboard from './AnalyticsDashboard';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalVisitors,
    uniqueVisitorsData,
    totalOrders,
    totalRevenueData,
    recentOrders,
    topProductsData,
  ] = await Promise.all([
    prisma.pageVisit.count(),
    prisma.pageVisit.groupBy({
      by: ['ipHash'],
    }),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: 'completed' }
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, total: true },
    }),
    prisma.orderItem.groupBy({
      by: ['productName'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
  ]);

  const uniqueVisitors = uniqueVisitorsData.length;
  const totalRevenue = totalRevenueData._sum.total || 0;

  // Process revenue data for chart
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short' }),
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
  };

  return <AnalyticsDashboard data={data} />;
}
