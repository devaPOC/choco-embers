import { prisma } from '../src/lib/prisma';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function main() {
  const email = "vineelvishnu12@gmail.com";

  console.log(`Upserting admin with email: ${email}`);
  
  // 1. Create the admin in DB
  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email },
  });
  
  console.log('Admin created/updated successfully:', admin);

  // 2. Send email
  console.log('Setting up nodemailer transporter...');
  
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    throw new Error("Missing SMTP_EMAIL or SMTP_PASSWORD in .env file.");
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const htmlContent = `
  <div style="background-color: #f0ebe3; padding: 40px 20px; font-family: 'Literata', Georgia, serif; color: #1c1208; text-align: center;">
    <img src="https://choco-embers.vercel.app/images/logo.png" alt="Choco Embers Logo" style="width: 150px; margin-bottom: 20px;" />
    <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 16px; box-shadow: 0 4px 16px 0 rgba(0,0,0,0.1); border-top: 4px solid #d4a851;">
      <h1 style="font-family: 'Playfair Display', Georgia, serif; color: #1c1208; font-size: 28px; margin-top: 0;">Welcome to Choco Embers!</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #2e2014; text-align: left;">
        Hello,<br/><br/>
        An admin account has been created for you at Choco Embers. We are thrilled to have you on board!
      </p>
      <div style="background-color: #faf7f2; border-left: 4px solid #4a6a58; padding: 15px; margin: 25px 0; text-align: left;">
        <h3 style="font-family: 'Manrope', system-ui, sans-serif; margin-top: 0; color: #3a5a48; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Admin Instructions</h3>
        <ul style="margin-bottom: 0; padding-left: 20px; font-size: 15px; color: #2e2014; line-height: 1.5;">
          <li>Go to the <a href="https://choco-embers.vercel.app/admin" style="color: #b8903a; font-weight: bold; text-decoration: none;">Admin Login Page</a>.</li>
          <li>Enter your email: <strong>vineelvishnu12@gmail.com</strong>.</li>
          <li>Check your inbox for a One-Time Password (OTP).</li>
          <li>Enter the OTP to access the admin dashboard.</li>
        </ul>
      </div>
      <p style="font-size: 16px; line-height: 1.6; color: #2e2014; text-align: left;">
        If you have any questions, feel free to reach out to the technical team.
      </p>
      <a href="https://choco-embers.vercel.app/admin" style="display: inline-block; background-color: #d4a851; color: #100a03; padding: 12px 24px; text-decoration: none; font-family: 'Manrope', system-ui, sans-serif; font-weight: bold; border-radius: 8px; margin-top: 20px;">Access Dashboard</a>
    </div>
    <p style="font-size: 12px; color: #8a7f66; margin-top: 30px; font-family: 'Manrope', system-ui, sans-serif;">
      &copy; ${new Date().getFullYear()} Choco Embers. All rights reserved.
    </p>
  </div>
  `;

  console.log(`Sending email to ${email}...`);
  const info = await transporter.sendMail({
    from: `"Choco Embers Admin" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: 'Welcome to Choco Embers! (Admin Instructions)',
    html: htmlContent,
  });

  console.log('Email sent successfully! Message ID:', info.messageId);
}

main()
  .catch((e) => {
    console.error('Error in script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
