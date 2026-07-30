import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Upload, History, User, Settings } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/chat', label: 'Python Assistant', icon: MessageSquare },
    { path: '/upload', label: 'Upload PDF', icon: Upload },
    { path: '/history', label: 'Chat History', icon: History },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-1.5">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Main Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-lg shadow-indigo-500/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent hover:border-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/60 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          Python Strict Mode
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Questions outside Python documentation will be automatically declined.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
