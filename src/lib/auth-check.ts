import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    
    // Verify admin exists in DB
    const admin = await prisma.admin.findUnique({
      where: { email: decoded.email }
    });

    if (!admin) {
      throw new Error('Unauthorized: Admin not found');
    }

    return admin;
  } catch (error) {
    throw new Error('Unauthorized');
  }
}
