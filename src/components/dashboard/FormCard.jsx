import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, MessageSquare, Plus, Eye, Edit3, BarChart2, ExternalLink } from 'lucide-react';

const FormCard = ({ id, title, date, responses, status, icon, isCreateNew, onClick, bgGradient }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    if (isCreateNew) {
        return (
            <button onClick={onClick} className="flex flex-col items-center justify-center p-8 bg-white dark:bg-[#1e1c2e] border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[24px] hover:border-[#3713ec] hover:bg-[#3713ec]/5 dark:hover:bg-[#3713ec]/10 transition-all duration-300 group h-full min-h-[220px]">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-[#3713ec] group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300 mb-4">
                    <Plus size={24} />
                </div>
                <span className="font-black text-slate-900 dark:text-white tracking-tight">Create New Form</span>
            </button>
        );
    }

    const statusColors = {
        Active: 'bg-green-500',
        Paused: 'bg-slate-400',
        Draft: 'bg-amber-500'
    };

    return (
        <div className="bg-white dark:bg-[#1e1c2e] rounded-[24px] border border-slate-50 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-[#3713ec]/10 transition-all duration-500 group flex flex-col relative">
            {/* Visual Header */}
            <div className={`h-24 p-6 relative flex justify-center items-center overflow-hidden rounded-t-[24px] ${status === 'Paused' ? 'bg-slate-50' : (bgGradient ? `bg-gradient-to-br ${bgGradient}` : 'bg-[#3713ec]/5')
                }`}>
                <div className="absolute top-4 right-4 z-10">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider ${statusColors[status] || 'bg-slate-500'}`}>
                        {status}
                    </span>
                </div>
                <div className="text-slate-200 group-hover:scale-110 transition-transform duration-500 opacity-60">
                    {icon || <MessageSquare size={48} />}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2 relative">
                    <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight group-hover:text-[#3713ec] transition-colors line-clamp-2">
                        {title}
                    </h3>
                    <div className="relative">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(!menuOpen);
                            }}
                            className="text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <MoreVertical size={18} />
                        </button>
                        
                        {menuOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-20" 
                                    onClick={() => setMenuOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1e1c2e] border border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/30 py-2 z-30 animate-in fade-in zoom-in duration-200">
                                    <button 
                                        onClick={() => navigate(`/responses?formId=${id}`)}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-[#3713ec] transition-colors"
                                    >
                                        <MessageSquare size={16} />
                                        View Responses
                                    </button>
                                    <button 
                                        onClick={() => navigate(`/forms/create?id=${id}`)}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-[#3713ec] transition-colors"
                                    >
                                        <Edit3 size={16} />
                                        Edit Form
                                    </button>
                                    <button 
                                        onClick={() => window.open(`/form/${id}`, '_blank')}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-[#3713ec] transition-colors"
                                    >
                                        <Eye size={16} />
                                        Preview
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-6">
                    Created {date}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-4">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <MessageSquare size={16} className="text-[#3713ec]" />
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{responses}</span>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Responses</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormCard;
