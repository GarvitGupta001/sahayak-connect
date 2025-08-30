"use client";
import React from 'react';

// Reusable glassmorphic card wrapper
// Props: className (extra classes), as (element type), children, padding toggle
export default function GlassCard({ as:Tag='div', className='', noPad=false, children }) {
  return (
    <Tag
      className={`rounded-2xl bg-white/65 backdrop-blur-sm border border-slate-200/80 shadow-sm shadow-slate-900/5 ${noPad ? '' : 'p-4'} ${className}`}
    >
      {children}
    </Tag>
  );
}