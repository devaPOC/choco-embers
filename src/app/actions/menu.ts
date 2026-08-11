'use server';

import { prisma } from '../../lib/prisma';
import { s3Client, BUCKET_NAME } from '../../lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { requireAdmin } from '../../lib/auth-check';
import { z } from 'zod';

export async function uploadImage(formData: FormData) {
  try {
    await requireAdmin();
    const file = formData.get('file') as File;
    if (!file) return { success: false, error: 'No file provided' };

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Invalid file type. Only images are allowed.' };
    }
    
    // Validate file size (e.g., max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { success: false, error: 'File is too large (max 5MB)' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read',
    });

    await s3Client.send(command);

    const publicUrl = process.env.R2_PUBLIC_DOMAIN
      ? `https://${process.env.R2_PUBLIC_DOMAIN}/${fileName}`
      : `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${fileName}`;

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) return { success: false, error: 'Unauthorized' };
    return { success: false, error: 'Failed to upload image' };
  }
}

const CategorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional()
});

export async function createCategory(payload: unknown) {
  try {
    await requireAdmin();
    const data = CategorySchema.parse(payload);
    await prisma.category.create({ data });
    revalidatePath('/admin/menu');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false, error: 'Invalid category data' };
    if (error instanceof Error && error.message.includes('Unauthorized')) return { success: false, error: 'Unauthorized' };
    return { success: false, error: 'Failed to create category' };
  }
}

const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url('Invalid image URL'),
  accent: z.string().min(1, 'Accent color is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  categoryId: z.string().uuid('Invalid category ID')
});

export async function createProduct(payload: unknown) {
  try {
    await requireAdmin();
    const data = ProductSchema.parse(payload);
    await prisma.product.create({ data });
    revalidatePath('/admin/menu');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false, error: 'Invalid product data' };
    if (error instanceof Error && error.message.includes('Unauthorized')) return { success: false, error: 'Unauthorized' };
    return { success: false, error: 'Failed to create product' };
  }
}

export async function deleteProduct(id: string) {
  try {
    await requireAdmin();
    await prisma.product.delete({ where: { id } });
    revalidatePath('/admin/menu');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) return { success: false, error: 'Unauthorized' };
    return { success: false, error: 'Failed to delete product' };
  }
}

export async function updateProduct(id: string, payload: unknown) {
  try {
    await requireAdmin();
    // Partial product schema for updates (we don't strictly require image to change)
    const UpdateProductSchema = ProductSchema.partial();
    const data = UpdateProductSchema.parse(payload);
    await prisma.product.update({ where: { id }, data });
    revalidatePath('/admin/menu');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false, error: 'Invalid product data' };
    if (error instanceof Error && error.message.includes('Unauthorized')) return { success: false, error: 'Unauthorized' };
    return { success: false, error: 'Failed to update product' };
  }
}
