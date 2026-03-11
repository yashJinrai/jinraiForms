import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    BarChart3,
    Settings,
    Zap,
    User
} from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { name: 'My Forms', icon: <FileText size={20} />, path: '/forms' },
        { name: 'Responses', icon: <MessageSquare size={20} />, path: '/responses' },
        { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
        { name: 'Profile', icon: <User size={20} />, path: '/profile' },
    ];

    return (
        <aside className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0 z-50">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3713ec] rounded-xl flex items-center justify-center shadow-lg shadow-[#3713ec]/20">
                    <Zap className="text-white fill-white" size={24} />
                </div>
                <div>
                    <h1 className="font-black text-slate-900 text-lg leading-none">JinraiForms</h1>
                    <p className="text-slate-400 text-xs mt-1 font-medium">Pro Plan</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200
              ${isActive
                                ? 'bg-[#3713ec]/10 text-[#3713ec]'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
            `}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Settings */}
            <div className="p-4 border-t border-slate-50">
                <NavLink
                    to="/settings"
                    className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 mb-6
            ${isActive
                            ? 'bg-[#3713ec]/10 text-[#3713ec]'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
          `}
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>

                {/* Storage Card */}
                <div className="bg-slate-50 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Storage Used</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#3713ec] w-3/4 rounded-full" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wide">75% of 10GB</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
