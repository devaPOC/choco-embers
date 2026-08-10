'use server';

import { prisma } from '../../lib/prisma';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key';

export async function sendOtp(email: string) {
  try {
    // Check if email belongs to an admin
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return { success: false, error: 'Unauthorized email' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await prisma.otpCode.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    // Send email via Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Choco Ember Admin" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Your Admin Login OTP',
      text: `Your OTP code is: ${code}. It expires in 10 minutes.`,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error: 'Failed to send OTP. Please check SMTP settings.' };
  }
}

export async function verifyOtp(email: string, code: string) {
  try {
    const otp = await prisma.otpCode.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      return { success: false, error: 'Invalid or expired OTP' };
    }

    // Mark used or delete it
    await prisma.otpCode.delete({ where: { id: otp.id } });

    // Generate JWT
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return { success: true };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: 'Verification failed' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  return { success: true };
}
