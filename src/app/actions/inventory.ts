'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createInventoryItem(data: { name: string; type: string; quantity: number; unit: string }) {
  try {
    await prisma.inventoryItem.create({ data });
    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create item' };
  }
}

export async function updateInventoryQuantity(id: string, quantity: number) {
  try {
    await prisma.inventoryItem.update({
      where: { id },
      data: { quantity }
    });
    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update quantity' };
  }
}
