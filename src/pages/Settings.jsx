import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
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
    const [activeTab, setActiveTab] = useState('Account');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState(null);

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

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/auth/valid_user');
            if (res.data.success) {
                const userData = res.data.data;
                setUser(userData);
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    role: userData.role || '',
                    bio: userData.bio || '',
                    location: userData.location || '',
                    website: userData.website || '',
                    twitter: userData.twitter || '',
                    github: userData.github || '',
                    linkedin: userData.linkedin || '',
                    telephone: userData.telephone || ''
                });
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!user) return;
        try {
            setSaving(true);
            const res = await api.put(`/auth/update_profile/${user._id}`, formData);
            if (res.data.success) {
                alert("Settings updated successfully!");
                fetchUserData();
            }
        } catch (error) {
            console.error("Update error:", error);
            alert(error.response?.data?.message || "Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await api.get('/auth/logout');
            navigate('/login');
        } catch (error) {
            console.error("Logout error:", error);
            navigate('/login');
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        try {
            setIsDeleting(true);
            const res = await api.delete(`/auth/delete_account/${user._id}`);
            if (res.data.success) {
                navigate('/login');
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert(error.response?.data?.message || "Failed to delete account");
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Settings</h1>
                        <p className="text-slate-500 font-bold text-sm tracking-wide">Manage your account preferences and global configuration.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fetchUserData()}
                            className="px-6 py-3 bg-white text-slate-900 font-black rounded-xl border border-slate-100 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            Reset Changes
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-3 bg-[#3713ec] text-white font-black rounded-xl hover:bg-[#2911A0] disabled:bg-slate-400 transition-all shadow-xl shadow-[#3713ec]/20"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-10">
                    {/* Settings Navigation */}
                    <aside className="w-full xl:w-72 shrink-0">
                        <nav className="p-3 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all duration-300
                                        ${activeTab === tab.name
                                            ? 'bg-[#3713ec] text-white shadow-lg shadow-[#3713ec]/20'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                    <span className={activeTab === tab.name ? 'text-white' : 'text-slate-400'}>
                                        {tab.icon}
                                    </span>
                                    <span>{tab.name}</span>
                                    {activeTab === tab.name && (
                                        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
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
                            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-50 space-y-10 animate-in fade-in zoom-in-95 duration-500">
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

                                <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-[#3713ec]/5 flex items-center justify-center text-[#3713ec]">
                                            <Mail size={32} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900">Email Connectivity</h4>
                                            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Verified: {formData.email}</p>
                                        </div>
                                    </div>
                                    <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl transition-all">
                                        Change Email
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Notifications' && (
                            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-50 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">Notification Preferences</h3>
                                    <p className="text-slate-500 font-bold text-sm">Control how and when you want to be notified.</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { id: 'emailAlerts', title: 'Email Notifications', desc: 'Receive form submissions and system updates via email.', icon: <Mail size={20} /> },
                                        { id: 'browserPush', title: 'Browser Push Notifications', desc: 'Real-time alerts directly in your browser.', icon: <Smartphone size={20} /> },
                                        { id: 'securityAlerts', title: 'Security Alerts', desc: 'Important alerts about account security and login attempts.', icon: <Shield size={20} /> }
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-6 rounded-3xl border border-slate-100 hover:border-[#3713ec]/20 transition-all group">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#3713ec]/5 group-hover:text-[#3713ec] transition-colors">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-900 text-base">{item.title}</h4>
                                                    <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mt-0.5">{item.desc}</p>
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
