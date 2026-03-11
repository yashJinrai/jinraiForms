import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    Plus, Edit2, Share2, MoreHorizontal, Calendar,
    MessageSquare, Briefcase, Mail, Star, Trash2,
    Archive, Copy, ExternalLink, Search, LayoutGrid, List
} from 'lucide-react';

const GRADIENTS = [
    'from-sky-50 via-blue-50 to-indigo-100',
    'from-violet-50 via-purple-50 to-indigo-100',
    'from-slate-50 to-slate-100',
    'from-rose-50 via-pink-50 to-fuchsia-100',
    'from-emerald-50 to-teal-100'
];

const STATUS_TABS = ['All Forms', 'Active', 'Drafts', 'Archived'];

const statusConfig = {
    Active: { label: 'ACTIVE', className: 'bg-emerald-100 text-emerald-700' },
    Draft: { label: 'DRAFT', className: 'bg-slate-100 text-slate-500' },
    Archived: { label: 'ARCHIVED', className: 'bg-amber-100 text-amber-600' },
};

const FormCard = ({ form, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const cfg = statusConfig[form.status] || statusConfig['Draft'];
    const isDraft = form.status === 'Draft';

    return (
        <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-400 flex flex-col overflow-hidden group">
            {/* Visual Header */}
            <div className={`h-32 bg-gradient-to-br ${form.bgGradient || 'from-sky-50 via-blue-50 to-indigo-100'} relative`}>
                <span className={`absolute top-3 right-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${cfg.className}`}>
                    {cfg.label}
                </span>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-black text-slate-900 text-[15px] leading-snug group-hover:text-[#3713ec] transition-colors line-clamp-2">
                        {form.title}
                    </h3>
                </div>
                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-4">
                    <Calendar size={11} /> Created {new Date(form.createdAt).toLocaleDateString()}
                </p>

                {/* Responses row */}
                <div className="flex items-end justify-between mt-auto mb-4">
                    <div>
                        <p className="text-2xl font-black text-slate-900">{(form.responsesCount || 0).toLocaleString()}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Responses</p>
                    </div>
                    {/* Collaborator avatars */}
                    {form.collaborators && form.collaborators.length > 0 ? (
                        <div className="flex -space-x-2">
                            {form.collaborators.map((c, i) => (
                                <div
                                    key={i}
                                    className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white ${form.collaboratorColors[i] || 'bg-slate-400'}`}
                                >
                                    {c}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <button className="p-1.5 text-slate-300 hover:text-slate-500 transition-colors">
                            <Edit2 size={15} />
                        </button>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                    {isDraft ? (
                        <button
                            onClick={() => onEdit(form._id)}
                            className="flex-1 py-2 bg-[#3713ec] text-white text-[12px] font-black rounded-xl hover:bg-[#2a0fd4] transition-all"
                        >
                            Continue Editing
                        </button>
                    ) : (
                        <button
                            onClick={() => onEdit(form._id)}
                            className="flex-1 py-2 bg-[#3713ec] text-white text-[12px] font-black rounded-xl hover:bg-[#2a0fd4] transition-all flex items-center justify-center gap-1.5"
                        >
                            <Edit2 size={13} /> Edit
                        </button>
                    )}
                    <button className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                        <Share2 size={15} />
                    </button>
                    {/* Three-dot menu */}
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(o => !o)}
                            className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            <MoreHorizontal size={15} />
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 bottom-10 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/80 py-2 w-44 z-50">
                                <MenuItem icon={<Copy size={14} />} label="Duplicate" />
                                <MenuItem
                                    icon={<ExternalLink size={14} />}
                                    label="View Live"
                                    onClick={() => {
                                        window.open(`/form/${form._id}`, '_blank');
                                        setMenuOpen(false);
                                    }}
                                />
                                <MenuItem icon={<Archive size={14} />} label="Archive" />
                                <div className="h-px bg-slate-100 my-1" />
                                <MenuItem
                                    icon={<Trash2 size={14} />}
                                    label="Delete"
                                    className="text-red-500 hover:bg-red-50"
                                    onClick={() => { onDelete(form._id); setMenuOpen(false); }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MenuItem = ({ icon, label, className = 'text-slate-600 hover:bg-slate-50', onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2 text-[13px] font-bold transition-colors ${className}`}
    >
        {icon} {label}
    </button>
);

const NewFormCard = ({ onCreate }) => (
    <button
        onClick={onCreate}
        className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-[20px] hover:border-[#3713ec] hover:bg-[#3713ec]/[0.03] transition-all duration-300 group min-h-[280px]"
    >
        <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-[#3713ec] group-hover:text-white flex items-center justify-center transition-all duration-300 mb-3 shadow-sm">
            <Plus size={22} />
        </div>
        <p className="font-black text-slate-700 group-hover:text-[#3713ec] transition-colors text-[14px]">New Form</p>
        <p className="text-[12px] text-slate-400 mt-1">Start from a template or scratch</p>
    </button>
);

const MyForms = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All Forms');
    const [forms, setForms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchForms = async () => {
        try {
            setLoading(true);
            const res = await api.get('/forms');
            const data = (res.data.data || []).map((f, i) => ({
                ...f,
                bgGradient: GRADIENTS[i % GRADIENTS.length]
            }));
            setForms(data);
        } catch (error) {
            console.error("Error fetching forms:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForms();
    }, []);

    const filtered = forms.filter(f => {
        const matchesTab =
            activeTab === 'All Forms' ? true :
                activeTab === 'Active' ? f.status === 'Active' :
                    activeTab === 'Drafts' ? f.status === 'Draft' :
                        activeTab === 'Archived' ? f.status === 'Archived' : true;
        const searchSafeTitle = f.title || '';
        const matchesSearch = searchSafeTitle.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleDelete = async (id) => {
        try {
            await api.delete(`/forms/${id}`);
            setForms(prev => prev.filter(f => f._id !== id));
        } catch (error) {
            console.error("Failed to delete form", error);
            alert("Failed to delete form.");
        }
    };
    const handleEdit = (id) => navigate(`/forms/create?id=${id}`);
    const handleCreate = () => navigate('/forms/create');

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Forms</h1>
                        <p className="text-slate-500 font-bold text-sm mt-1">Manage and track your active data collection forms.</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2.5 px-6 py-3.5 bg-[#3713ec] hover:bg-[#2a0fd4] text-white font-black rounded-2xl shadow-xl shadow-[#3713ec]/25 transition-all group flex-shrink-0"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        Create New Form
                    </button>
                </div>

                {/* Tabs + Search row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex border-b border-slate-100 gap-1">
                        {STATUS_TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2.5 text-[13px] font-black transition-all border-b-2 -mb-px ${activeTab === tab
                                    ? 'border-[#3713ec] text-[#3713ec]'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <div className="w-8 h-8 border-4 border-[#3713ec] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filtered.map(form => (
                                <FormCard key={form._id} form={form} onEdit={handleEdit} onDelete={handleDelete} />
                            ))}
                            <NewFormCard onCreate={handleCreate} />
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-center py-20 text-slate-400">
                                <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
                                <p className="font-black text-lg">No forms found</p>
                                <p className="text-sm mt-1">Try a different filter or create a new form.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyForms;
