import type React from 'react';
import Sidebar from '@/components/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        {children}
      </main>
    </div>
  );
}
