'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '../../lib/auth-check';
import { z } from 'zod';

const AddTeamMemberSchema = z.object({
  email: z.string().email('Invalid email address')
});

export async function addTeamMember(formData: FormData) {
  try {
    await requireAdmin();

    const payload = {
      email: formData.get('email')
    };
    
    const data = AddTeamMemberSchema.parse(payload);
    const { email } = data;

    const existing = await prisma.admin.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: false, error: 'Team member already exists' };
    }

    await prisma.admin.create({
      data: { email },
    });

    revalidatePath('/admin/team');
    return { success: true };
  } catch (error) {
    console.error('Failed to add team member:', error);
    if (error instanceof z.ZodError) return { success: false, error: 'Invalid email address' };
    if (error instanceof Error && error.message.includes('Unauthorized')) return { success: false, error: 'Unauthorized' };
    return { success: false, error: 'Failed to add team member' };
  }
}

export async function removeTeamMember(id: string) {
  try {
    const adminUser = await requireAdmin();
    
    const userToRemove = await prisma.admin.findUnique({ where: { id } });
    if (!userToRemove) {
      return { success: false, error: 'Team member not found' };
    }

    if (userToRemove.email === adminUser.email) {
      return { success: false, error: 'You cannot remove yourself' };
    }

    if (userToRemove.isSuperAdmin) {
      return { success: false, error: 'This admin cannot be removed' };
    }

    await prisma.admin.delete({
      where: { id },
    });

    revalidatePath('/admin/team');
    return { success: true };
  } catch (error) {
    console.error('Failed to remove team member:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) return { success: false, error: 'Unauthorized' };
    return { success: false, error: 'Failed to remove team member' };
  }
}
