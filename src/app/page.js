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
  
  // No auto-redirect - we want users to start at the Auth page
  // The Auth page will redirect authenticated users to HomePage after login
  
  return <Auth />;
}

