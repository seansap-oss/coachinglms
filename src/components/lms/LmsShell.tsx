'use client';
import { type ReactNode } from 'react';
import LmsHeader from '@/components/lms/LmsHeader';

export default function LmsShell({ children }: { children: ReactNode }) {
  return (
    <>
      <LmsHeader />
      <div className="flex-1">{children}</div>
    </>
  );
}
