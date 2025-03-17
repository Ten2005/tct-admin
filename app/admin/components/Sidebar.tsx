'use client';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 p-4 z-10 shadow-lg md:shadow-none transition-transform duration-300 ease-in-out overflow-y-auto`}>
      <h1 className="hidden md:block text-xl font-bold mb-6 border-b border-gray-200 pb-4 text-gray-800">TCT Dashboard</h1>
      <nav className="mt-16 md:mt-0">
        <ul className="space-y-2">
          <li>
            <button 
              className={`w-full text-left p-3 rounded-lg flex items-center transition-colors duration-200 ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-gray-600 to-gray-500 text-white shadow-sm' : 'hover:bg-gray-100 text-gray-800'}`}
              onClick={() => {
                setActiveTab('dashboard');
                setSidebarOpen(false);
              }}
            >
              <span className="font-medium">ダッシュボード</span>
            </button>
          </li>
          {/* <li>
            <button 
              className={`w-full text-left p-3 rounded-lg flex items-center transition-colors duration-200 ${activeTab === 'logs' ? 'bg-gradient-to-r from-gray-600 to-gray-500 text-white shadow-sm' : 'hover:bg-gray-100 text-gray-800'}`}
              onClick={() => {
                setActiveTab('logs');
                setSidebarOpen(false);
              }}
            >
              <span className="font-medium">ログ</span>
            </button>
          </li> */}
          <li>
            <button 
              className={`w-full text-left p-3 rounded-lg flex items-center transition-colors duration-200 ${activeTab === 'settings' ? 'bg-gradient-to-r from-gray-600 to-gray-500 text-white shadow-sm' : 'hover:bg-gray-100 text-gray-800'}`}
              onClick={() => {
                setActiveTab('settings');
                setSidebarOpen(false);
              }}
            >
              <span className="font-medium">設定</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}