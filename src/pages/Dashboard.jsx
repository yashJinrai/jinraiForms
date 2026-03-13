import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import FormCard from '../components/dashboard/FormCard';
import {
    MessageSquare,
    Edit3,
    BarChart2,
    ExternalLink,
    Plus,
    LayoutGrid,
    List,
    Send,
    Zap,
    Eye
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [recentForms, setRecentForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalForms: 0,
        activeForms: 0,
        totalResponses: 0,
        responseTrend: 0,
        totalFull: 0,
        totalPartial: 0,
        totalAbandoned: 0,
        formSuccessRate: '0%'
    });
    const [viewType, setViewType] = useState('grid');

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
                const res = await api.get('/forms/stats');
                const data = res.data.data;
                const { totalForms, activeForms, totalResponses, responseTrend, dashboardForms: forms } = data;

                // Map the forms
                const mappedForms = forms.map((f, i) => ({
                    id: f._id,
                    title: f.title,
                    date: f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'N/A',
                    responses: f.responsesCount || 0,
                    status: f.status,
                    bgGradient: gradients[i % gradients.length],
                    collaborators: [],
                    collaboratorColors: []
                }));

                setRecentForms(mappedForms);
                setStats({ 
                    totalForms, 
                    activeForms, 
                    totalResponses, 
                    responseTrend,
                    totalFull: data.totalFull || 0,
                    totalPartial: data.totalPartial || 0,
                    totalAbandoned: data.totalAbandoned || 0,
                    formSuccessRate: data.formSuccessRate || '0%'
                });
            } catch (error) {
                console.error("Dashboard data fetch error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        {
            title: 'Total Active Forms',
            value: stats.activeForms.toString(),
            icon: <MessageSquare size={22} />,
            color: 'text-blue-600 bg-blue-50',
            onClick: () => navigate('/forms')
        },
        {
            title: 'Total Responses',
            value: stats.totalResponses.toLocaleString(),
            icon: <Send size={22} />,
            color: 'text-purple-600 bg-purple-50',
            onClick: () => navigate('/responses')
        },
        {
            title: 'Form Success Rate',
            value: stats.formSuccessRate,
            icon: <Zap size={22} />,
            color: 'text-emerald-600 bg-emerald-50',
            breakdown: [
                { label: 'Full', value: stats.totalFull, color: 'bg-emerald-500' },
                { label: 'Partial', value: stats.totalPartial, color: 'bg-amber-400' },
                { label: 'Bounced', value: stats.totalAbandoned, color: 'bg-slate-300' }
            ]
        }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Form Dashboard</h1>
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
                    {statCards.map((stat, idx) => (
                        <StatCard key={idx} {...stat} />
                    ))}
                </div>

                {/* Active Forms Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Forms</h2>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                {recentForms.length} Active
                            </span>
                        </div>

                        <div className="flex items-center bg-white border border-slate-100 rounded-xl p-1.5 shadow-sm">
                            <button 
                                onClick={() => setViewType('grid')}
                                className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-[#3713ec]/10 text-[#3713ec]' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button 
                                onClick={() => setViewType('list')}
                                className={`p-2 rounded-lg transition-all ${viewType === 'list' ? 'bg-[#3713ec]/10 text-[#3713ec]' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 flex justify-center w-full">
                            <div className="w-8 h-8 border-4 border-[#3713ec] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : viewType === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                            <FormCard isCreateNew onClick={() => navigate('/forms/create')} />
                            {recentForms.map((form) => (
                                <FormCard
                                    key={form.id}
                                    id={form.id}
                                    title={form.title}
                                    date={form.date}
                                    responses={form.responses}
                                    status={form.status}
                                    bgGradient={form.bgGradient}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
                            <div className="p-6 text-center">
                                {/* Optional: Add empty state if no forms */}
                            </div>
                            <div className="p-6 pt-0">
                                <div className="space-y-4">
                                    <button 
                                        onClick={() => navigate('/forms/create')}
                                        className="w-full p-4 flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 hover:border-[#3713ec] hover:bg-[#3713ec]/5 hover:text-[#3713ec] transition-all font-black text-sm uppercase tracking-wide"
                                    >
                                        <Plus size={18} />
                                        Create New Form
                                    </button>
                                    {recentForms.map((form) => (
                                        <div 
                                            key={form.id} 
                                            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all"
                                        >
                                            <div className="flex items-center gap-5 flex-1">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[#3713ec] bg-gradient-to-br ${form.bgGradient || 'bg-[#3713ec]/5'}`}>
                                                    <MessageSquare size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-black text-slate-900 group-hover:text-[#3713ec] transition-colors truncate">{form.title}</h4>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Created {form.date}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 sm:gap-10 mt-4 sm:mt-0 justify-between sm:justify-end">
                                                <button 
                                                    onClick={() => navigate(`/responses?formId=${form.id}`)}
                                                    className="text-right hover:scale-105 transition-transform group/resp"
                                                >
                                                    <p className="text-sm font-black text-slate-900 group-hover/resp:text-[#3713ec]">{form.responses}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Responses</p>
                                                </button>
                                                
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider ${
                                                        form.status === 'Active' ? 'bg-green-500' : 
                                                        form.status === 'Paused' ? 'bg-slate-400' : 'bg-amber-500'
                                                    }`}>
                                                        {form.status}
                                                    </span>
                                                    
                                                    <div className="flex items-center gap-1.5 border-l border-slate-100 ml-2 pl-3">
                                                        <button 
                                                            onClick={() => navigate(`/responses?formId=${form.id}`)}
                                                            className="p-2 text-slate-400 hover:text-[#3713ec] hover:bg-[#3713ec]/5 rounded-xl transition-all"
                                                            title="View Responses"
                                                        >
                                                            <MessageSquare size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => navigate(`/forms/create?id=${form.id}`)}
                                                            className="p-2 text-slate-400 hover:text-[#3713ec] hover:bg-[#3713ec]/5 rounded-xl transition-all"
                                                            title="Edit Form"
                                                        >
                                                            <Edit3 size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => window.open(`/form/${form.id}`, '_blank')}
                                                            className="p-2 text-slate-400 hover:text-[#3713ec] hover:bg-[#3713ec]/5 rounded-xl transition-all"
                                                            title="Preview Form"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
