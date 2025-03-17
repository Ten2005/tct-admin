'use client';

import { Menu, X } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 bg-white py-2 px-4 h-14 z-20 flex justify-between items-center shadow-md">
      <h1 className="font-bold text-gray-800">TCT Dashboard</h1>
      <button 
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}