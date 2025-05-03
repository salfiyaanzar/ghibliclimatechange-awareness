// App.jsx or page.tsx (Next.js)
'use client';
import * as React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Home from './HomePage/page'; // ✅ Import your component
import Auth from './Auth/page';

const FRONTEND_URL = 'https://ghibliclimatechange-awareness.vercel.app';

export default function Page() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if we're on the root path in production
    if (window.location.pathname === '/' && 
        window.location.hostname === 'ghibliclimatechange-awareness.vercel.app') {
      router.push('/HomePage');
    }
  }, [router]);
  
  return <Auth />;
}

