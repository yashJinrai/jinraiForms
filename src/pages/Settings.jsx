import React, { useState, useEffect, cloneElement } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import api from '../lib/api';
import { Modal } from '../components/ui';
import {
    User,
    Bell,
    Shield,
    CreditCard,
    Globe,
    Moon,
    Mail,
    Smartphone,
    Eye,
    EyeOff,
    LogOut,
    Trash2,
    Check,
    Loader2,
    Save
} from 'lucide-react';

const Settings = () => {
    const navigate = useNavigate();
    const { user, loading, logout, checkAuth } = useAuth();
    const { showToast } = useNotification();
    const [activeTab, setActiveTab] = useState('Account');
    const [saving, setSaving] = useState(false);

    // Modal States
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        bio: '',
        location: '',
        website: '',
        twitter: '',
        github: '',
        linkedin: '',
        telephone: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || '',
                bio: user.bio || '',
                location: user.location || '',
                website: user.website || '',
                twitter: user.twitter || '',
                github: user.github || '',
                linkedin: user.linkedin || '',
                telephone: user.telephone || ''
            });
        }
    }, [user]);

    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        browserPush: false,
        marketing: true,
        securityAlerts: true
    });

    const tabs = [
        { name: 'Account', icon: <User size={20} /> },
        { name: 'Security', icon: <Shield size={20} /> },
        { name: 'Notifications', icon: <Bell size={20} /> },
        { name: 'Billing', icon: <CreditCard size={20} /> },
        { name: 'Localization', icon: <Globe size={20} /> }
    ];


    const handleUpdate = async () => {
        if (!user) return;
        try {
            setSaving(true);
            const res = await api.put(`/auth/update_profile/${user._id}`, formData);
            if (res.data.success) {
                showToast("Settings updated successfully!");
                checkAuth(); // Refresh global user state
            }
        } catch (error) {
            console.error("Update error:", error);
            showToast(error.response?.data?.message || "Failed to update settings", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        try {
            setIsDeleting(true);
            const res = await api.delete(`/auth/delete_account/${user._id}`);
            if (res.data.success) {
                await logout();
                navigate('/login');
            }
        } catch (error) {
            console.error("Delete error:", error);
            showToast(error.response?.data?.message || "Failed to delete account", "error");
            setIsDeleting(false);
        }
    };

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="h-[60vh] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-[#3713ec] animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">System Settings</h1>
                        <p className="text-slate-500 font-bold text-sm tracking-wide">Manage your account preferences and global configuration.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => checkAuth()}
                            className="flex-1 sm:flex-none px-6 py-3 bg-white text-slate-900 font-black rounded-xl border border-slate-100 hover:bg-slate-50 transition-all shadow-sm text-sm"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={saving}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-[#3713ec] text-white font-black rounded-xl hover:bg-[#2911A0] disabled:bg-slate-400 transition-all shadow-xl shadow-[#3713ec]/20 text-sm"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>{saving ? 'Saving' : 'Save'}</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-10">
                    {/* Settings Navigation */}
                    <aside className="w-full xl:w-72 shrink-0">
                        <nav className="p-2 sm:p-3 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex xl:flex-col gap-1 overflow-x-auto no-scrollbar xl:overflow-x-visible">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl font-black transition-all duration-300 whitespace-nowrap xl:w-full
                                        ${activeTab === tab.name
                                            ? 'bg-[#3713ec] text-white shadow-lg shadow-[#3713ec]/20'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                    <span className={activeTab === tab.name ? 'text-white' : 'text-slate-400'}>
                                        {cloneElement(tab.icon, { size: 18 })}
                                    </span>
                                    <span className="text-sm sm:text-base">{tab.name}</span>
                                    {activeTab === tab.name && (
                                        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full hidden xl:block" />
                                    )}
                                </button>
                            ))}
                        </nav>

                        <div className="mt-8 p-6 bg-rose-50/50 rounded-3xl border border-rose-100/50">
                            <h4 className="text-rose-600 font-black text-sm uppercase tracking-widest mb-4">Danger Zone</h4>
                            <div className="space-y-4">
                                <button
                                    onClick={() => setIsLogoutModalOpen(true)}
                                    className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-rose-100 text-rose-600 font-bold hover:bg-rose-50 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="w-full flex items-center justify-between p-4 bg-rose-600 rounded-2xl text-white font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <Trash2 size={18} />
                                        <span>Delete Account</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Settings Content Area */}
                    <main className="flex-1">
                        {activeTab === 'Account' && (
                            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-slate-200/40 border border-slate-50 space-y-10 animate-in fade-in zoom-in-95 duration-500">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">Account Profile</h2>
                                    <p className="text-slate-500 font-bold text-sm">Update your public information and avatar.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-black text-slate-700 uppercase tracking-widest px-1">Display Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#3713ec]/20 focus:bg-white focus:ring-4 focus:ring-[#3713ec]/5 rounded-2xl outline-none font-bold text-slate-700 transition-all"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-black text-slate-700 uppercase tracking-widest px-1">Location</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#3713ec]/20 focus:bg-white focus:ring-4 focus:ring-[#3713ec]/5 rounded-2xl outline-none font-bold text-slate-700 transition-all"
                                            placeholder="e.g. San Francisco, CA"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-black text-slate-700 uppercase tracking-widest px-1">Website URL</label>
                                        <input
                                            type="text"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#3713ec]/20 focus:bg-white focus:ring-4 focus:ring-[#3713ec]/5 rounded-2xl outline-none font-bold text-slate-700 transition-all"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-black text-slate-700 uppercase tracking-widest px-1">Twitter Handle</label>
                                        <input
                                            type="text"
                                            value={formData.twitter}
                                            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#3713ec]/20 focus:bg-white focus:ring-4 focus:ring-[#3713ec]/5 rounded-2xl outline-none font-bold text-slate-700 transition-all"
                                            placeholder="@username"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-black text-slate-700 uppercase tracking-widest px-1">GitHub Username</label>
                                        <input
                                            type="text"
                                            value={formData.github}
                                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#3713ec]/20 focus:bg-white focus:ring-4 focus:ring-[#3713ec]/5 rounded-2xl outline-none font-bold text-slate-700 transition-all"
                                            placeholder="username"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-black text-slate-700 uppercase tracking-widest px-1">LinkedIn Profile</label>
                                        <input
                                            type="text"
                                            value={formData.linkedin}
                                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#3713ec]/20 focus:bg-white focus:ring-4 focus:ring-[#3713ec]/5 rounded-2xl outline-none font-bold text-slate-700 transition-all"
                                            placeholder="linkedin-id"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-sm font-black text-slate-700 uppercase tracking-widest px-1">Public Biography</label>
                                        <textarea
                                            rows="4"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#3713ec]/20 focus:bg-white focus:ring-4 focus:ring-[#3713ec]/5 rounded-2xl outline-none font-bold text-slate-700 transition-all resize-none"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl bg-[#3713ec]/5 flex items-center justify-center text-[#3713ec] shrink-0">
                                            <Mail size={24} className="sm:size-[32px]" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-sm sm:text-base">Email Connectivity</h4>
                                            <p className="text-slate-500 font-bold text-[10px] sm:text-xs uppercase tracking-wider truncate max-w-[150px] sm:max-w-none">Verified: {formData.email}</p>
                                        </div>
                                    </div>
                                    <button className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl transition-all text-sm">
                                        Change Email
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Notifications' && (
                            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-slate-200/40 border border-slate-50 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">Notification Preferences</h3>
                                    <p className="text-slate-500 font-bold text-sm">Control how and when you want to be notified.</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { id: 'emailAlerts', title: 'Email Notifications', desc: 'Receive form submissions and system updates via email.', icon: <Mail size={20} /> },
                                        { id: 'browserPush', title: 'Browser Push Notifications', desc: 'Real-time alerts directly in your browser.', icon: <Smartphone size={20} /> },
                                        { id: 'securityAlerts', title: 'Security Alerts', desc: 'Important alerts about account security and login attempts.', icon: <Shield size={20} /> }
                                    ].map((item) => (
                                        <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 sm:p-6 rounded-3xl border border-slate-100 hover:border-[#3713ec]/20 transition-all group gap-4">
                                            <div className="flex items-center gap-4 sm:gap-5">
                                                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#3713ec]/5 group-hover:text-[#3713ec] transition-colors shrink-0">
                                                    {React.cloneElement(item.icon, { size: 18 })}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-900 text-sm sm:text-base">{item.title}</h4>
                                                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mt-0.5">{item.desc}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggleNotification(item.id)}
                                                className={`w-14 h-8 rounded-full relative transition-all duration-300 ${notifications[item.id] ? 'bg-[#3713ec]' : 'bg-slate-200'}`}
                                            >
                                                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${notifications[item.id] ? 'left-7' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab !== 'Account' && activeTab !== 'Notifications' && (
                            <div className="h-96 bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-50 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
                                    {tabs.find(t => t.name === activeTab)?.icon}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">{activeTab} Settings</h3>
                                <p className="text-slate-500 font-bold text-sm max-w-sm">This section is currently under development. Please check back later for more options.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <Modal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                title="Ready to leave?"
                confirmText="Logout"
                cancelText="Stay logged in"
            >
                Are you sure you want to logout? You will need to login again to access your forms.
            </Modal>

            {/* Delete Account Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account?"
                confirmText="Yes, Delete"
                cancelText="No, Keep it"
                variant="danger"
                loading={isDeleting}
            >
                This action is <span className="text-rose-600 font-black">permanent</span>. All your forms, responses, and settings will be deleted forever. There is no way to undo this.
            </Modal>
        </DashboardLayout>
    );
}

export default Settings;
