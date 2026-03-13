import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    TrendingUp, TrendingDown, Eye, Send, Zap, Users,
    MoreHorizontal, ChevronDown, Monitor, Smartphone, Tablet,
    ArrowUpRight, Filter, Download
} from 'lucide-react';

/* ─────────────────────── Constants / Mock Data ─────────────────────── */
const RANGE_OPTIONS = ['Last 7 days', 'Last 30 days', 'Last 3 months', 'All time', 'Custom'];





const DEVICES = [
    { label: 'Desktop', pct: 58, color: 'bg-[#3713ec]', icon: <Monitor size={14} /> },
    { label: 'Mobile', pct: 32, color: 'bg-violet-400', icon: <Smartphone size={14} /> },
    { label: 'Tablet', pct: 10, color: 'bg-slate-200', icon: <Tablet size={14} /> },
];


/* ─────────────────────── SVG Line Chart ─────────────────────── */
const LineChart = ({ data, color = '#3713ec', fillColor = 'rgba(55,19,236,0.08)', label = 'Responses' }) => {
    const W = 800, H = 200, PAD = { top: 16, right: 16, bottom: 28, left: 40 };
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;

    const dataValues = data.map(d => d.value);
    const maxVal = dataValues.length > 0 ? Math.max(...dataValues, 5) : 5; // Default max to 5 if empty or 0
    const minVal = 0;

    const xScale = (i) => {
        if (data.length <= 1) return PAD.left + innerW / 2;
        return PAD.left + (i / (data.length - 1)) * innerW;
    };
    const yScale = (v) => {
        const range = maxVal - minVal;
        if (range === 0) return PAD.top + innerH;
        return PAD.top + innerH - ((v - minVal) / range) * innerH;
    };

    const points = data.map((d, i) => `${xScale(i)},${yScale(d.value)}`).join(' ');
    const areaPoints = [
        `${xScale(0)},${H - PAD.bottom}`,
        ...data.map((d, i) => `${xScale(i)},${yScale(d.value)}`),
        `${xScale(data.length - 1)},${H - PAD.bottom}`,
    ].join(' ');

    const yTicks = 4;
    const [hovered, setHovered] = useState(null);

    return (
        <div className="relative w-full" style={{ paddingBottom: '25%' }}>
            <svg
                viewBox={`0 0 ${W} ${H}`}
                className="absolute inset-0 w-full h-full"
                onMouseLeave={() => setHovered(null)}
            >
                <defs>
                    <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Y-axis grid lines */}
                {Array.from({ length: yTicks + 1 }, (_, i) => {
                    const v = Math.round((maxVal / yTicks) * i);
                    const y = yScale(v);
                    return (
                        <g key={i}>
                            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                                stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                            <text x={PAD.left - 6} y={y + 4} textAnchor="end"
                                fontSize="10" fill="#94a3b8" fontWeight="600">
                                {v > 999 ? `${(v / 1000).toFixed(1)}k` : v}
                            </text>
                        </g>
                    );
                })}

                {/* X-axis labels */}
                {data.filter((_, i) => i % 2 === 0).map((d, idx) => {
                    const i = idx * 2;
                    return (
                        <text key={i} x={xScale(i)} y={H - 4} textAnchor="middle"
                            fontSize="10" fill="#94a3b8" fontWeight="600">{d.label}</text>
                    );
                })}

                {/* Area fill */}
                <polygon points={areaPoints} fill={`url(#grad-${label})`} />

                {/* Line */}
                <polyline points={points} fill="none" stroke={color}
                    strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

                {/* Data points + hover targets */}
                {data.map((d, i) => (
                    <g key={i} onMouseEnter={() => setHovered(i)} style={{ cursor: 'pointer' }}>
                        <circle cx={xScale(i)} cy={yScale(d.value)} r="12" fill="transparent" />
                        <circle
                            cx={xScale(i)} cy={yScale(d.value)}
                            r={hovered === i ? 5 : 3.5}
                            fill="white" stroke={color}
                            strokeWidth="2.5"
                            style={{ transition: 'r 0.15s' }}
                            filter={hovered === i ? 'url(#glow)' : undefined}
                        />
                        {hovered === i && (
                            <g>
                                <rect
                                    x={Math.min(xScale(i) - 28, W - PAD.right - 60)}
                                    y={yScale(d.value) - 34}
                                    width="58" height="22" rx="8"
                                    fill="#1e293b"
                                />
                                <text
                                    x={Math.min(xScale(i) + 1, W - PAD.right - 28)}
                                    y={yScale(d.value) - 19}
                                    textAnchor="middle"
                                    fontSize="11" fill="white" fontWeight="bold"
                                >
                                    {d.value.toLocaleString()}
                                </text>
                            </g>
                        )}
                    </g>
                ))}
            </svg>
        </div>
    );
};

/* ─────────────────────── Horizontal Bar Chart ─────────────────────── */
const BarChart = ({ data }) => {
    const dataValues = data.map(d => d.responses);
    const maxVal = dataValues.length > 0 ? Math.max(...dataValues, 1) : 1;
    return (
        <div className="space-y-4">
            {data.map((d, i) => (
                <div key={i} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] font-bold text-slate-700 truncate max-w-[160px]">{d.label}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{d.responses.toLocaleString()} response</span>
                        </div>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#3713ec] to-violet-500 transition-all duration-700"
                            style={{ width: `${(d.responses / maxVal) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

/* ─────────────────────── Donut chart for devices ─────────────────────── */
const DonutChart = ({ devices }) => {
    const R = 54, CX = 70, CY = 70, stroke = 18;
    const circ = 2 * Math.PI * R;
    let cumulative = 0;

    const colors = ['#3713ec', '#8b5cf6', '#e2e8f0'];

    return (
        <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
                <svg width="140" height="140" viewBox="0 0 140 140">
                    {devices.map((d, i) => {
                        const dash = (d.pct / 100) * circ;
                        const gap = circ - dash;
                        const offset = circ - (cumulative / 100) * circ;
                        cumulative += d.pct;
                        return (
                            <circle
                                key={i}
                                cx={CX} cy={CY} r={R}
                                fill="none"
                                stroke={colors[i]}
                                strokeWidth={stroke}
                                strokeDasharray={`${dash} ${gap}`}
                                strokeDashoffset={offset}
                                strokeLinecap="butt"
                                style={{ transition: 'stroke-dasharray 0.6s ease' }}
                                transform={`rotate(-90 ${CX} ${CY})`}
                            />
                        );
                    })}
                    <text x={CX} y={CY - 6} textAnchor="middle" fontSize="18" fontWeight="900" fill="#0f172a">58%</text>
                    <text x={CX} y={CY + 14} textAnchor="middle" fontSize="9" fontWeight="700" fill="#94a3b8">DESKTOP</text>
                </svg>
            </div>
            <div className="space-y-3 flex-1">
                {devices.map((d, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: colors[i] }} />
                            <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-600">
                                <span className="text-slate-400">{d.icon}</span>
                                {d.label}
                            </div>
                        </div>
                        <span className="text-[13px] font-black text-slate-800">{d.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─────────────────────── Stat Card ─────────────────────── */
const StatCard = ({ title, value, icon, trend, up, color, sub }) => (
    <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-6 hover:shadow-xl hover:shadow-[#3713ec]/5 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-5">
            <div className={`p-3 rounded-2xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            {trend && (
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black ${up ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {trend}
                </div>
            )}
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
        {sub && typeof sub === 'string' && <p className="text-[11px] text-slate-400 font-bold mt-1">{sub}</p>}
        {/* Optional breakdown bar for Success Rate */}
        {title === "Form Success Rate" && (
            <div className="mt-4 pt-4 border-t border-slate-50">
                <div className="flex h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div className="bg-emerald-500 h-full" style={{ width: sub?.fullPct || '0%' }} />
                    <div className="bg-amber-400 h-full" style={{ width: sub?.partialPct || '0%' }} />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase">F: {sub?.fullCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="text-[9px] font-black text-slate-400 uppercase">P: {sub?.partialCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span className="text-[9px] font-black text-slate-400 uppercase">B: {sub?.abandonedCount}</span>
                    </div>
                </div>
            </div>
        )}
    </div>
);



/* ─────────────────────── Funnel Bar Graph ─────────────────────── */
const FunnelGraph = ({ data }) => {
    const maxVal = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="h-[280px] w-full flex items-end justify-between px-2 pt-10">
            {data.map((step, i) => (
                <div key={i} className="flex-1 flex flex-col items-center h-full group">
                    <div className="flex-1 w-full flex flex-col justify-end px-1.5">
                        <div 
                            className={`w-full ${step.color} rounded-t-xl transition-all duration-500 relative group-hover:brightness-110 shadow-sm`}
                            style={{ height: `${(step.value / maxVal) * 100}%` }}
                        >
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 font-black text-[12px] text-slate-800">
                                {step.value.toLocaleString()}
                            </div>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
                        </div>
                    </div>
                    <div className="mt-4 h-10 flex items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter text-center leading-[1.1] max-w-[70px]">
                            {step.step}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

/* ─────────────────────── Main Page ─────────────────────── */
const Analytics = () => {
    const navigate = useNavigate();
    const [range, setRange] = useState('Last 30 days');
    const [rangeOpen, setRangeOpen] = useState(false);
    const [activeChart, setActiveChart] = useState('responses');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        responseTrend: [],
        formPerformance: [],
        totalViews: 0,
        totalResponses: 0,
        totalFull: 0,
        totalPartial: 0,
        uniqueRespondents: 0
    });

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                let url = `/forms/analytics?range=${range}`;
                if (range === 'Custom' && startDate && endDate) {
                    url += `&startDate=${startDate}&endDate=${endDate}`;
                }
                const res = await api.get(url);
                setData(res.data.data);
            } catch (err) {
                console.error("Error fetching analytics", err);
            } finally {
                setLoading(false);
            }
        };
        // Fetch only if not custom OR if custom has both dates
        if (range !== 'Custom' || (startDate && endDate)) {
            fetchAnalytics();
        }
    }, [range, startDate, endDate]);

    const chartData = activeChart === 'responses' ? (data.responseTrend || []) : [];
    const chartColor = activeChart === 'responses' ? '#3713ec' : '#8b5cf6';

    // Dynamic Funnel Data
    const dynamicFunnel = [
        { 
            step: 'Total Views', 
            value: data.totalViews || 0, 
            pct: 100, 
            color: 'bg-slate-200' 
        },
        { 
            step: 'Submissions', 
            value: data.totalResponses || 0, 
            pct: data.totalViews > 0 ? Math.round(((data.totalResponses || 0) / data.totalViews) * 100) : 0, 
            color: 'bg-indigo-400' 
        },
        { 
            step: 'Full Completion', 
            value: data.totalFull || 0, 
            pct: data.totalViews > 0 ? Math.round(((data.totalFull || 0) / data.totalViews) * 100) : 0, 
            color: 'bg-[#3713ec]' 
        },
        { 
            step: 'Partial Only', 
            value: data.totalPartial || 0, 
            pct: data.totalViews > 0 ? Math.round(((data.totalPartial || 0) / data.totalViews) * 100) : 0, 
            color: 'bg-violet-400' 
        }
    ];
    

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-[#3713ec] border-t-transparent rounded-full animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Analytics</h1>
                        <p className="text-slate-500 font-bold text-sm mt-1">Track performance across all your forms.</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Date range picker */}
                        <div className="relative">
                            <button
                                onClick={() => setRangeOpen(o => !o)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-black text-slate-600 hover:border-[#3713ec]/40 hover:bg-[#3713ec]/[0.03] transition-all shadow-sm"
                            >
                                <Filter size={14} className="text-slate-400" />
                                {range}
                                <ChevronDown size={14} className={`text-slate-400 transition-transform ${rangeOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {rangeOpen && (
                                <div className="absolute right-0 top-12 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/80 py-2 w-44 z-50">
                                    {RANGE_OPTIONS.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => { 
                                                if (opt === 'Custom') {
                                                    setData(prev => ({ ...prev, responseTrend: [], formPerformance: [] }));
                                                }
                                                setRange(opt); 
                                                setRangeOpen(false); 
                                                if (opt !== 'Custom') {
                                                    setStartDate('');
                                                    setEndDate('');
                                                }
                                            }}
                                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-[13px] font-bold transition-colors ${range === opt ? 'text-[#3713ec] bg-[#3713ec]/5' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {range === opt && <div className="w-1.5 h-1.5 rounded-full bg-[#3713ec]" />}
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {range === 'Custom' && (
                            <div className="flex items-center gap-2 bg-white border border-[#3713ec]/20 rounded-xl px-3 py-1.5 shadow-sm animate-in fade-in slide-in-from-right-2 duration-300">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-[#3713ec] uppercase tracking-widest px-1">From</span>
                                    <input 
                                        type="date" 
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="bg-transparent border-none text-[12px] font-bold text-slate-700 focus:ring-0 p-0 h-5 cursor-pointer outline-none appearance-none"
                                    />
                                </div>
                                <div className="w-px h-6 bg-slate-100 mx-1" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-[#3713ec] uppercase tracking-widest px-1">To</span>
                                    <input 
                                        type="date" 
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="bg-transparent border-none text-[12px] font-bold text-slate-700 focus:ring-0 p-0 h-5 cursor-pointer outline-none appearance-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── KPI Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    <StatCard
                        title="Total Views"
                        value={(data.totalViews || 0).toLocaleString()}
                        icon={<Eye size={20} className="text-blue-600" />}
                        color="bg-blue-50"
                        sub="Total views across all forms"
                    />
                    <StatCard
                        title="Total Responses"
                        value={(data.totalResponses || 0).toLocaleString()}
                        icon={<Send size={20} className="text-[#3713ec]" />}
                        color="bg-[#3713ec]/8"
                        sub="Total submissions received"
                    />
                    <StatCard
                        title="Total Active Forms"
                        value={(data.activeFormsCount || 0).toString()}
                        icon={<Zap size={20} className="text-amber-600" />}
                        color="bg-amber-50"
                        sub="Currently published forms"
                    />
                    <StatCard
                        title="Form Success Rate"
                        value={data.formSuccessRate || '0%'}
                        icon={<Users size={20} className="text-emerald-600" />}
                        color="bg-emerald-50"
                        sub={{
                            fullCount: data.totalFull || 0,
                            partialCount: data.totalPartial || 0,
                            abandonedCount: data.totalAbandoned || 0,
                            fullPct: data.totalViews > 0 ? `${Math.round(((data.totalFull || 0) / data.totalViews) * 100)}%` : '0%',
                            partialPct: data.totalViews > 0 ? `${Math.round(((data.totalPartial || 0) / data.totalViews) * 100)}%` : '0%'
                        }}
                    />
                </div>

                {/* ── Main Chart (Line) + Device Breakdown ── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Line Chart card */}
                    <div className="xl:col-span-2 bg-white rounded-[20px] border border-slate-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-[17px] font-black text-slate-900">Response Trend</h2>
                                <p className="text-[12px] text-slate-400 font-bold mt-0.5">{range}</p>
                            </div>
                            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl p-1">
                                {['responses', 'views'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setActiveChart(t)}
                                        className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${activeChart === t
                                            ? 'bg-white text-[#3713ec] shadow-sm'
                                            : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: chartColor }} />
                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider capitalize">{activeChart}</span>
                            </div>
                        </div>

                        <LineChart data={chartData} color={chartColor} label={activeChart} />
                    </div>

                    {/* Device breakdown */}
                    <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-[17px] font-black text-slate-900">Device Split</h2>
                                <p className="text-[12px] text-slate-400 font-bold mt-0.5">Traffic by device type</p>
                            </div>
                            <button className="p-2 text-slate-300 hover:text-slate-500 rounded-xl hover:bg-slate-50 transition-all">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                        <div className="flex-1 flex items-center">
                            <DonutChart devices={DEVICES} />
                        </div>

                        {/* Mini stats */}
                        <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-50">
                            <MiniStat label="Avg. Time" value="2m 14s" up />
                            <MiniStat label="Bounce Rate" value="24.6%" up={false} />
                        </div>
                    </div>
                </div>

                {/* ── Bar Chart (Form Performance) + Completion Funnel ── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Bar Chart */}
                    <div className="xl:col-span-2 bg-white rounded-[20px] border border-slate-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-[17px] font-black text-slate-900">Form Performance</h2>
                                <p className="text-[12px] text-slate-400 font-bold mt-0.5">Responses & completion rate per form</p>
                            </div>
                            <button className="p-2 text-slate-300 hover:text-slate-500 rounded-xl hover:bg-slate-50 transition-all">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                        <div className="flex items-center gap-4 mb-5 text-[11px] font-black uppercase tracking-wider text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#3713ec] to-violet-500 inline-block" />
                                Responses
                            </span>
                            {/* <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                                Completion %
                            </span> */}
                        </div>
                        <BarChart data={data.formPerformance} />
                    </div>

                    {/* Funnel */}
                    <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-[17px] font-black text-slate-900">Conversion Funnel</h2>
                                <p className="text-[12px] text-slate-400 font-bold mt-0.5">From views to full submissions</p>
                            </div>
                        </div>
                        <FunnelGraph data={dynamicFunnel} />
                    </div>
                </div>

                {/* ── Top Forms Table ── */}
                <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
                        <div>
                            <h2 className="text-[17px] font-black text-slate-900">Top Performing Forms</h2>
                            <p className="text-[12px] text-slate-400 font-bold mt-0.5">Ranked by total responses</p>
                        </div>
                        <button 
                            onClick={() => navigate('/forms')}
                            className="flex items-center gap-1.5 text-[12px] font-black text-[#3713ec] hover:underline underline-offset-2"
                        >
                            View all <ArrowUpRight size={13} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    {['#', 'Form Name', 'Responses', 'Views'].map(col => (
                                        <th key={col} className="text-left px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.formPerformance.map((f, i) => (
                                    <tr key={i} className="hover:bg-slate-50/60 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-black ${i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
                                                {i + 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-800 text-[14px] group-hover:text-[#3713ec] transition-colors">
                                            {f.label}
                                        </td>
                                        <td className="px-6 py-4 text-[14px] font-black text-slate-700">{f.responses.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-[13px] font-bold text-slate-500">{f.views.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

/* ── Mini stat helper ── */
const MiniStat = ({ label, value, up }) => (
    <div className="bg-slate-50 rounded-xl p-3">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-black text-slate-800">{value}</span>
            <span className={`text-[10px] font-black ${up ? 'text-emerald-500' : 'text-red-400'}`}>
                {up ? '↑' : '↓'}
            </span>
        </div>
    </div>
);

export default Analytics;
