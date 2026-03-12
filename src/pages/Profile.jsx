import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import {
    User,
    Mail,
    Bell,
    Shield,
    CreditCard,
    CheckCircle2,
    Camera,
    MapPin,
    Link as LinkIcon,
    Twitter,
    Github,
    Linkedin,
    ExternalLink,
    Loader2
} from 'lucide-react';

const Profile = () => {
    const { user: rawUser, loading } = useAuth();
    
    // Transform raw user data to fit component structure
    const userData = {
        name: rawUser?.name || '',
        email: rawUser?.email || '',
        role: rawUser?.role === 'admin' ? 'Administrator' : 'User',
        location: rawUser?.location || 'Not Specified',
        website: rawUser?.website || 'Not Specified',
        bio: rawUser?.bio || 'No bio provided yet.',
        twitter: rawUser?.twitter || '',
        github: rawUser?.github || '',
        linkedin: rawUser?.linkedin || '',
        profile_image: rawUser?.profile_image || `https://ui-avatars.com/api/?name=${rawUser?.name || 'User'}&background=FF8A65&color=fff&bold=true`
    };

    const stats = [
        { label: 'Forms Created', value: '24' },
        { label: 'Total Responses', value: '1.2k' },
        { label: 'Completed', value: '88%' }
    ];

    const badges = [
        { name: 'Beta Tester', color: 'bg-indigo-100 text-indigo-700' },
        { name: 'Power User', color: 'bg-emerald-100 text-emerald-700' },
        { name: 'Pro Plan', color: 'bg-amber-100 text-amber-700' }
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="h-[60vh] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-[#3713ec] animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Backdrop */}
                <div className="relative h-48 sm:h-64 rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#3713ec] via-[#6366f1] to-[#a855f7] shadow-2xl shadow-indigo-500/20">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    <button className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white font-bold transition-all border border-white/20 text-xs sm:text-sm">
                        <Camera size={18} />
                        <span>Update Cover</span>
                    </button>
                </div>

                {/* Profile Main Content */}
                <div className="relative -mt-16 sm:-mt-24 px-4 sm:px-8 pb-10">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                        {/* Profile Left Sidebar */}
                        <div className="w-full lg:w-80 shrink-0 space-y-6">
                            {/* Profile Image Card */}
                            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50">
                                <div className="relative -mt-16 sm:-mt-20 flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="w-32 h-32 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden bg-white">
                                            <img
                                                src={userData.profile_image}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center space-y-1 mb-8">
                                    <h2 className="text-2xl font-black text-slate-900 leading-tight">{userData.name}</h2>
                                    <p className="text-slate-500 font-bold text-sm tracking-wide uppercase">{userData.role}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-8">
                                    {stats.map((stat) => (
                                        <div key={stat.label} className="text-center p-2 rounded-2xl bg-slate-50 border border-slate-100">
                                            <div className="text-sm font-black text-[#3713ec]">{stat.value}</div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                        <MapPin size={18} className="text-[#3713ec]" />
                                        <span>{userData.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm" title="Login Email">
                                        <Mail size={18} className="text-[#3713ec]" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase text-slate-400 font-black tracking-tighter leading-none mb-0.5">Login Email</span>
                                            <span>{userData.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                        <LinkIcon size={18} className="text-[#3713ec]" />
                                        <span>{userData.website !== 'Not Specified' ? userData.website.replace('https://', '') : 'No Website'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Social Connect */}
                            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 px-1">Social Networks</h3>
                                <div className="space-y-4">
                                    {userData.twitter && (
                                        <a href={`https://twitter.com/${userData.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#3713ec]/30 hover:bg-white transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                                                    <Twitter size={20} fill="currentColor" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">Twitter</span>
                                            </div>
                                            <ExternalLink size={16} className="text-slate-300 group-hover:text-sky-500" />
                                        </a>
                                    )}
                                    {userData.github && (
                                        <a href={`https://github.com/${userData.github}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#3713ec]/30 hover:bg-white transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                                                    <Github size={20} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">GitHub</span>
                                            </div>
                                            <ExternalLink size={16} className="text-slate-300 group-hover:text-slate-900" />
                                        </a>
                                    )}
                                    {!userData.twitter && !userData.github && (
                                        <p className="text-xs text-slate-400 font-bold text-center py-2">No social links added yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Content Area */}
                        <div className="flex-1 space-y-10">
                            {/* Bio Section */}
                            <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-slate-200/40 border border-slate-50">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">My Biography</h2>
                                        <p className="text-slate-500 font-bold text-sm">Your professional story and background.</p>
                                    </div>
                                    <a href="/settings" className="w-full sm:w-auto text-center px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl transition-all text-sm">
                                        Update Details
                                    </a>
                                </div>
                                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                    {userData.bio}
                                </p>
                                <div className="flex flex-wrap gap-3 mt-8">
                                    {badges.map((badge) => (
                                        <span key={badge.name} className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${badge.color}`}>
                                            {badge.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Activity Section */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-slate-900">Recent Activity</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex gap-4 group hover:shadow-lg transition-all">
                                            <div className="w-12 h-12 rounded-2xl bg-[#3713ec]/5 flex items-center justify-center shrink-0 group-hover:bg-[#3713ec] transition-colors">
                                                <CheckCircle2 size={24} className="text-[#3713ec] group-hover:text-white transition-colors" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-black text-slate-900 text-sm">JinraiForms System</h4>
                                                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Automated</p>
                                                <p className="text-slate-500 text-sm font-medium">Your profile is 100% complete and ready for professional use.</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 font-black rounded-2xl border border-dashed border-slate-200 transition-all">
                                    View Detailed Activity Log
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Profile;
