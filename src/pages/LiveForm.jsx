import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import {
    Check, AlertCircle, ChevronRight, ChevronLeft,
    Upload, Calendar, Star, Send, Clock, Palette,
    User, Mail, Instagram, Facebook, MessageCircle, Twitter, Globe,
    Layers
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import logo from '../assets/images/JLogobg.png';

const formatSocialLink = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
};

const LiveForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useNotification();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [passwordPrompt, setPasswordPrompt] = useState(false);
    const [emailPrompt, setEmailPrompt] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const viewTracked = useRef(false);

    useEffect(() => {
        fetchForm();
    }, [id]);

    const fetchForm = async (pass = null, email = null) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (pass || passwordInput) params.append('password', pass || passwordInput);
            if (email || emailInput) params.append('email', email || emailInput);
            
            const url = params.toString() ? `/forms/public/${id}?${params.toString()}` : `/forms/public/${id}`;
            const res = await api.get(url);
            if (res.data.success) {
                setForm(res.data.data);
                setPasswordPrompt(false);
                setEmailPrompt(false);
                setError(null);

                // Track view only once per component mount to avoid double counting in development (Strict Mode)
                if (!viewTracked.current) {
                    api.post(`/forms/public/${id}/view`).catch(err => console.error("Tracking error:", err));
                    viewTracked.current = true;
                }
            } else {
                setError("Form not found or unavailable.");
            }
        } catch (err) {
            console.error("Error fetching form:", err);
            const msg = err.response?.data?.message;
            if (msg === "PasswordRequired" || err.response?.status === 401) {
                setPasswordPrompt(true);
                setError(pass ? "Incorrect password. Please try again." : null);
            } else if (msg === "LoginRequired" || err.response?.status === 403) {
                setEmailPrompt(true);
                setError(null);
            } else {
                setError(msg || "Failed to load form. It might be private or deleted.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (fieldId, value) => {
        setResponses(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    // --- Multi-page helpers ---
    const fieldPageMax = form?.fields?.length ? Math.max(...form.fields.map(f => f.page || 1)) : 1;
    const labelsCount = form?.settings?.pages?.labels?.length || 0;
    const isMultiPage = form?.settings?.pages?.enabled && (labelsCount > 1 || fieldPageMax > 1);
    const totalPages = isMultiPage ? Math.max(labelsCount, fieldPageMax) : 1;
    
    // Ensure we have enough labels for the progress bar
    const pageLabels = [...(form?.settings?.pages?.labels || [])];
    while (pageLabels.length < totalPages) {
        pageLabels.push(`Page ${pageLabels.length + 1}`);
    }

    const getFieldsForPage = (pageNum) => {
        if (!isMultiPage) return form?.fields || [];
        // Ensure fields without a page default to 1
        return (form?.fields || []).filter(f => (f.page || 1) === pageNum);
    };

    const currentPageFields = getFieldsForPage(currentPage);

    const validateCurrentPage = () => {
        const missing = currentPageFields.filter(f => {
            if (!f.required) return false;
            if (['image', 'video'].includes(f.type)) return false;
            const val = responses[f.id];
            return val === undefined || val === null || val === '';
        });
        if (missing.length > 0) {
            showToast(`Please fill in required fields: ${missing.map(f => f.label).join(', ')}`, "error");
            return false;
        }
        return true;
    };

    const goNextPage = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!validateCurrentPage()) return;
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const goPrevPage = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Multi-page logic: Force "Next" behavior if not on the absolute last page
        if (isMultiPage && currentPage < totalPages) {
            goNextPage();
            return;
        }

        // final check on required fields across the ENTIRE form before final submit
        const missingFields = (form?.fields || []).filter(f => {
            if (!f.required) return false;
            if (['image', 'video'].includes(f.type)) return false;
            const val = responses[f.id];
            return val === undefined || val === null || val === '';
        });

        if (missingFields.length > 0) {
            // If something is missing, find which page it's on and jump there
            const firstMissing = missingFields[0];
            const missingPage = firstMissing.page || 1;
            if (missingPage !== currentPage) {
                setCurrentPage(missingPage);
                showToast(`Required field missing on ${pageLabels[missingPage - 1]}: ${firstMissing.label}`, "error");
            } else {
                showToast(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`, "error");
            }
            return;
        }

        try {
            setSubmitting(true);

            // Try to extract submitter details if there are fields that seem to match name/email.
            // This is optional since our backend defaults to Anonymous if not provided.
            let submitterName = '';
            let submitterEmail = '';

            form.fields.forEach(f => {
                const val = responses[f.id];
                if (val && typeof val === 'string') {
                    if (f.label.toLowerCase().includes('name')) {
                        submitterName = val;
                    }
                    if (f.label.toLowerCase().includes('email') || f.type === 'email') {
                        submitterEmail = val;
                    }
                }
            });

            const submitData = {
                responses,
                submitterName: submitterName || undefined,
                submitterEmail: submitterEmail || emailInput || undefined
            };

            const params = new URLSearchParams();
            if (passwordInput) params.append('password', passwordInput);
            if (emailInput) params.append('email', emailInput);
            
            const submitUrl = params.toString() ? `/forms/public/${id}/submit?${params.toString()}` : `/forms/public/${id}/submit`;
            await api.post(submitUrl, submitData);
            setSubmitted(true);
        } catch (err) {
            console.error("Submission error:", err);
            showToast("Failed to submit form. Please try again.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#3713ec] border-t-transparent rounded-full animate-spin" />
                    <p className="font-black text-slate-400 text-sm tracking-widest uppercase">Loading form...</p>
                </div>
            </div>
        );
    }

    if (passwordPrompt) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-2xl shadow-slate-200 border border-slate-100">
                    <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2 text-center">Protected Form</h1>
                    <p className="text-slate-500 font-bold mb-6 text-center leading-relaxed">
                        This form is password protected. Enter the password below to access it.
                    </p>
                    {error && <p className="text-red-500 text-sm font-bold text-center mb-4">{error}</p>}
                    <form onSubmit={(e) => { e.preventDefault(); fetchForm(passwordInput, null); }}>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#3713ec]/40 mb-4"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full py-4 bg-[#3713ec] text-white font-black rounded-2xl hover:bg-[#2a0fd4] transition-all shadow-xl shadow-[#3713ec]/20"
                        >
                            Unlock Form
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (emailPrompt) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-2xl shadow-slate-200 border border-slate-100">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Mail size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2 text-center">Login Required</h1>
                    <p className="text-slate-500 font-bold mb-6 text-center leading-relaxed">
                        This form is private. Please enter your email address to continue.
                    </p>
                    {error && <p className="text-red-500 text-sm font-bold text-center mb-4">{error}</p>}
                    <form onSubmit={(e) => { e.preventDefault(); fetchForm(null, emailInput); }}>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#3713ec]/40 mb-4"
                            required
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full py-4 bg-[#3713ec] text-white font-black rounded-2xl hover:bg-[#2a0fd4] transition-all shadow-xl shadow-[#3713ec]/20 flex items-center justify-center gap-2"
                        >
                            Access Form <ChevronRight size={18} />
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-2xl shadow-slate-200 text-center border border-slate-100">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Unavailable</h1>
                    <p className="text-slate-500 font-bold mb-8 leading-relaxed">
                        {error}
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-900/10"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-indigo-50/30 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-[40px] p-12 shadow-2xl shadow-indigo-100 text-center border border-white">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <Check size={40} strokeWidth={3} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Thank you!</h1>
                    <p className="text-slate-500 font-bold mb-10 leading-relaxed">
                        Your response has been successfully recorded. You can now close this tab.
                    </p>
                    <div className="pt-8 border-t border-slate-50 flex flex-col items-center gap-6">
                        {form.settings?.socialLinks && Object.values(form.settings.socialLinks).some(l => l) && (
                            <div className="flex items-center gap-4">
                                {form.settings.socialLinks.instagram && (
                                    <a href={formatSocialLink(form.settings.socialLinks.instagram)} target="_blank" rel="noopener noreferrer" className="p-2 bg-indigo-50 rounded-full text-pink-500 hover:scale-110 transition-transform">
                                        <Instagram size={18} />
                                    </a>
                                )}
                                {form.settings.socialLinks.facebook && (
                                    <a href={formatSocialLink(form.settings.socialLinks.facebook)} target="_blank" rel="noopener noreferrer" className="p-2 bg-indigo-50 rounded-full text-blue-600 hover:scale-110 transition-transform">
                                        <Facebook size={18} />
                                    </a>
                                )}
                                {form.settings.socialLinks.whatsapp && (
                                    <a href={form.settings.socialLinks.whatsapp.startsWith('http') ? form.settings.socialLinks.whatsapp : `https://wa.me/${form.settings.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-indigo-50 rounded-full text-emerald-500 hover:scale-110 transition-transform">
                                        <MessageCircle size={18} />
                                    </a>
                                )}
                                {form.settings.socialLinks.twitter && (
                                    <a href={formatSocialLink(form.settings.socialLinks.twitter)} target="_blank" rel="noopener noreferrer" className="p-2 bg-indigo-50 rounded-full text-slate-900 hover:scale-110 transition-transform">
                                        <Twitter size={18} />
                                    </a>
                                )}
                                {form.settings.socialLinks.website && (
                                    <a href={formatSocialLink(form.settings.socialLinks.website)} target="_blank" rel="noopener noreferrer" className="p-2 bg-indigo-50 rounded-full text-indigo-600 hover:scale-110 transition-transform">
                                        <Globe size={18} />
                                    </a>
                                )}
                             </div>
                        )}
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="JinraiForms" className="w-4 h-4 object-contain" />
                            <span className="text-[12px] font-black text-slate-400 tracking-widest uppercase">Powered by JinraiForms</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-500" style={{ backgroundColor: form.settings?.secondaryColor || '#F8FAFC' }}>
            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Banner Image */}
                    {form.settings?.bannerImage && form.settings.bannerImage.trim() !== '' && (
                        <div className="w-full h-32 sm:h-48 rounded-[24px] sm:rounded-[32px] overflow-hidden border border-slate-100 shadow-xl mb-2 sm:mb-4">
                            <img src={form.settings.bannerImage} alt="Form Banner" className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Form Header Card */}
                    <div className="rounded-[24px] sm:rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50" style={{ borderTop: `10px solid ${form.settings?.themeColor || '#3713ec'}`, backgroundColor: form.settings?.headerStyle?.backgroundColor || '#ffffff' }}>
                        <div className="p-6 sm:p-10 text-center">
                            <h1 
                                className="tracking-tight mb-2 sm:mb-3"
                                style={{
                                    fontSize: `calc(${form.settings?.headerStyle?.fontSize || '36px'} * 0.8)`,
                                    fontWeight: form.settings?.headerStyle?.fontWeight || '900',
                                    color: form.settings?.headerStyle?.color || '#0f172a',
                                    textAlign: form.settings?.headerStyle?.textAlign || 'center',
                                    fontStyle: form.settings?.headerStyle?.fontStyle || 'normal',
                                    textDecoration: form.settings?.headerStyle?.textDecoration || 'none',
                                    fontFamily: form.settings?.headerStyle?.fontFamily || 'inherit',
                                }}
                            >
                                <style dangerouslySetInnerHTML={{ __html: `
                                    @media (min-width: 640px) {
                                        h1.dynamic-title { font-size: ${form.settings?.headerStyle?.fontSize || '36px'} !important; }
                                    }
                                `}} />
                                <span className="dynamic-title">{form.title}</span>
                            </h1>
                            {form.description && (
                                <p className="text-slate-500 font-bold leading-relaxed max-w-lg mx-auto text-sm sm:text-base">
                                    {form.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Multi-page Progress Bar ── */}
                    {isMultiPage && (
                        <div className="bg-white rounded-[20px] sm:rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/20 p-5 sm:p-6">
                            {/* Progress track */}
                            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
                                    style={{
                                        width: `${(currentPage / totalPages) * 100}%`,
                                        backgroundColor: form.settings?.themeColor || '#3713ec'
                                    }}
                                />
                            </div>
                            {/* Page step indicators */}
                            <div className="flex items-center justify-between">
                                {pageLabels.map((label, idx) => {
                                    const pageNum = idx + 1;
                                    const isCompleted = pageNum < currentPage;
                                    const isCurrent = pageNum === currentPage;
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-300 ${
                                                    isCompleted
                                                        ? 'text-white shadow-md'
                                                        : isCurrent
                                                            ? 'text-white shadow-lg scale-110'
                                                            : 'bg-slate-100 text-slate-400'
                                                }`}
                                                style={isCompleted || isCurrent ? {
                                                    backgroundColor: form.settings?.themeColor || '#3713ec',
                                                    boxShadow: isCurrent ? `0 4px 12px ${form.settings?.themeColor || '#3713ec'}40` : undefined
                                                } : {}}
                                            >
                                                {isCompleted ? <Check size={14} strokeWidth={3} /> : pageNum}
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-wider truncate max-w-[80px] text-center ${
                                                isCurrent ? 'text-slate-700' : 'text-slate-400'
                                            }`}>
                                                {label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {currentPageFields.map((field) => {
                            const isContentField = ['image', 'video'].includes(field.type);
                            return (
                                <div
                                    key={field.id}
                                    className={`bg-white rounded-[20px] sm:rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/20 group transition-all duration-300 ${isContentField ? 'p-4 sm:p-6' : 'p-5 sm:p-8'}`}
                                    style={{ backgroundColor: field.style?.backgroundColor || '#ffffff' }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = `${form.settings?.themeColor}40`}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f1f5f9'}
                                >
                                    <div className={`flex flex-col gap-1 ${isContentField ? 'mb-4' : 'mb-5'}`}>
                                        <label 
                                            className={`font-black text-slate-800 flex items-center gap-2 ${isContentField ? 'text-[15px] justify-center opacity-70' : 'text-[17px]'}`}
                                            style={{
                                                fontSize: field.style?.fontSize || (isContentField ? '15px' : '17px'),
                                                fontWeight: field.style?.fontWeight === 'black' ? 900 : field.style?.fontWeight || 'bold',
                                                color: field.style?.color || '#1e293b',
                                                textAlign: field.style?.textAlign || (isContentField ? 'center' : 'left'),
                                                justifyContent: field.style?.textAlign === 'center' ? 'center' : field.style?.textAlign === 'right' ? 'flex-end' : 'flex-start',
                                                fontStyle: field.style?.fontStyle || 'normal',
                                                textDecoration: field.style?.textDecoration || 'none',
                                                fontFamily: field.style?.fontFamily || 'inherit'
                                            }}
                                        >
                                            {field.link ? (
                                                <a href={field.link} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                                                    {field.label}
                                                </a>
                                            ) : field.label}
                                            {field.required && !isContentField && <span className="text-red-500 text-lg">*</span>}
                                        </label>
                                        {field.description && (
                                            <p 
                                                className="leading-relaxed"
                                                style={{ 
                                                    textAlign: field.descriptionStyle?.textAlign || field.style?.textAlign || (isContentField ? 'center' : 'left'),
                                                    fontSize: field.descriptionStyle?.fontSize || '13px',
                                                    color: field.descriptionStyle?.color || '#64748b',
                                                    fontWeight: field.descriptionStyle?.fontWeight || '500',
                                                    fontStyle: field.descriptionStyle?.fontStyle || 'normal',
                                                    textDecoration: field.descriptionStyle?.textDecoration || 'none',
                                                    fontFamily: field.descriptionStyle?.fontFamily || field.style?.fontFamily || 'inherit'
                                                }}
                                            >
                                                {field.description}
                                            </p>
                                        )}
                                    </div>
                                    {renderField(field, handleInputChange, responses[field.id], form.settings?.themeColor)}
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation / Submit Section */}
                    <div className="flex flex-col items-center gap-8 pt-4 pb-20">
                        {isMultiPage ? (
                            <div className="flex items-center gap-4 w-full max-w-md">
                                {/* Back Button */}
                                {currentPage > 1 && (
                                    <button
                                        type="button"
                                        onClick={goPrevPage}
                                        className="group flex items-center gap-2 px-6 py-4 rounded-[20px] font-black text-lg transition-all border-2 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 hover:bg-white"
                                    >
                                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                        Back
                                    </button>
                                )}
                                {/* Next or Submit */}
                                {currentPage < totalPages ? (
                                    <button
                                        type="button"
                                        onClick={goNextPage}
                                        className="group flex-1 relative overflow-hidden text-white px-10 py-4 rounded-[20px] font-black text-lg transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95"
                                        style={{ backgroundColor: form.settings?.themeColor || '#3713ec', boxShadow: `0 20px 25px -5px ${(form.settings?.themeColor || '#3713ec')}40` }}
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-3">
                                            Next
                                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className={`group flex-1 relative overflow-hidden text-white px-10 py-4 rounded-[20px] font-black text-lg transition-all 
                                            ${submitting ? 'opacity-70 scale-95 cursor-not-allowed' : 'hover:opacity-90 hover:scale-[1.02] active:scale-95'}`}
                                        style={!submitting ? { backgroundColor: form.settings?.themeColor || '#3713ec', boxShadow: `0 20px 25px -5px ${(form.settings?.themeColor || '#3713ec')}40` } : {}}
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-3">
                                            {submitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    {form.settings?.buttonLabel || 'Submit'}
                                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </div>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`group relative overflow-hidden text-white px-10 py-4 rounded-[20px] font-black text-lg transition-all 
                                    ${submitting ? 'opacity-70 scale-95 cursor-not-allowed' : 'hover:opacity-90 hover:scale-[1.02] active:scale-95'}`}
                                style={!submitting ? { backgroundColor: form.settings?.themeColor || '#3713ec', boxShadow: `0 20px 25px -5px ${(form.settings?.themeColor || '#3713ec')}40` } : {}}
                            >
                                <div className="relative z-10 flex items-center gap-3">
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            {form.settings?.buttonLabel || 'Submit'}
                                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        )}

                        {/* Branding & Social Links */}
                        <div className="flex flex-col items-center gap-6 mt-8">
                            {form.settings?.socialLinks && Object.values(form.settings.socialLinks).some(l => l) && (
                                <div className="flex items-center gap-4">
                                    {form.settings.socialLinks.instagram && (
                                        <a href={formatSocialLink(form.settings.socialLinks.instagram)} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white rounded-full border border-slate-100 shadow-sm text-pink-500 hover:scale-110 transition-transform">
                                            <Instagram size={20} />
                                        </a>
                                    )}
                                    {form.settings.socialLinks.facebook && (
                                        <a href={formatSocialLink(form.settings.socialLinks.facebook)} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white rounded-full border border-slate-100 shadow-sm text-blue-600 hover:scale-110 transition-transform">
                                            <Facebook size={20} />
                                        </a>
                                    )}
                                    {form.settings.socialLinks.whatsapp && (
                                        <a href={form.settings.socialLinks.whatsapp.startsWith('http') ? form.settings.socialLinks.whatsapp : `https://wa.me/${form.settings.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white rounded-full border border-slate-100 shadow-sm text-emerald-500 hover:scale-110 transition-transform">
                                            <MessageCircle size={20} />
                                        </a>
                                    )}
                                    {form.settings.socialLinks.twitter && (
                                        <a href={formatSocialLink(form.settings.socialLinks.twitter)} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white rounded-full border border-slate-100 shadow-sm text-slate-900 hover:scale-110 transition-transform">
                                            <Twitter size={20} />
                                        </a>
                                    )}
                                    {form.settings.socialLinks.website && (
                                        <a href={formatSocialLink(form.settings.socialLinks.website)} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white rounded-full border border-slate-100 shadow-sm text-indigo-600 hover:scale-110 transition-transform">
                                            <Globe size={20} />
                                        </a>
                                    )}
                                </div>
                            )}

                            {form.settings?.footer?.text && (
                                <div 
                                    className="max-w-md w-full px-6"
                                    style={{
                                        textAlign: form.settings.footer.style?.textAlign || 'center',
                                        backgroundColor: form.settings.footer.style?.backgroundColor || 'transparent',
                                    }}
                                >
                                    <p 
                                        style={{
                                            fontSize: form.settings.footer.style?.fontSize || '12px',
                                            color: form.settings.footer.style?.color || '#94a3b8',
                                            fontWeight: form.settings.footer.style?.fontWeight || 'bold',
                                            lineHeight: '1.6',
                                            whiteSpace: 'pre-wrap'
                                        }}
                                    >
                                        {form.settings.footer.text}
                                    </p>
                                </div>
                            )}
                            
                            <div className="flex flex-col items-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden p-1 shadow-sm border border-slate-100 bg-white">
                                        <img src={logo} alt="JinraiForms" className="w-full h-full object-contain" />
                                    </div>
                                    <span className="font-black text-slate-900 text-[16px] tracking-tight">JinraiForms</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase text-center px-4">Built for Modern Data Collection</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const renderField = (field, onChange, value = '', themeColor = '#3713ec') => {
    const inputBase = `w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold placeholder:text-slate-400 outline-none focus:ring-4 transition-all duration-300`;
    const themeShadow = `0 0 0 4px ${themeColor}10`;

    switch (field.type) {
        case 'short_text':
            return (
                <input
                    type="text"
                    className={inputBase}
                    style={{ '--tw-ring-color': `${themeColor}10`, focusBorderColor: themeColor }}
                    onFocus={(e) => { e.target.style.borderColor = themeColor; e.target.style.boxShadow = themeShadow; }}
                    onBlur={(e) => { e.target.style.borderColor = '#f1f5f9'; e.target.style.boxShadow = 'none'; }}
                    placeholder="Type your answer here..."
                    required={field.required}
                    value={value}
                    onChange={(e) => onChange(field.id, e.target.value)}
                />
            );
        case 'paragraph':
            return (
                <textarea
                    className={`${inputBase} min-h-[120px] resize-none`}
                    onFocus={(e) => { e.target.style.borderColor = themeColor; e.target.style.boxShadow = themeShadow; }}
                    onBlur={(e) => { e.target.style.borderColor = '#f1f5f9'; e.target.style.boxShadow = 'none'; }}
                    placeholder="Type a long answer here..."
                    required={field.required}
                    value={value}
                    onChange={(e) => onChange(field.id, e.target.value)}
                />
            );
        case 'multiple_choice':
            return (
                <div className="space-y-3">
                    {(field.options && field.options.length > 0 ? field.options : ['Option 1', 'Option 2', 'Option 3']).map((option, idx) => (
                        <label
                            key={idx}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200`}
                            style={value === option ? { borderColor: themeColor, backgroundColor: `${themeColor}05` } : { borderColor: '#f8fafc', backgroundColor: '#f8fafc' }}
                            onClick={() => onChange(field.id, option)}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all`}
                                style={value === option ? { borderColor: themeColor, backgroundColor: themeColor } : { borderColor: '#cbd5e1', backgroundColor: 'white' }}>
                                {value === option && <div className="w-2 h-2 rounded-full bg-white scale-110" />}
                            </div>
                            <span 
                                className="font-bold transition-colors" 
                                style={{ 
                                    color: value === option ? themeColor : (field.optionStyle?.color || '#475569'),
                                    fontSize: field.optionStyle?.fontSize || '16px',
                                    fontWeight: field.optionStyle?.fontWeight || 'bold',
                                    fontStyle: field.optionStyle?.fontStyle || 'normal',
                                    textDecoration: field.optionStyle?.textDecoration || 'none'
                                }}
                            >
                                {option}
                            </span>
                        </label>
                    ))}
                </div>
            );
        case 'checkboxes':
            // Logic for multi-select could be more complex, simplification for now:
            const selectedArr = Array.isArray(value) ? value : [];
            const toggleValue = (opt) => {
                const newArr = selectedArr.includes(opt)
                    ? selectedArr.filter(i => i !== opt)
                    : [...selectedArr, opt];
                onChange(field.id, newArr);
            };
            return (
                <div className="space-y-3">
                    {(field.options && field.options.length > 0 ? field.options : ['Option 1', 'Option 2']).map((option, idx) => (
                        <label
                            key={idx}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200`}
                            style={selectedArr.includes(option) ? { borderColor: themeColor, backgroundColor: `${themeColor}05` } : { borderColor: '#f8fafc', backgroundColor: '#f8fafc' }}
                            onClick={() => toggleValue(option)}
                        >
                            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all`}
                                style={selectedArr.includes(option) ? { borderColor: themeColor, backgroundColor: themeColor } : { borderColor: '#cbd5e1', backgroundColor: 'white' }}>
                                {selectedArr.includes(option) && <Check size={14} className="text-white" strokeWidth={4} />}
                            </div>
                            <span 
                                className="font-bold transition-colors" 
                                style={{ 
                                    color: selectedArr.includes(option) ? themeColor : (field.optionStyle?.color || '#475569'),
                                    fontSize: field.optionStyle?.fontSize || '16px',
                                    fontWeight: field.optionStyle?.fontWeight || 'bold',
                                    fontStyle: field.optionStyle?.fontStyle || 'normal',
                                    textDecoration: field.optionStyle?.textDecoration || 'none'
                                }}
                            >
                                {option}
                            </span>
                        </label>
                    ))}
                </div>
            );
        case 'dropdown':
            return (
                <select
                    className={inputBase}
                    style={{ 
                        color: field.optionStyle?.color || '#000',
                        fontSize: field.optionStyle?.fontSize || '16px',
                        fontWeight: field.optionStyle?.fontWeight || 'bold',
                        fontStyle: field.optionStyle?.fontStyle || 'normal',
                        textDecoration: field.optionStyle?.textDecoration || 'none'
                    }}
                    value={value}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    required={field.required}
                >
                    <option value="" disabled>Select an option</option>
                    {(field.options && field.options.length > 0 ? field.options : ['Option 1', 'Option 2']).map((option, idx) => (
                        <option key={idx} value={option}>{option}</option>
                    ))}
                </select>
            );
        case 'bullet_list':
            return (
                <ul className="space-y-3 list-disc pl-8">
                    {(field.options && field.options.length > 0 ? field.options : ['Item 1', 'Item 2']).map((option, idx) => (
                        <li 
                            key={idx} 
                            style={{ 
                                color: field.optionStyle?.color || '#475569',
                                fontSize: field.optionStyle?.fontSize || '16px',
                                fontWeight: field.optionStyle?.fontWeight || 'bold',
                                fontStyle: field.optionStyle?.fontStyle || 'normal',
                                textDecoration: field.optionStyle?.textDecoration || 'none'
                            }}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            );
        case 'file_upload':
            return (
                <div className="relative group">
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => onChange(field.id, e.target.files[0]?.name)}
                    />
                    <div className="border-2 border-dashed border-slate-200 rounded-[20px] p-8 text-center bg-slate-50 transition-all duration-300"
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${themeColor}40`; e.currentTarget.style.backgroundColor = `${themeColor}05`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                    >
                        <Upload size={32} className="mx-auto text-slate-300 mb-4 transition-all duration-500" />
                        <p className="text-sm font-black text-slate-900 mb-1">
                            {value ? `File selected: ${value}` : 'Drop your file here'}
                        </p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            or click to browse Computer
                        </p>
                    </div>
                </div>
            );
        case 'date_picker':
            return (
                <input
                    type="date"
                    className={inputBase}
                    required={field.required}
                    value={value}
                    onChange={(e) => onChange(field.id, e.target.value)}
                />
            );
        case 'rating':
            return (
                <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map(s => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => onChange(field.id, s)}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300`}
                            style={value >= s ? { backgroundColor: themeColor, color: 'white', transform: 'scale(1.1)', boxShadow: `0 10px 15px -3px ${themeColor}40` } : { backgroundColor: '#f8fafc', color: '#cbd5e1' }}
                        >
                            <Star size={24} fill={value >= s ? "currentColor" : "none"} />
                        </button>
                    ))}
                </div>
            );
        case 'email':
            return (
                <input
                    type="email"
                    className={inputBase}
                    placeholder="Email address"
                    required={field.required}
                    value={value}
                    onChange={(e) => onChange(field.id, e.target.value)}
                />
            );
        case 'time_picker':
            return (
                <div className="relative">
                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="time"
                        className={`${inputBase} pl-12`}
                        required={field.required}
                        value={value}
                        onChange={(e) => onChange(field.id, e.target.value)}
                    />
                </div>
            );
        case 'color_picker':
            return (
                <div className="flex items-center gap-4">
                    <input
                        type="color"
                        className="w-16 h-16 rounded-2xl border-none cursor-pointer bg-transparent"
                        required={field.required}
                        value={value || '#3713ec'}
                        onChange={(e) => onChange(field.id, e.target.value)}
                    />
                    <span className="font-mono font-bold text-slate-500 uppercase">{value || '#3713ec'}</span>
                </div>
            );
        case 'linear_scale':
            const min = field.min || 1;
            const max = field.max || 5;
            const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
            return (
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{field.minLabel}</span>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{field.maxLabel}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                        {range.map(v => (
                            <button
                                key={v}
                                type="button"
                                onClick={() => onChange(field.id, v)}
                                className={`flex-1 aspect-square sm:aspect-auto sm:h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-300 border-2`}
                                style={value === v
                                    ? { backgroundColor: themeColor, borderColor: themeColor, color: 'white', transform: 'scale(1.05)', boxShadow: `0 10px 15px -3px ${themeColor}40` }
                                    : { backgroundColor: '#f8fafc', borderColor: '#f1f5f9', color: '#64748b' }
                                }
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>
            );
        case 'slider':
            return (
                <div className="space-y-4 px-2">
                    <div className="flex justify-between font-black text-slate-400 text-[10px] uppercase tracking-widest">
                        <span>{field.min || 0}</span>
                        <span style={{ color: themeColor }}>Value: {value || field.min || 0}</span>
                        <span>{field.max || 100}</span>
                    </div>
                    <input
                        type="range"
                        min={field.min || 0}
                        max={field.max || 100}
                        step={field.step || 1}
                        value={value || field.min || 0}
                        onChange={(e) => onChange(field.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#3713ec]"
                        style={{ accentColor: themeColor }}
                    />
                </div>
            );
        case 'image':
            return field.imageUrl ? (
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                    <img src={field.imageUrl} alt={field.label} className="w-full h-auto object-cover" />
                </div>
            ) : (
                <div className="p-8 bg-slate-50 rounded-2xl text-center text-slate-300 font-bold border-2 border-dashed border-slate-100 italic">
                    Image placeholder
                </div>
            );
        case 'video':
            const getYoutubeId = (url) => {
                if (!url) return null;
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = url.match(regExp);
                return (match && match[2].length === 11) ? match[2] : null;
            };
            const videoId = getYoutubeId(field.videoUrl);
            return videoId ? (
                <div className="rounded-2xl overflow-hidden aspect-video border border-slate-100 shadow-sm bg-black">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            ) : (
                <div className="p-8 bg-slate-900 rounded-2xl text-center text-slate-500 font-bold border border-slate-800 italic">
                    YouTube video ID could not be resolved
                </div>
            );
        default:
            return <p className="text-red-500">Unsupported field type: {field.type}</p>;
    }
}

export default LiveForm;
