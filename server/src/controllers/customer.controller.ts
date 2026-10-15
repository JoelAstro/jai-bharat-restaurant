import { Request, Response } from 'express';
import prisma from '../config/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class CustomerController {
  static async getCustomers(req: Request, res: Response) {
    try {
      const search = req.query.search as string;
      const whereClause: any = { role: 'CUSTOMER' };

      if (search && search.trim()) {
        whereClause.OR = [
          { name: { contains: search.trim() } },
          { email: { contains: search.trim() } },
          { phone: { contains: search.trim() } },
        ];
      }

      const customers = await prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
          _count: {
            select: { orders: true },
          },
          orders: {
            where: { status: { not: 'CANCELLED' } },
            select: { total: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const formatted = customers.map((c: any) => {
        const totalSpendPaise = c.orders.reduce((acc: number, o: any) => acc + o.total, 0);
        return {
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          createdAt: c.createdAt,
          ordersCount: c._count.orders,
          totalSpendPaise,
          totalSpendRupees: (totalSpendPaise / 100).toFixed(2),
        };
      });

      return sendSuccess(res, formatted);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async getCustomerById(req: Request, res: Response) {
    try {
      const customer = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
          addresses: true,
          orders: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              orderNumber: true,
              total: true,
              status: true,
              paymentStatus: true,
              createdAt: true,
            },
          },
        },
      });

      if (!customer) {
        return sendError(res, 'Customer not found', 404);
      }

      return sendSuccess(res, customer);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }
}
