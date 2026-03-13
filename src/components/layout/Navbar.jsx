import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Bell, ChevronDown, LogOut, Menu, FileText, Loader2, ArrowRight, BarChart2, MessageSquare, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { getImageUrl } from '../../lib/utils';

const Navbar = ({ onToggleSidebar }) => {
    const { user, loading, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const [unreadCount, setUnreadCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef(null);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const res = await api.get('/notifications/unread-count');
                if (res.data.success) setUnreadCount(res.data.data.count);
            } catch (e) { /* silent */ }
        };
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000); // 30s poll
        return () => clearInterval(interval);
    }, []);

    // Close search popover on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch forms for search when focused
    useEffect(() => {
        if (isSearchFocused && searchData.length === 0) {
            setIsSearching(true);
            api.get('/forms')
                .then(res => {
                    if (res.data.success) setSearchData(res.data.data);
                })
                .catch(() => {})
                .finally(() => setIsSearching(false));
        }
    }, [isSearchFocused]);

    const q = searchQuery.toLowerCase();
    const filteredForms = searchData
        .filter(f => f.title?.toLowerCase().includes(q))
        .slice(0, 5);
        
    const quickLinks = [];
    if (q && ('analytics'.includes(q) || 'stats'.includes(q))) {
        quickLinks.push({ id: 'ql-analytics', title: 'Analytics Dashboard', path: '/analytics', icon: <BarChart2 size={18} /> });
    }
    if (q && ('responses'.includes(q) || 'submissions'.includes(q))) {
        quickLinks.push({ id: 'ql-responses', title: 'All Responses', path: '/responses', icon: <MessageSquare size={18} /> });
    }
    if (q && ('dashboard'.includes(q) || 'home'.includes(q))) {
        quickLinks.push({ id: 'ql-dashboard', title: 'Main Dashboard', path: '/', icon: <LayoutDashboard size={18} /> });
    }

    return (
        <header className="h-20 bg-white dark:bg-[#1a1829] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
            {/* Mobile Menu Toggle */}
            <button 
                onClick={onToggleSidebar}
                className="lg:hidden p-2 mr-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
                <Menu size={24} />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl hidden md:block relative z-50" ref={searchRef}>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#3713ec] transition-colors" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        placeholder="Search forms, responses or analytics..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-transparent focus:border-[#3713ec]/20 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-[#3713ec]/5 rounded-2xl text-slate-600 dark:text-slate-200 font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all outline-none text-sm"
                    />
                </div>

                {/* Search Dropdown */}
                {isSearchFocused && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-[#1e1c2e] border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 py-3 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        {isSearching ? (
                            <div className="flex items-center justify-center py-6 text-slate-400">
                                <Loader2 className="animate-spin" size={24} />
                            </div>
                        ) : searchQuery.length > 0 && filteredForms.length === 0 && quickLinks.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm font-bold text-slate-400">
                                No results found for "{searchQuery}"
                            </div>
                        ) : (
                            <div className="flex flex-col max-h-[400px] overflow-y-auto no-scrollbar">
                                {searchQuery.length === 0 && (
                                    <div className="px-4 pb-2 mb-2 border-b border-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                        Recent Forms
                                    </div>
                                )}
                                
                                {/* Quick Links */}
                                {quickLinks.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-4 py-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                            Quick Links
                                        </div>
                                        {quickLinks.map(link => (
                                            <button
                                                key={link.id}
                                                onClick={() => {
                                                    navigate(link.path);
                                                    setIsSearchFocused(false);
                                                    setSearchQuery('');
                                                }}
                                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                                        {link.icon}
                                                    </div>
                                                    <h4 className="text-sm font-bold text-slate-700 group-hover:text-orange-600 transition-colors">{link.title}</h4>
                                                </div>
                                                <ArrowRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Forms */}
                                {filteredForms.length > 0 && (
                                    <>
                                        {quickLinks.length > 0 && <div className="h-px bg-slate-50 my-2" />}
                                        <div className="px-4 py-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                            Forms
                                        </div>
                                        {filteredForms.map(form => (
                                            <button
                                                key={form._id}
                                                onClick={() => {
                                                    navigate(`/forms/create?id=${form._id}`);
                                                    setIsSearchFocused(false);
                                                    setSearchQuery('');
                                                }}
                                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group text-left"
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-10 h-10 rounded-xl bg-[#3713ec]/5 text-[#3713ec] flex items-center justify-center shrink-0 group-hover:bg-[#3713ec] group-hover:text-white transition-colors">
                                                        <FileText size={18} />
                                                    </div>
                                                    <div className="truncate">
                                                        <h4 className="text-sm font-bold text-slate-700 truncate group-hover:text-[#3713ec] transition-colors">{form.title}</h4>
                                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{form.status}</p>
                                                    </div>
                                                </div>
                                                <ArrowRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all shrink-0" />
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4 sm:gap-6">
                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleTheme}
                    className="relative p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#3713ec] dark:hover:text-[#7c6bff] hover:bg-[#3713ec]/5 dark:hover:bg-[#3713ec]/10 rounded-xl transition-all group overflow-hidden"
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    id="theme-toggle-btn"
                >
                    <div className={`transition-all duration-500 ${isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0 absolute inset-0 flex items-center justify-center'}`}>
                        {isDark && <Sun size={22} />}
                    </div>
                    <div className={`transition-all duration-500 ${!isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0 absolute inset-0 flex items-center justify-center'}`}>
                        {!isDark && <Moon size={22} />}
                    </div>
                </button>

                {/* Notifications */}
                <button 
                    onClick={() => navigate('/notifications')}
                    className="relative p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#3713ec] dark:hover:text-[#7c6bff] hover:bg-[#3713ec]/5 dark:hover:bg-[#3713ec]/10 rounded-xl transition-all group"
                >
                    <Bell size={22} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 border-2 border-white dark:border-[#1a1829] rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* User Profile */}
                {!loading && (
                    <div className="relative">
                        <div
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-4 pl-6 border-l border-slate-100 dark:border-slate-700 hover:opacity-80 transition-opacity cursor-pointer"
                        >
                            <div className="text-right hidden sm:block">
                                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 leading-none">{user?.name || user?.email?.split('@')[0]}</h3>
                                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">{user?.role || 'Member'}</p>
                            </div>
                            <div className="w-11 h-11 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl border-2 border-white shadow-xl shadow-indigo-500/10 flex items-center justify-center overflow-hidden">
                                <img
                                    src={getImageUrl(user?.profile_image || `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=3713ec&color=fff&bold=true`)}
                                    alt="User"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <ChevronDown className={`text-slate-400 dark:text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} size={16} />
                        </div>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1e1c2e] border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-black/30 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                <NavLink
                                    to="/profile"
                                    className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-[#3713ec] transition-all"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    Profile Settings
                                </NavLink>
                                <NavLink
                                    to="/settings"
                                    className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-[#3713ec] transition-all"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    Workspace Settings
                                </NavLink>
                                <div className="h-px bg-slate-100 dark:bg-slate-700 my-2" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
