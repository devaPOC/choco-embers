'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track public paths (exclude admin)
    if (pathname && !pathname.startsWith('/admin')) {
      fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: pathname }),
      }).catch((err) => console.error('Failed to track visit', err));
    }
  }, [pathname]);

  return null;
}
