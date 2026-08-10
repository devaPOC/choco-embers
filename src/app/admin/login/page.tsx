'use client';

import { useState } from 'react';
import { sendOtp, verifyOtp } from '../../actions/auth';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await sendOtp(email);
    if (res.success) {
      setStep('otp');
    } else {
      setError(res.error || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await verifyOtp(email, code);
    if (res.success) {
      router.push('/admin');
    } else {
      setError(res.error || 'Invalid OTP');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-choco-600 px-4">
      <div className="w-full max-w-md rounded-2xl bg-choco-400 p-8 shadow-warm-lg border border-gold-200/20">
        <h1 className="mb-6 text-center font-display text-3xl font-semibold text-cream-100">
          Admin Login
        </h1>

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-center font-body text-sm text-red-200">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block font-label text-sm uppercase tracking-wider text-gold-200">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gold-200/30 bg-choco-500 p-4 font-body text-cream-100 placeholder-cream-200/30 focus:border-gold-200 focus:outline-none focus:ring-1 focus:ring-gold-200"
                placeholder="admin@chocoember.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gold-200 py-4 font-label text-sm font-semibold uppercase tracking-wider text-choco-600 transition-all hover:bg-gold-100 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <p className="text-center font-body text-sm text-cream-200/70">
              We've sent a 6-digit code to {email}.
            </p>
            <div>
              <label htmlFor="code" className="mb-2 block font-label text-sm uppercase tracking-wider text-gold-200">
                OTP Code
              </label>
              <input
                id="code"
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-xl border border-gold-200/30 bg-choco-500 p-4 text-center font-display text-2xl tracking-widest text-cream-100 focus:border-gold-200 focus:outline-none focus:ring-1 focus:ring-gold-200"
                placeholder="000000"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gold-200 py-4 font-label text-sm font-semibold uppercase tracking-wider text-choco-600 transition-all hover:bg-gold-100 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full font-label text-xs uppercase tracking-wider text-cream-200/50 hover:text-gold-200"
            >
              Try another email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
