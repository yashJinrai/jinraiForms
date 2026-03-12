import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../lib/api';
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    BarChart3,
    Settings,
    Zap,
    User,
    Bell,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import logo from '../../assets/images/JLogobg.png';

const Sidebar = ({ isOpen, isCollapsed, onToggleCollapse, onClose }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const res = await api.get('/notifications/unread-count');
                if (res.data.success) setUnreadCount(res.data.data.count);
            } catch (e) { /* silent */ }
        };
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const navItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { name: 'My Forms', icon: <FileText size={20} />, path: '/forms' },
        { name: 'Responses', icon: <MessageSquare size={20} />, path: '/responses' },
        { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
        { name: 'Notifications', icon: <Bell size={20} />, path: '/notifications', badge: unreadCount },
        { name: 'Profile', icon: <User size={20} />, path: '/profile' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                ${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0 z-[70] transition-all duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
            {/* Toggle Button - Desktop Only */}
            <button 
                onClick={onToggleCollapse}
                className="hidden lg:flex absolute -right-3.5 top-10 w-7 h-7 bg-white border border-slate-100 rounded-full items-center justify-center shadow-md hover:text-[#3713ec] transition-colors z-[80]"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Logo */}
            <div className={`flex items-center gap-3 transition-all duration-300 overflow-hidden ${isCollapsed ? 'p-4 justify-center' : 'p-6'}`}>
                <div className="w-10 h-10 bg-white rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm">
                    <img src={logo} alt="JinraiForms" className="w-full h-full object-contain p-1" />
                </div>
                <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 pointer-events-none' : 'opacity-100 w-auto'}`}>
                    <h1 className="font-black text-slate-900 text-lg leading-none whitespace-nowrap">JinraiForms</h1>
                    <p className="text-slate-400 text-xs mt-1 font-medium whitespace-nowrap">Pro Plan</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className={`flex-1 space-y-2 transition-all duration-300 ${isCollapsed ? 'px-3 py-6' : 'px-4 py-6'}`}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        title={isCollapsed ? item.name : ''}
                        className={({ isActive }) => `
              flex items-center rounded-xl font-bold transition-all duration-200 overflow-hidden
              ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'}
              ${isActive
                                ? 'bg-[#3713ec]/10 text-[#3713ec]'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
            `}
                        onClick={() => {
                            if (window.innerWidth < 1024) onClose();
                        }}
                    >
                        <div className="flex-shrink-0">{item.icon}</div>
                        <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                            {item.name}
                        </span>
                        {item.badge > 0 && !isCollapsed && (
                            <span className="ml-auto px-2 py-0.5 bg-[#3713ec] text-white text-[10px] font-black rounded-full min-w-[20px] text-center transition-opacity">
                                {item.badge > 99 ? '99+' : item.badge}
                            </span>
                        )}
                        {item.badge > 0 && isCollapsed && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-[#3713ec] rounded-full border border-white" />
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Settings */}
            <div className={`border-t border-slate-50 transition-all duration-300 ${isCollapsed ? 'p-3' : 'p-4'}`}>
                <NavLink
                    to="/settings"
                    title={isCollapsed ? "Settings" : ""}
                    className={({ isActive }) => `
            flex items-center rounded-xl font-bold transition-all duration-200 mb-6 overflow-hidden
            ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'}
            ${isActive
                            ? 'bg-[#3713ec]/10 text-[#3713ec]'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
          `}
                >
                    <div className="flex-shrink-0"><Settings size={20} /></div>
                    <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                        Settings
                    </span>
                </NavLink>

                {/* Storage Card */}
                <div className={`bg-slate-50 rounded-2xl transition-all duration-300 overflow-hidden ${isCollapsed ? 'h-0 opacity-0 p-0' : 'p-4 opacity-100'}`}>
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
        </>
    );
};

export default Sidebar;
