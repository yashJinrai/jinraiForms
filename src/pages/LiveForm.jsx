import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import {
    Zap, Check, AlertCircle, ChevronRight,
    Upload, Calendar, Star, Send
} from 'lucide-react';

const LiveForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchForm();
    }, [id]);

    const fetchForm = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/forms/public/${id}`);
            if (res.data.success) {
                setForm(res.data.data);
            } else {
                setError("Form not found or unavailable.");
            }
        } catch (err) {
            console.error("Error fetching form:", err);
            setError(err.response?.data?.message || "Failed to load form. It might be private or deleted.");
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation for 'required' fields
        const missingFields = form.fields.filter(f => f.required && !responses[f.id]);
        if (missingFields.length > 0) {
            alert(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`);
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
                submitterEmail: submitterEmail || undefined
            };

            await api.post(`/forms/public/${id}/submit`, submitData);
            setSubmitted(true);
        } catch (err) {
            console.error("Submission error:", err);
            alert("Failed to submit form. Please try again.");
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
                    <div className="pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Zap className="text-[#3713ec] fill-[#3713ec]" size={16} />
                            <span className="text-[12px] font-black text-slate-400 tracking-widest uppercase">Powered by JinraiForms</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Banner Image */}
                    {form.settings?.bannerImage && (
                        <div className="w-full h-48 rounded-[32px] overflow-hidden border border-slate-100 shadow-xl mb-4">
                            <img src={form.settings.bannerImage} alt="Form Banner" className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Form Header Card */}
                    <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50" style={{ borderTop: `10px solid ${form.settings?.themeColor || '#3713ec'}` }}>
                        <div className="p-10 text-center">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
                                {form.title}
                            </h1>
                            {form.description && (
                                <p className="text-slate-500 font-bold leading-relaxed max-w-lg mx-auto">
                                    {form.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Fields List */}
                    <div className="space-y-4">
                        {form.fields && form.fields.map((field) => (
                            <div
                                key={field.id}
                                className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-lg shadow-slate-200/20 group transition-all duration-300"
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = `${form.settings?.themeColor}40`}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f1f5f9'}
                            >
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="flex-1">
                                        <label className="text-[17px] font-black text-slate-800 flex items-center gap-2">
                                            {field.label}
                                            {field.required && <span className="text-red-500 text-lg">*</span>}
                                        </label>
                                    </div>
                                </div>
                                {renderField(field, handleInputChange, responses[field.id], form.settings?.themeColor)}
                            </div>
                        ))}
                    </div>

                    {/* Submit Section */}
                    <div className="flex flex-col items-center gap-8 pt-4 pb-20">
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

                        {/* Branding */}
                        <div className="flex flex-col items-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform">
                                    <Zap size={14} className="text-white fill-white" />
                                </div>
                                <span className="font-black text-slate-900 text-[14px] tracking-tight">JinraiForms</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Built for Modern Data Collection</span>
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
                            <span className={`font-bold transition-colors`} style={value === option ? { color: themeColor } : { color: '#475569' }}>
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
                            <span className={`font-bold transition-colors`} style={selectedArr.includes(option) ? { color: themeColor } : { color: '#475569' }}>
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
        default:
            return <p className="text-red-500">Unsupported field type: {field.type}</p>;
    }
}

export default LiveForm;
