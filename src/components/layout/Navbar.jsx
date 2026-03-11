import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Bell, ChevronDown, Loader2 } from 'lucide-react';
import api from '../../lib/api';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/auth/valid_user');
                if (res.data.success) {
                    setUser(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching navbar user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#3713ec] transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search forms, responses or analytics..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent focus:border-[#3713ec]/20 focus:bg-white focus:ring-4 focus:ring-[#3713ec]/5 rounded-2xl text-slate-600 font-bold placeholder:text-slate-400 transition-all outline-none text-sm"
                    />
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button className="relative p-2.5 bg-slate-50 text-slate-500 hover:text-[#3713ec] hover:bg-[#3713ec]/5 rounded-xl transition-all group">
                    <Bell size={22} />
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
                </button>

                {/* User Profile */}
                {loading ? (
                    <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
                        <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
                    </div>
                ) : (
                    <NavLink to="/profile" className="flex items-center gap-4 pl-6 border-l border-slate-100 hover:opacity-80 transition-opacitygroup">
                        <div className="text-right hidden sm:block">
                            <h3 className="text-sm font-black text-slate-900 leading-none">{user?.name || user?.email?.split('@')[0]}</h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">{user?.role || 'Member'}</p>
                        </div>
                        <div className="relative group cursor-pointer">
                            <div className="w-11 h-11 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl border-2 border-white shadow-xl shadow-indigo-500/10 flex items-center justify-center overflow-hidden">
                                <img
                                    src={user?.profile_image || `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=3713ec&color=fff&bold=true`}
                                    alt="User"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <ChevronDown className="text-slate-400" size={16} />
                    </NavLink>
                )}
            </div>
        </header>
    );
};

export default Navbar;
