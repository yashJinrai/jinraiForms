import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useNotification } from '../context/NotificationContext';
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
    Active: { label: 'ACTIVE', className: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500' },
    Draft: { label: 'DRAFT', className: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' },
    Archived: { label: 'ARCHIVED', className: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500' },
};

const FormCard = ({ form, onEdit, onDelete, onDuplicate, onArchiveToggle, onShare }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const cfg = statusConfig[form.status] || statusConfig['Draft'];
    const isDraft = form.status === 'Draft';

    return (
        <div className="bg-white dark:bg-[#1e1c2e] rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-[#3713ec]/10 transition-all duration-400 flex flex-col overflow-hidden group">
            {/* Visual Header */}
            <div className={`h-32 bg-gradient-to-br ${form.bgGradient || 'from-sky-50 via-blue-50 to-indigo-100'} relative`}>
                <span className={`absolute top-3 right-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${cfg.className}`}>
                    {cfg.label}
                </span>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-black text-slate-900 dark:text-white text-[15px] leading-snug group-hover:text-[#3713ec] transition-colors line-clamp-2">
                        {form.title}
                    </h3>
                </div>
                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-4">
                    <Calendar size={11} /> Created {new Date(form.createdAt).toLocaleDateString()}
                </p>

                {/* Responses row */}
                <div className="flex items-end justify-between mt-auto mb-4">
                    <div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{(form.responsesCount || 0).toLocaleString()}</p>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Responses</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-50 dark:border-slate-800">
                    <button
                        onClick={() => onEdit(form._id)}
                        className="flex-1 py-2 bg-[#3713ec] text-white text-[12px] font-black rounded-xl hover:bg-[#2a0fd4] transition-all flex items-center justify-center gap-1.5"
                    >
                        <Edit2 size={13} /> {isDraft ? 'Continue' : 'Edit'}
                    </button>
                    <button 
                        onClick={() => onShare(form._id)}
                        className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
                        title="Copy Form Link"
                    >
                        <Share2 size={15} />
                    </button>
                    {/* Three-dot menu */}
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(o => !o)}
                            className="p-2 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                        >
                            <MoreHorizontal size={15} />
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 bottom-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl shadow-slate-200/80 dark:shadow-none py-2 w-44 z-50">
                                <MenuItem
                                    icon={<Copy size={14} />}
                                    label="Duplicate"
                                    onClick={() => { onDuplicate(form._id); setMenuOpen(false); }}
                                />
                                <MenuItem
                                    icon={<ExternalLink size={14} />}
                                    label="View Live"
                                    onClick={() => {
                                        window.open(`/form/${form._id}`, '_blank');
                                        setMenuOpen(false);
                                    }}
                                />
                                <MenuItem
                                    icon={<Archive size={14} />}
                                    label={form.status === 'Archived' ? 'Unarchive' : 'Archive'}
                                    onClick={() => { onArchiveToggle(form._id, form.status); setMenuOpen(false); }}
                                />
                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                <MenuItem
                                    icon={<Trash2 size={14} />}
                                    label="Delete"
                                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
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

const MenuItem = ({ icon, label, className = 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800', onClick }) => (
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
        className="flex flex-col items-center justify-center bg-white dark:bg-[#1e1c2e] border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[20px] hover:border-[#3713ec] hover:bg-[#3713ec]/[0.03] dark:hover:bg-[#3713ec]/10 transition-all duration-300 group min-h-[280px]"
    >
        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-[#3713ec] group-hover:text-white flex items-center justify-center transition-all duration-300 mb-3 shadow-sm">
            <Plus size={22} />
        </div>
        <p className="font-black text-slate-700 dark:text-white group-hover:text-[#3713ec] transition-colors text-[14px]">New Form</p>
        <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-1">Start from a template or scratch</p>
    </button>
);

const MyForms = () => {
    const navigate = useNavigate();
    const { showToast, confirm } = useNotification();
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
            activeTab === 'All Forms' ? f.status !== 'Archived' :
                activeTab === 'Active' ? f.status === 'Active' :
                    activeTab === 'Drafts' ? f.status === 'Draft' :
                        activeTab === 'Archived' ? f.status === 'Archived' : true;
        const searchSafeTitle = f.title || '';
        const matchesSearch = searchSafeTitle.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleDuplicate = async (id) => {
        try {
            const res = await api.post(`/forms/${id}/duplicate`);
            if (res.data.success) {
                const newForm = {
                    ...res.data.data,
                    bgGradient: GRADIENTS[forms.length % GRADIENTS.length]
                };
                setForms(prev => [newForm, ...prev]);
            }
        } catch (error) {
            console.error("Failed to duplicate form", error);
        }
    };

    const handleDelete = async (id) => {
        const ok = await confirm({
            title: 'Delete Form?',
            message: 'This will permanently remove this form and all its responses. This action cannot be undone.',
            confirmText: 'Yes, Delete',
            variant: 'danger'
        });

        if (!ok) return;

        try {
            await api.delete(`/forms/${id}`);
            setForms(prev => prev.filter(f => f._id !== id));
            showToast("Form deleted successfully");
        } catch (error) {
            console.error("Failed to delete form", error);
            showToast("Failed to delete form", "error");
        }
    };

    const handleArchiveToggle = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Archived' ? 'Draft' : 'Archived';
            const res = await api.put(`/forms/${id}`, { status: newStatus });
            if (res.data.success) {
                setForms(prev => prev.map(f => f._id === id ? { ...f, status: newStatus } : f));
                showToast(`Form ${newStatus === 'Archived' ? 'archived' : 'unarchived'} successfully`);
            }
        } catch (error) {
            console.error("Failed to update form status", error);
            showToast("Failed to update form status", "error");
        }
    };
    const handleEdit = (id) => navigate(`/forms/create?id=${id}`);
    const handleCreate = () => navigate('/forms/create');

    const handleShare = (id) => {
        const url = `${window.location.origin}/form/${id}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url)
                .then(() => showToast("Form link copied to clipboard!"))
                .catch(() => {
                    fallbackCopyTextToClipboard(url);
                });
        } else {
            fallbackCopyTextToClipboard(url);
        }
    };

    const fallbackCopyTextToClipboard = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showToast("Form link copied to clipboard!");
        } catch (err) {
            showToast("Failed to copy link", "error");
        }
        document.body.removeChild(textArea);
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">My Forms</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mt-1">Manage and track your active data collection forms.</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#3713ec] hover:bg-[#2a0fd4] text-white font-black rounded-2xl shadow-xl shadow-[#3713ec]/25 transition-all group shrink-0"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        Create New Form
                    </button>
                </div>

                {/* Tabs + Search row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex gap-1 overflow-x-auto no-scrollbar scroll-smooth -mb-px">
                        {STATUS_TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2.5 text-[13px] font-black transition-all border-b-2 whitespace-nowrap ${activeTab === tab
                                    ? 'border-[#3713ec] text-[#3713ec]'
                                    : 'border-transparent text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
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
                                <FormCard
                                    key={form._id}
                                    form={form}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onDuplicate={handleDuplicate}
                                    onArchiveToggle={handleArchiveToggle}
                                    onShare={handleShare}
                                />
                            ))}
                            <NewFormCard onCreate={handleCreate} />
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-center py-20 text-slate-400 dark:text-slate-600">
                                <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
                                <p className="font-black text-lg text-slate-900 dark:text-white">No forms found</p>
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
