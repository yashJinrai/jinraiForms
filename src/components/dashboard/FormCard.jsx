import React from 'react';
import { MoreVertical, MessageSquare, Plus } from 'lucide-react';

const FormCard = ({ title, date, responses, status, icon, isCreateNew, onClick }) => {
    if (isCreateNew) {
        return (
            <button onClick={onClick} className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-slate-200 rounded-[24px] hover:border-[#3713ec] hover:bg-[#3713ec]/5 transition-all duration-300 group h-full min-h-[220px]">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-[#3713ec] group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300 mb-4">
                    <Plus size={24} />
                </div>
                <span className="font-black text-slate-900 tracking-tight">Create New Form</span>
            </button>
        );
    }

    const statusColors = {
        Active: 'bg-green-500',
        Paused: 'bg-slate-400',
        Draft: 'bg-amber-500'
    };

    return (
        <div className="bg-white rounded-[24px] border border-slate-50 shadow-sm hover:shadow-2xl hover:shadow-[#3713ec]/10 transition-all duration-500 group overflow-hidden flex flex-col">
            {/* Visual Header */}
            <div className={`h-24 p-6 relative flex justify-center items-center overflow-hidden ${status === 'Paused' ? 'bg-slate-50' : 'bg-[#3713ec]/5'
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
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-slate-900 text-lg leading-tight group-hover:text-[#3713ec] transition-colors line-clamp-2">
                        {title}
                    </h3>
                    <button className="text-slate-300 hover:text-slate-600 p-1">
                        <MoreVertical size={18} />
                    </button>
                </div>

                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-6">
                    Created {date}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                    <div className="flex items-center gap-2 text-slate-500">
                        <MessageSquare size={16} className="text-[#3713ec]" />
                        <span className="text-sm font-bold text-slate-900">{responses}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Responses</span>
                    </div>

                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">
                                U{i}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormCard;
