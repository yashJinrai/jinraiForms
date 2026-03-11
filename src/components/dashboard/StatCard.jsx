import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon, trend, color }) => {
    const isPositive = trend.startsWith('+');

    return (
        <div className="bg-white p-6 rounded-[24px] border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-[#3713ec]/5 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {trend}
                </div>
            </div>

            <div className="space-y-1">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;
