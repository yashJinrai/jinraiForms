import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Download, ChevronLeft, ChevronRight, X, Calendar, Mail, User, FileText, Flag } from 'lucide-react';
import api from '../lib/api';



const TABS = ['All Responses', 'Recent', 'Flagged'];
const PAGE_SIZE = 5;

const statusConfig = {
    Completed: 'bg-emerald-100 text-emerald-700',
    Pending: 'bg-amber-100 text-amber-700',
    Flagged: 'bg-red-100 text-red-600',
};

const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 flex-shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-[13px] font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const Responses = () => {
    const [searchParams] = useSearchParams();
    const filterFormId = searchParams.get('formId');
    const [activeTab, setActiveTab] = useState('All Responses');
    const [page, setPage] = useState(1);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formName, setFormName] = useState('');

    useEffect(() => {
        fetchResponses();
    }, [filterFormId]);

    const fetchResponses = async () => {
        try {
            setLoading(true);
            const url = filterFormId
                ? `/forms/responses/all?formId=${filterFormId}`
                : '/forms/responses/all';
            const res = await api.get(url);
            if (res.data.success) {
                // Map backend data to frontend format
                const mappedData = res.data.data.map((r, i) => {
                    const date = new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const initials = r.submitterName && r.submitterName !== 'Anonymous'
                        ? r.submitterName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                        : 'AN';
                    const colors = [
                        'from-orange-400 to-rose-400', 'from-purple-400 to-violet-500',
                        'from-teal-400 to-emerald-500', 'from-blue-400 to-indigo-500',
                        'from-amber-400 to-orange-500', 'from-fuchsia-400 to-purple-500'
                    ];

                    return {
                        id: r._id,
                        formId: r.formId?._id || filterFormId,
                        initials: initials,
                        name: r.submitterName || 'Anonymous',
                        email: r.submitterEmail || 'anonymous@example.com',
                        form: r.formId ? r.formId.title : 'Deleted Form',
                        status: r.status || 'Completed',
                        date: date,
                        avatarColor: colors[i % colors.length],
                        flagged: r.flagged || false,
                        answers: r.answers
                    };
                });
                setResponses(mappedData);
                // Set form name from first response if filtering
                if (filterFormId && mappedData.length > 0) {
                    setFormName(mappedData[0].form);
                }
            }
        } catch (err) {
            console.error("Failed to fetch responses", err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = responses.filter(r => {
        if (activeTab === 'Recent') return true;
        if (activeTab === 'Flagged') return r.flagged;
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleExport = () => {
        const headers = ['Name', 'Form', 'Status', 'Date'];
        const rows = filtered.map(r => [r.name, r.form, r.status, r.date]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'responses.csv';
        a.click();
    };


    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                            {filterFormId ? `Responses: ${formName || 'Loading...'}` : 'Responses'}
                        </h1>
                        <p className="text-slate-500 font-bold text-sm mt-1">
                            {filterFormId ? 'Viewing responses for this form only' : 'View and manage your form submissions'}
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#3713ec] hover:bg-[#2a0fd4] text-white font-black rounded-2xl shadow-xl shadow-[#3713ec]/25 transition-all shrink-0"
                    >
                        <Download size={17} />
                        Export CSV
                    </button>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-100 px-4 sm:px-6 overflow-x-auto no-scrollbar scroll-smooth">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setPage(1); }}
                                className={`px-4 py-4 text-[13px] font-black transition-all border-b-2 whitespace-nowrap -mb-px ${activeTab === tab
                                    ? 'border-[#3713ec] text-[#3713ec]'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitter</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Form Name</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Submitted</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {paginated.map(r => (
                                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${r.avatarColor} flex items-center justify-center text-white text-[11px] font-black shadow-sm flex-shrink-0`}>
                                                    {r.initials}
                                                </div>
                                                <span className="font-bold text-slate-800 text-[14px]">{r.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] font-bold text-slate-600">{r.form}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block text-[11px] font-black uppercase tracking-wide px-3 py-1 rounded-full ${statusConfig[r.status]}`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] font-bold text-slate-500">{r.date}</td>
                                        <td className="px-6 py-4">
                                            <a
                                                href={`/form/${r.formId}/response/${r.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[13px] font-black text-[#3713ec] hover:text-[#2a0fd4] transition-colors hover:underline underline-offset-2"
                                            >
                                                View Details
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50">
                        <p className="text-[13px] font-bold text-slate-400">
                            Showing <span className="text-slate-700">{(page - 1) * PAGE_SIZE + 1}</span> to{' '}
                            <span className="text-slate-700">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of{' '}
                            <span className="text-slate-700">{filtered.length}</span> responses
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-xl text-[12px] font-black transition-all ${page === p
                                        ? 'bg-[#3713ec] text-white shadow-lg shadow-[#3713ec]/25'
                                        : 'border border-slate-100 text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Responses;
