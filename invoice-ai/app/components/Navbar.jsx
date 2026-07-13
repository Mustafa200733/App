'use client';

import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    if (!isSupabaseConfigured || !supabase) {
      router.push('/login');
      return;
    }

    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <header className="bg-white shadow px-8 py-5 flex items-center justify-between">
      <h2 className="text-2xl font-semibold">Dashboard</h2>

      <button
        onClick={handleLogout}
        className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
      >
        Uitloggen
      </button>
    </header>
  );
}