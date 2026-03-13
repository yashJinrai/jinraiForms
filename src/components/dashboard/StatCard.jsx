import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon, trend, color, breakdown, onClick }) => {
    const isPositive = trend && trend.startsWith('+');

    return (
        <div 
            onClick={onClick}
            className={`bg-white dark:bg-[#1e1c2e] p-6 rounded-[24px] border border-slate-50 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-[#3713ec]/5 dark:hover:shadow-[#3713ec]/10 transition-all duration-300 group ${onClick ? 'cursor-pointer' : ''}`}
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {trend}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
                </div>

                {/* Optional breakdown bar */}
                {breakdown && breakdown.length > 0 && (
                    <div className="pt-2 border-t border-slate-50 dark:border-slate-800 mt-2 space-y-3">
                        <div className="flex h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            {breakdown.map((item, i) => {
                                const total = breakdown.reduce((sum, b) => sum + (b.value || 0), 0);
                                const width = total > 0 ? (item.value / total) * 100 : 0;
                                return (
                                    <div 
                                        key={i} 
                                        className={`h-full ${item.color} transition-all duration-500`}
                                        style={{ width: `${width}%` }}
                                    />
                                );
                            })}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {breakdown.map((item, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                                        {item.label}: {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
