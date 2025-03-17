'use client';

import { useState } from 'react';
import Header from '@/app/admin/components/Header';
import Sidebar from '@/app/admin/components/Sidebar';
import Dashboard from '@/app/admin/components/Dashboard';
import Logs from '@/app/admin/components/Logs';
import Settings from '@/app/admin/components/Settings';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Main content */}
      <main className="flex-1 bg-gray-50 md:p-8 pt-20 md:pt-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'logs' && <Logs />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}