'use client';
import { prettyPrintObject } from '@/lib/prettyPrintObject';
import { useSession } from 'next-auth/react';

export default function Profile() {
  const { data: session } = useSession();

  return <h2>{prettyPrintObject(session ?? {})}</h2>;
}
