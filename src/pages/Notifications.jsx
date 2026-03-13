import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../lib/api';
import { useNotification } from '../context/NotificationContext';
import {
    Bell, BellOff, Check, CheckCheck, Trash2, FileText,
    Send, AlertCircle, X, ChevronLeft, ChevronRight,
    Inbox, Zap, Shield
} from 'lucide-react';

const ICON_MAP = {
    form_submitted: { icon: <Send size={18} />, color: 'bg-indigo-500', bg: 'bg-indigo-50' },
    form_published: { icon: <Zap size={18} />, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
    form_deleted: { icon: <Trash2 size={18} />, color: 'bg-rose-500', bg: 'bg-rose-50' },
    response_flagged: { icon: <AlertCircle size={18} />, color: 'bg-amber-500', bg: 'bg-amber-50' },
    welcome: { icon: <Bell size={18} />, color: 'bg-violet-500', bg: 'bg-violet-50' },
    system: { icon: <Shield size={18} />, color: 'bg-slate-500', bg: 'bg-slate-100' },
};

const TABS = ['All', 'Unread', 'Responses', 'System'];

const Notifications = () => {
    const navigate = useNavigate();
    const { showToast, confirm } = useNotification();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, [page, activeTab]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('limit', 15);
            if (activeTab === 'Unread') params.append('unreadOnly', 'true');

            const res = await api.get(`/notifications?${params.toString()}`);
            if (res.data.success) {
                let data = res.data.data.notifications;

                // Client-side tab filtering
                if (activeTab === 'Responses') {
                    data = data.filter(n => n.type === 'form_submitted');
                } else if (activeTab === 'System') {
                    data = data.filter(n => ['system', 'welcome', 'form_published', 'form_deleted'].includes(n.type));
                }

                setNotifications(data);
                setTotalPages(res.data.data.totalPages);
                setUnreadCount(res.data.data.unreadCount);
            }
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            showToast("Failed to mark as read", "error");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
            showToast("All notifications marked as read");
        } catch (err) {
            showToast("Failed to mark all as read", "error");
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
            showToast("Notification removed");
        } catch (err) {
            showToast("Failed to delete notification", "error");
        }
    };

    const handleClearAll = async () => {
        const ok = await confirm({
            title: 'Clear All Notifications?',
            message: 'This will permanently remove all your notifications. This cannot be undone.',
            confirmText: 'Clear All',
            variant: 'danger'
        });
        if (!ok) return;

        try {
            await api.delete('/notifications/clear-all');
            setNotifications([]);
            setUnreadCount(0);
            showToast("All notifications cleared");
        } catch (err) {
            showToast("Failed to clear notifications", "error");
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            handleMarkRead(notification._id);
        }
        // Navigate based on type
        if (notification.metadata?.formId) {
            if (notification.type === 'form_submitted') {
                navigate(`/responses?formId=${notification.metadata.formId}`);
            } else if (notification.type === 'form_published') {
                navigate(`/forms/create?id=${notification.metadata.formId}`);
            }
        }
    };

    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Notifications</h1>
                            {unreadCount > 0 && (
                                <span className="px-3 py-1 bg-[#3713ec] text-white text-[12px] font-black rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mt-2 sm:mt-1">Stay updated with your form activity</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black rounded-2xl transition-all text-[12px] sm:text-[13px]"
                            >
                                <CheckCheck size={16} />
                                <span className="whitespace-nowrap">Mark All Read</span>
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-500 font-black rounded-2xl transition-all text-[12px] sm:text-[13px]"
                            >
                                <Trash2 size={16} />
                                <span className="whitespace-nowrap">Clear All</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800 gap-1 overflow-x-auto no-scrollbar scroll-smooth">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setPage(1); }}
                            className={`px-5 py-3 text-[13px] font-black transition-all border-b-2 -mb-px whitespace-nowrap ${activeTab === tab
                                ? 'border-[#3713ec] text-[#3713ec]'
                                : 'border-transparent text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                }`}
                        >
                            {tab}
                            {tab === 'Unread' && unreadCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-[#3713ec] text-white text-[10px] font-black rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Notification List */}
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <div className="w-8 h-8 border-4 border-[#3713ec] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Inbox size={36} className="text-slate-300 dark:text-slate-700" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                            {activeTab === 'Unread' ? 'All caught up!' : 'No notifications yet'}
                        </h3>
                        <p className="text-slate-400 dark:text-slate-500 font-bold text-sm max-w-sm mx-auto">
                            {activeTab === 'Unread'
                                ? "You've read all your notifications. Great job staying on top of things!"
                                : "When someone submits a form or something important happens, you'll see it here."}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-[#1a1829] rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-50 dark:divide-slate-800 transition-colors">
                        {notifications.map(notification => {
                            const config = ICON_MAP[notification.type] || ICON_MAP.system;
                            return (
                                <div
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`flex items-start gap-4 p-5 transition-all cursor-pointer group ${
                                        notification.read
                                            ? 'bg-white dark:bg-[#1a1829] hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                                            : 'bg-indigo-50/30 dark:bg-indigo-500/5 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10'
                                    }`}
                                >
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-2xl ${config.color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                                        {config.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h4 className={`text-[14px] font-black ${notification.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                                                {notification.title}
                                            </h4>
                                            {!notification.read && (
                                                <div className="w-2 h-2 rounded-full bg-[#3713ec] flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className={`text-[13px] font-bold leading-relaxed line-clamp-2 ${
                                            notification.read ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400'
                                        }`}>
                                            {notification.message}
                                        </p>
                                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-600 mt-1.5">
                                            {formatTimeAgo(notification.createdAt)}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        {!notification.read && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleMarkRead(notification._id); }}
                                                className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all"
                                                title="Mark as read"
                                            >
                                                <Check size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(notification._id); }}
                                            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                                            title="Delete"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 pt-4">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="text-[13px] font-black text-slate-500 dark:text-slate-400">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Notifications;
