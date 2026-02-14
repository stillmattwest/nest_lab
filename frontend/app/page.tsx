'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setStatus(`Connected! Monolith says: ${data.database}`))
      .catch(() => setStatus('Failed to connect to Monolith.'));
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans p-8 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Nest Lab: Phase 2
        </h1>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 p-5 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            Status
          </p>
          <p className="text-foreground text-lg">
            {status}
          </p>
        </div>
      </div>
    </main>
  );
}