'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addTeamMember(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email || !email.includes('@')) {
    return { success: false, error: 'Invalid email address' };
  }

  try {
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
    return { success: false, error: 'Failed to add team member' };
  }
}

export async function removeTeamMember(id: string) {
  try {
    await prisma.admin.delete({
      where: { id },
    });

    revalidatePath('/admin/team');
    return { success: true };
  } catch (error) {
    console.error('Failed to remove team member:', error);
    return { success: false, error: 'Failed to remove team member' };
  }
}
