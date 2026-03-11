import React from 'react';
import StatCard from './StatCard';
import FormCard from './FormCard';
import {
    Eye,
    Send,
    Zap,
    Plus,
    LayoutGrid,
    List,
    Calendar,
    Briefcase,
    Mail,
    MessageSquare
} from 'lucide-react';

const Dashboard = () => {
    const stats = [
        {
            title: 'Total Views',
            value: '45.2k',
            icon: <Eye size={22} />,
            trend: '+12%',
            color: 'text-blue-600 bg-blue-50'
        },
        {
            title: 'Total Responses',
            value: '12,842',
            icon: <Send size={22} />,
            trend: '+5%',
            color: 'text-purple-600 bg-purple-50'
        },
        {
            title: 'Avg. Completion Rate',
            value: '68.4%',
            icon: <Zap size={22} />,
            trend: '-2%',
            color: 'text-amber-600 bg-amber-50'
        }
    ];

    const recentForms = [
        {
            title: 'Customer Feedback Survey',
            date: 'Oct 12, 2023',
            responses: '1,208',
            status: 'Active',
            icon: <MessageSquare size={40} />
        },
        {
            title: 'Product Launch Event',
            date: 'Oct 05, 2023',
            responses: '452',
            status: 'Active',
            icon: <Calendar size={40} />
        },
        {
            title: 'Developer Job Application',
            date: 'Sep 28, 2023',
            responses: '12',
            status: 'Paused',
            icon: <Briefcase size={40} />
        },
        {
            title: 'Weekly Newsletter Signup',
            date: 'Sep 15, 2023',
            responses: '3,450',
            status: 'Active',
            icon: <Mail size={40} />
        }
    ];

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Form Dashboard</h1>
                    <p className="text-slate-500 font-bold text-sm tracking-wide">Manage your active forms and analyze responses.</p>
                </div>
                <button className="flex items-center justify-center gap-3 px-6 py-4 bg-[#3713ec] text-white font-black rounded-2xl hover:bg-[#2911A0] transition-all shadow-xl shadow-[#3713ec]/20 group">
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Create New Form</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            {/* Recent Forms Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Recent Forms</h2>
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            14 Total
                        </span>
                    </div>

                    <div className="flex items-center bg-white border border-slate-100 rounded-xl p-1.5 shadow-sm">
                        <button className="p-2 bg-[#3713ec]/10 text-[#3713ec] rounded-lg">
                            <LayoutGrid size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <List size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {recentForms.map((form, idx) => (
                        <FormCard key={idx} {...form} />
                    ))}
                    <FormCard isCreateNew />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
