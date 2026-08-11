'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '../../lib/auth-check';
import { z } from 'zod';

const UpdateOrderSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(['pending', 'approved', 'completed', 'cancelled', 'refunded'])
});

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await requireAdmin();

    const data = UpdateOrderSchema.parse({ orderId, status });
    const { orderId: validOrderId, status: validStatus } = data;

    // Get current order state to determine if we need to deduct or restore
    const currentOrder = await prisma.order.findUnique({
      where: { id: validOrderId },
      include: { items: true }
    });

    if (!currentOrder) {
      return { success: false, error: 'Order not found' };
    }

    const previousStatus = currentOrder.status;

    const updatedOrder = await prisma.order.update({
      where: { id: validOrderId },
      data: { status: validStatus },
      include: { items: true }
    });

    const isNowApproved = validStatus === 'approved';
    const wasApprovedBefore = previousStatus === 'approved';

    // We only need to adjust inventory if the approval state changes
    if (isNowApproved && !wasApprovedBefore) {
      // Deduct inventory
      for (const item of updatedOrder.items) {
        const recipeItems = await prisma.recipeItem.findMany({
          where: { productId: item.productId }
        });

        for (const ri of recipeItems) {
          await prisma.inventoryItem.update({
            where: { id: ri.inventoryItemId },
            data: {
              quantity: {
                decrement: item.quantity * ri.quantity
              }
            }
          });
        }
      }
    } else if (!isNowApproved && wasApprovedBefore) {
      // Restore inventory (e.g. was approved, now cancelled/refunded/pending)
      for (const item of updatedOrder.items) {
        const recipeItems = await prisma.recipeItem.findMany({
          where: { productId: item.productId }
        });

        for (const ri of recipeItems) {
          await prisma.inventoryItem.update({
            where: { id: ri.inventoryItemId },
            data: {
              quantity: {
                increment: item.quantity * ri.quantity
              }
            }
          });
        }
      }
    }

    revalidatePath('/admin/orders');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error updating order:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid order data submitted' };
    }
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { success: false, error: 'Unauthorized' };
    }
    return { success: false, error: 'Failed to update order' };
  }
}
