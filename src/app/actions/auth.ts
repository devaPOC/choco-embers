'use server';

import { prisma } from '../../lib/prisma';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function sendOtp(email: string) {
  try {
    // Check if email belongs to an admin
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return { success: false, error: 'Unauthorized email' };
    }

    // Rate limiting: check if OTP was requested recently (e.g. 1 minute)
    const recentOtp = await prisma.otpCode.findFirst({
      where: {
        email,
        createdAt: {
          gt: new Date(Date.now() - 60 * 1000)
        }
      }
    });

    if (recentOtp) {
      return { success: false, error: 'Please wait 60 seconds before requesting another code' };
    }

    // Secure random generation
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.otpCode.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

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
    return { success: false, error: 'Failed to send OTP. Please try again.' };
  }
}

export async function verifyOtp(email: string, code: string) {
  try {
    const otp = await prisma.otpCode.findFirst({
      where: {
        email,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      return { success: false, error: 'No active OTP found or it has expired' };
    }

    if (otp.attempts >= 5) {
      await prisma.otpCode.delete({ where: { id: otp.id } });
      return { success: false, error: 'Too many attempts. Please request a new code.' };
    }

    if (otp.code !== code) {
      // Increment attempts
      await prisma.otpCode.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 } }
      });
      return { success: false, error: 'Invalid OTP' };
    }

    // Valid OTP
    await prisma.otpCode.delete({ where: { id: otp.id } });

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is missing');
      return { success: false, error: 'Server configuration error' };
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });
    
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
