'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CheckoutSchema = z.object({
  customerName: z.string().min(1, 'Name is required'),
  customerPhone: z.string().min(1, 'Phone is required'),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive()
  })).min(1, 'At least one item is required')
});

export async function createOrder(payload: unknown) {
  try {
    const data = CheckoutSchema.parse(payload);
    
    // Fetch products to verify pricing and names securely
    const productIds = data.items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    if (products.length !== productIds.length) {
      return { success: false, error: 'One or more products not found' };
    }

    // Create a map for quick lookup
    const productMap = new Map(products.map(p => [p.id, p]));

    let total = 0;
    const orderItemsToCreate = data.items.map(item => {
      const product = productMap.get(item.productId)!;
      total += product.price * item.quantity;
      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price
      };
    });

    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        total: total,
        items: {
          create: orderItemsToCreate,
        },
      },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/orders');

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Error creating order:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid order data submitted' };
    }
    return { success: false, error: 'Failed to create order' };
  }
}

export async function updateOrderPhone(orderId: string, customerPhone: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { customerPhone }
    });
    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error) {
    console.error('Error updating order phone:', error);
    return { success: false, error: 'Failed to update phone number' };
  }
}

