'use server';

import { prisma } from '../../lib/prisma';
import { s3Client, BUCKET_NAME } from '../../lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) return { success: false, error: 'No file provided' };

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read', // Depends on R2 settings, often R2 buckets are public by default for assets
    });

    await s3Client.send(command);

    // Assuming public access is configured with a custom domain or r2.dev subdomain.
    // For R2, we need the public URL. Let's assume standard format if a custom domain is not set.
    // In production, users should configure a public R2 bucket domain.
    const publicUrl = process.env.R2_PUBLIC_DOMAIN
      ? `https://${process.env.R2_PUBLIC_DOMAIN}/${fileName}`
      : `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${fileName}`; // Fallback, might not be accurate for their specific setup

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: 'Failed to upload image' };
  }
}

export async function createCategory(data: { title: string; subtitle?: string }) {
  try {
    await prisma.category.create({ data });
    revalidatePath('/admin/menu');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create category' };
  }
}

export async function createProduct(data: {
  name: string;
  description: string;
  image: string;
  accent: string;
  price: number;
  categoryId: string;
}) {
  try {
    await prisma.product.create({ data });
    revalidatePath('/admin/menu');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create product' };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath('/admin/menu');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete product' };
  }
}
