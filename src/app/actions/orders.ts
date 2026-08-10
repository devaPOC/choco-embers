'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true }
    });

    // If approved, deduct inventory
    // (This is a simplified version; normally we'd check if it was already deducted to prevent double-deduction)
    if (status === 'approved') {
      for (const item of order.items) {
        // Find recipe items for this product
        const recipeItems = await prisma.recipeItem.findMany({
          where: { productId: item.productId }
        });

        for (const ri of recipeItems) {
          // Deduct quantity * recipe quantity
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
    }

    revalidatePath('/admin/orders');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false, error: 'Failed to update order' };
  }
}
