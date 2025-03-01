'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function DashboardPreview() {
  const [imgSrc, setImgSrc] = useState('/dashboard-preview.jpg');
  
  const handleError = () => {
    // Fallback to a finance-related image if the dashboard preview isn't available
    setImgSrc('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&h=800&q=80');
  };

  return (
    <Image 
      className="w-full rounded-md"
      src={imgSrc}
      alt="Dashboard Preview"
      width={700}
      height={800}
      priority
      unoptimized
      onError={handleError}
    />
  );
} 