// App.jsx or page.tsx (Next.js)
'use client';
import * as React from 'react';
import Home from './HomePage/page'; // ✅ Import your component
import Auth from './Auth/page';

export default function Page() {
  return <Auth />;
}

