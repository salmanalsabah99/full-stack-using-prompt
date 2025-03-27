'use client';

import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard'

export default function Home() {
  const router = useRouter();
  return <Dashboard />
} 