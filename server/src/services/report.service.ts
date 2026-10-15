import prisma from '../config/prisma.js';

export class ReportService {
  /**
   * Admin Overview metrics
   */
  static async getOverviewMetrics() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      ordersToday,
      completedOrders,
      pendingOrders,
      revenueResult,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: { createdAt: { gte: todayStart } },
      }),
      prisma.order.count({
        where: { status: 'COMPLETED' },
      }),
      prisma.order.count({
        where: { status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'] } },
      }),
      // Revenue strictly from COMPLETED orders or PAID orders, NOT cancelled
      prisma.order.aggregate({
        where: {
          status: { not: 'CANCELLED' },
          OR: [{ paymentStatus: 'PAID' }, { status: 'COMPLETED' }],
        },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          status: true,
          paymentStatus: true,
          paymentMethod: true,
          total: true,
          createdAt: true,
        },
      }),
    ]);

    const totalRevenuePaise = revenueResult._sum.total || 0;

    return {
      totalOrders,
      ordersToday,
      completedOrders,
      pendingOrders,
      totalRevenuePaise,
      totalRevenueRupees: (totalRevenuePaise / 100).toFixed(2),
      recentOrders,
    };
  }

  /**
   * Detailed reports by date range (e.g., last 7 days, 30 days, or custom)
   */
  static async getSalesReport(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { not: 'CANCELLED' },
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Breakdown by payment method
    let razorpayCount = 0;
    let razorpayRevenuePaise = 0;
    let codCount = 0;
    let codRevenuePaise = 0;

    // Daily trends map
    const dailyMap: Record<string, { date: string; orders: number; revenuePaise: number }> = {};
    const itemSalesMap: Record<string, { name: string; quantity: number; revenuePaise: number }> = {};

    for (const order of orders) {
      const dateKey = order.createdAt.toISOString().slice(0, 10);
      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = { date: dateKey, orders: 0, revenuePaise: 0 };
      }
      dailyMap[dateKey].orders += 1;

      const isCollected = order.paymentStatus === 'PAID' || order.status === 'COMPLETED';
      if (isCollected) {
        dailyMap[dateKey].revenuePaise += order.total;

        if (order.paymentMethod === 'RAZORPAY') {
          razorpayCount += 1;
          razorpayRevenuePaise += order.total;
        } else {
          codCount += 1;
          codRevenuePaise += order.total;
        }
      }

      // Aggregate item counts
      for (const item of order.items) {
        if (!itemSalesMap[item.itemName]) {
          itemSalesMap[item.itemName] = {
            name: item.itemName,
            quantity: 0,
            revenuePaise: 0,
          };
        }
        itemSalesMap[item.itemName].quantity += item.quantity;
        if (isCollected) {
          itemSalesMap[item.itemName].revenuePaise += item.subtotal;
        }
      }
    }

    const trends = Object.values(dailyMap);
    const topItems = Object.values(itemSalesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    return {
      periodDays: days,
      totalOrdersInPeriod: orders.length,
      paymentMethodBreakdown: {
        razorpay: {
          count: razorpayCount,
          revenuePaise: razorpayRevenuePaise,
        },
        cod: {
          count: codCount,
          revenuePaise: codRevenuePaise,
        },
      },
      dailyTrends: trends,
      topSellingItems: topItems,
    };
  }

  /**
   * Export sales report as CSV
   */
  static async exportOrdersCSV(days = 30): Promise<string> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate } },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Customer Phone',
      'Order Type',
      'Status',
      'Payment Method',
      'Payment Status',
      'Subtotal (INR)',
      'Discount (INR)',
      'Tax (INR)',
      'Delivery Fee (INR)',
      'Total (INR)',
    ];

    const rows = orders.map((o: any) => [
      `"${o.orderNumber}"`,
      `"${o.createdAt.toISOString()}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerPhone}"`,
      `"${o.orderType}"`,
      `"${o.status}"`,
      `"${o.paymentMethod}"`,
      `"${o.paymentStatus}"`,
      (o.subtotal / 100).toFixed(2),
      (o.discount / 100).toFixed(2),
      (o.tax / 100).toFixed(2),
      (o.deliveryFee / 100).toFixed(2),
      (o.total / 100).toFixed(2),
    ]);

    return [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
  }
}
