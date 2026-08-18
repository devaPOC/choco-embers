import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { path } = await request.json();
    
    // Get IP from headers (works on Vercel/proxies)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
    
    // Create a hash of the IP for privacy
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    await prisma.pageVisit.create({
      data: {
        path: path || '/',
        ipHash,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json({ error: 'Failed to track visit' }, { status: 500 });
  }
}
