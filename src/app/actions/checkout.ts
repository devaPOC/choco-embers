'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createOrder(data: {
  customerName: string;
  customerPhone: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
}) {
  try {
    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        total: data.total,
        items: {
          create: data.items,
        },
      },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/orders');

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'Failed to create order' };
  }
}
