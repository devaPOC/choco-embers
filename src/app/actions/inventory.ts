'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '../../lib/auth-check';
import { z } from 'zod';

const CreateInventoryItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['ingredient', 'packaging']),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  unit: z.string().min(1, 'Unit is required')
});

export async function createInventoryItem(payload: unknown) {
  try {
    await requireAdmin();
    const data = CreateInventoryItemSchema.parse(payload);
    
    await prisma.inventoryItem.create({ data });
    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false, error: 'Invalid inventory data' };
    if (error instanceof Error && error.message.includes('Unauthorized')) return { success: false, error: 'Unauthorized' };
    return { success: false, error: 'Failed to create item' };
  }
}

export async function updateInventoryQuantity(id: string, quantity: number) {
  try {
    await requireAdmin();
    // Validate arguments manually or via Zod
    if (typeof quantity !== 'number' || quantity < 0) {
      throw new z.ZodError([]);
    }
    
    await prisma.inventoryItem.update({
      where: { id },
      data: { quantity }
    });
    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) return { success: false, error: 'Unauthorized' };
    return { success: false, error: 'Failed to update quantity' };
  }
}
