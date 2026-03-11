import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import FormCard from '../components/dashboard/FormCard';
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
    const navigate = useNavigate();
    const [recentForms, setRecentForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalActive, setTotalActive] = useState(0);

    const gradients = [
        'from-sky-50 via-blue-50 to-indigo-100',
        'from-violet-50 via-purple-50 to-indigo-100',
        'from-slate-50 to-slate-100',
        'from-rose-50 via-pink-50 to-fuchsia-100',
        'from-emerald-50 to-teal-100'
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const res = await api.get('/forms');
                const forms = res.data.data || [];

                // Map the forms
                const mappedForms = forms.slice(0, 4).map((f, i) => ({
                    id: f._id,
                    title: f.title,
                    date: new Date(f.createdAt).toLocaleDateString(),
                    responses: f.responsesCount || 0,
                    status: f.status,
                    bgGradient: gradients[i % gradients.length],
                    collaborators: [],
                    collaboratorColors: []
                }));

                setRecentForms(mappedForms);
                setTotalActive(forms.filter(f => f.status === 'Active').length);
            } catch (error) {
                console.error("Dashboard data fetch error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        {
            title: 'Total Active Forms',
            value: totalActive.toString(),
            icon: <MessageSquare size={22} />,
            trend: '+2',
            color: 'text-blue-600 bg-blue-50'
        },
        {
            title: 'Total Responses',
            value: '0',
            icon: <Send size={22} />,
            trend: '+0%',
            color: 'text-purple-600 bg-purple-50'
        },
        {
            title: 'Avg. Completion Rate',
            value: '0%',
            icon: <Zap size={22} />,
            trend: '0%',
            color: 'text-amber-600 bg-amber-50'
        }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Form Dashboard</h1>
                        <p className="text-slate-500 font-bold text-sm tracking-wide">Manage your active forms and analyze responses.</p>
                    </div>
                    <button
                        onClick={() => navigate('/forms/create')}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-[#3713ec] text-white font-black rounded-2xl hover:bg-[#2911A0] transition-all shadow-xl shadow-[#3713ec]/20 group"
                    >
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
                                {recentForms.length} Recent
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

                    {loading ? (
                        <div className="py-20 flex justify-center w-full">
                            <div className="w-8 h-8 border-4 border-[#3713ec] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                            {recentForms.map((form) => (
                                <FormCard
                                    key={form.id}
                                    title={form.title}
                                    date={form.date}
                                    responses={form.responses}
                                    status={form.status}
                                />
                            ))}
                            <FormCard isCreateNew onClick={() => navigate('/forms/create')} />
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
