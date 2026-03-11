import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/api'; // Import API client
import {
    Type, AlignLeft, CheckSquare, Circle, ChevronDown,
    Upload, Calendar, Star, Mail, Plus, Zap, Eye, Send,
    Trash2, GripVertical, ChevronRight, Settings, Globe,
    ToggleRight, Bell, Check, X, ArrowLeft, Save, Share2
} from 'lucide-react';

/* ───────────────────────── Field palette ───────────────────────── */
const BASIC_FIELDS = [
    { type: 'short_text', label: 'Short Text', icon: <Type size={16} /> },
    { type: 'paragraph', label: 'Paragraph', icon: <AlignLeft size={16} /> },
    { type: 'multiple_choice', label: 'Multiple Choice', icon: <Circle size={16} /> },
    { type: 'checkboxes', label: 'Checkboxes', icon: <CheckSquare size={16} /> },
    { type: 'dropdown', label: 'Dropdown', icon: <ChevronDown size={16} /> },
];

const ADVANCED_FIELDS = [
    { type: 'file_upload', label: 'File Upload', icon: <Upload size={16} /> },
    { type: 'date_picker', label: 'Date Picker', icon: <Calendar size={16} /> },
    { type: 'rating', label: 'Rating', icon: <Star size={16} /> },
    { type: 'email', label: 'Email', icon: <Mail size={16} /> },
];

/* ───────────────────────── Field renderers ───────────────────────── */
const FieldPreview = ({ field, isSelected, onSelect, onDelete, themeColor }) => {
    const baseInput = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-400 bg-slate-50 outline-none pointer-events-none';

    const renderInput = () => {
        switch (field.type) {
            case 'short_text':
                return <input className={baseInput} placeholder="Short answer text" readOnly />;
            case 'paragraph':
                return <textarea className={`${baseInput} resize-none h-20`} placeholder="Long answer text" readOnly />;
            case 'multiple_choice':
                return (
                    <div className="space-y-2">
                        {(field.options || ['Option 1', 'Option 2', 'Option 3']).map((o, i) => (
                            <label key={i} className="flex items-center gap-2.5 text-sm text-slate-500">
                                <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                                {o}
                            </label>
                        ))}
                    </div>
                );
            case 'checkboxes':
                return (
                    <div className="space-y-2">
                        {(field.options || ['Option 1', 'Option 2']).map((o, i) => (
                            <label key={i} className="flex items-center gap-2.5 text-sm text-slate-500">
                                <div className="w-4 h-4 rounded border-2 border-slate-300 flex-shrink-0" />
                                {o}
                            </label>
                        ))}
                    </div>
                );
            case 'dropdown':
                return (
                    <div className={`${baseInput} flex items-center justify-between`}>
                        <span>Select an option</span>
                        <ChevronDown size={14} className="text-slate-400" />
                    </div>
                );
            case 'file_upload':
                return (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                        <Upload size={20} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-xs text-slate-400">Click to upload or drag & drop</p>
                    </div>
                );
            case 'date_picker':
                return <input type="text" className={baseInput} placeholder="MM / DD / YYYY" readOnly />;
            case 'rating':
                return (
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={22} className="text-slate-200 fill-slate-100" />
                        ))}
                    </div>
                );
            case 'email':
                return <input className={baseInput} placeholder="example@email.com" readOnly />;
            default:
                return <input className={baseInput} placeholder="Answer" readOnly />;
        }
    };

    return (
        <div
            onClick={onSelect}
            className={`group relative bg-white rounded-[20px] border-2 transition-all duration-200 cursor-pointer select-none
                ${isSelected
                    ? 'shadow-lg'
                    : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
                }`}
            style={isSelected ? { borderColor: themeColor, boxShadow: `0 10px 25px -5px ${themeColor}15` } : {}}
        >
            {/* Drag handle */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                <GripVertical size={16} />
            </div>

            <div className="p-5 pl-10">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <p className="font-bold text-slate-800 text-[14px] leading-snug">{field.label}</p>
                    <button
                        onClick={e => { e.stopPropagation(); onDelete(); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-300 hover:text-red-500 rounded-lg"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
                {renderInput()}
            </div>

            {isSelected && (
                <div className="absolute -left-1 top-5 bottom-5 w-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
            )}
        </div>
    );
};

/* ───────────────────────── Settings panel ───────────────────────── */
const SettingsPanel = ({ activeTab, setActiveTab, settings, setSettings, selectedField, updateField }) => (
    <div className="w-64 flex-shrink-0 bg-white border-l border-slate-100 flex flex-col h-full overflow-y-auto">
        {/* Tab bar */}
        <div className="flex border-b border-slate-100 sticky top-0 bg-white z-10">
            {['Field', 'Global'].map(t => (
                <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`flex-1 py-4 text-[12px] font-black transition-all border-b-2 -mb-px ${activeTab === t
                        ? 'border-[#3713ec] text-[#3713ec]'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                >
                    {t}
                </button>
            ))}
        </div>

        <div className="p-5 space-y-6">
            {activeTab === 'Global' ? (
                <>
                    <SettingSection title="FORM VISIBILITY">
                        <select
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white outline-none focus:ring-2 focus:ring-[#3713ec]/20 focus:border-[#3713ec]/40"
                            value={settings.visibility}
                            onChange={e => setSettings(s => ({ ...s, visibility: e.target.value }))}
                        >
                            <option>Public (Anyone with link)</option>
                            <option>Private (Login required)</option>
                            <option>Password protected</option>
                        </select>
                    </SettingSection>

                    <SettingSection title="BUTTON LABEL">
                        <input
                            type="text"
                            value={settings.buttonLabel}
                            onChange={e => setSettings(s => ({ ...s, buttonLabel: e.target.value }))}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#3713ec]/20 focus:border-[#3713ec]/40"
                        />
                    </SettingSection>

                    <ToggleSetting
                        label="Allow re-submission"
                        desc="Let users fill the form multiple times"
                        value={settings.resubmission}
                        onChange={v => setSettings(s => ({ ...s, resubmission: v }))}
                    />

                    <SettingSection title="EMAIL NOTIFICATIONS">
                        <ToggleSetting
                            label="Email notifications"
                            desc="Get alerted for every response"
                            value={settings.emailNotifications}
                            onChange={v => setSettings(s => ({ ...s, emailNotifications: v }))}
                        />
                    </SettingSection>

                    <SettingSection title="FORM THEME">
                        <div className="flex flex-wrap gap-2 mt-2">
                            {['#3713ec', '#ec135d', '#13ec9a', '#ec8c13', '#7c13ec', '#000000'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => setSettings(s => ({ ...s, themeColor: color }))}
                                    className={`w-8 h-8 rounded-lg border-2 transition-all ${settings.themeColor === color ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </SettingSection>

                    <SettingSection title="BANNER IMAGE">
                        <div className="space-y-3">
                            <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 min-h-20 flex items-center justify-center">
                                {settings.bannerImage ? (
                                    <>
                                        <img src={settings.bannerImage} alt="Banner" className="w-full h-20 object-cover" />
                                        <button
                                            onClick={() => setSettings(s => ({ ...s, bannerImage: null }))}
                                            className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white rounded-lg text-red-500 shadow-sm transition-all"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-1 text-slate-300 py-4">
                                        <Upload size={16} />
                                        <span className="text-[10px] font-bold">No banner image</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Paste image URL here..."
                                    className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-[#3713ec]/40 bg-white"
                                    onBlur={(e) => {
                                        if (e.target.value) {
                                            setSettings(s => ({ ...s, bannerImage: e.target.value }));
                                            e.target.value = '';
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value) {
                                            setSettings(s => ({ ...s, bannerImage: e.target.value }));
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </SettingSection>
                </>
            ) : (
                selectedField ? (
                    <div className="space-y-6">
                        <SettingSection title="FIELD LABEL">
                            <input
                                type="text"
                                value={selectedField.label}
                                onChange={e => updateField(selectedField.id, { label: e.target.value })}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#3713ec]/20 focus:border-[#3713ec]/40"
                            />
                        </SettingSection>

                        <ToggleSetting
                            label="Required Field"
                            desc="Make answering this mandatory"
                            value={selectedField.required || false}
                            onChange={v => updateField(selectedField.id, { required: v })}
                        />

                        {(selectedField.type === 'multiple_choice' || selectedField.type === 'checkboxes' || selectedField.type === 'dropdown') && (
                            <SettingSection title="OPTIONS">
                                <div className="space-y-2">
                                    {(selectedField.options || ['Option 1', 'Option 2', 'Option 3']).map((opt, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={e => {
                                                    const newOpts = [...(selectedField.options || ['Option 1', 'Option 2', 'Option 3'])];
                                                    newOpts[i] = e.target.value;
                                                    updateField(selectedField.id, { options: newOpts });
                                                }}
                                                className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-[#3713ec]/40"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newOpts = (selectedField.options || ['Option 1', 'Option 2', 'Option 3']).filter((_, idx) => idx !== i);
                                                    updateField(selectedField.id, { options: newOpts });
                                                }}
                                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const currentOpts = selectedField.options || ['Option 1', 'Option 2', 'Option 3'];
                                            updateField(selectedField.id, { options: [...currentOpts, `Option ${currentOpts.length + 1}`] });
                                        }}
                                        className="w-full py-2 border border-dashed border-slate-200 rounded-lg text-[11px] font-black text-slate-400 hover:border-[#3713ec]/40 hover:text-[#3713ec] transition-all flex items-center justify-center gap-1.5"
                                    >
                                        <Plus size={12} /> ADD OPTION
                                    </button>
                                </div>
                            </SettingSection>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-10 text-slate-400">
                        <Settings size={32} className="mx-auto mb-3 opacity-30" />
                        <p className="text-[13px] font-bold">Select a field</p>
                        <p className="text-[12px] mt-1">to edit its settings</p>
                    </div>
                )
            )}
        </div>
    </div>
);

const SettingSection = ({ title, children }) => (
    <div className="space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        {children}
    </div>
);

const ToggleSetting = ({ label, desc, value, onChange }) => (
    <div className="flex items-start justify-between gap-3">
        <div>
            <p className="text-[13px] font-bold text-slate-800">{label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
        </div>
        <button
            onClick={() => onChange(!value)}
            className={`relative w-10 h-6 rounded-full transition-all flex-shrink-0 mt-0.5 ${value ? 'bg-[#3713ec]' : 'bg-slate-200'}`}
        >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${value ? 'left-5' : 'left-1'}`} />
        </button>
    </div>
);

/* ───────────────────────── Main page ───────────────────────── */
let idCounter = 0;
const uid = () => ++idCounter;

const CreateForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('id');

    const [formTitle, setFormTitle] = useState('Untitled Form');
    const [formDesc, setFormDesc] = useState('');
    const [fields, setFields] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [settingsTab, setSettingsTab] = useState('Global');
    const [settings, setSettings] = useState({
        visibility: 'Public (Anyone with link)',
        buttonLabel: 'Submit',
        resubmission: true,
        emailNotifications: false,
        themeColor: '#3713ec',
        bannerImage: null,
    });
    const [status, setStatus] = useState('Draft');
    const [published, setPublished] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formId, setFormId] = useState(null); // Track the created form ID
    const [loading, setLoading] = useState(false);
    const [responsesCount, setResponsesCount] = useState(0);
    const [viewsCount, setViewsCount] = useState(0);

    useEffect(() => {
        if (editId) {
            fetchForm(editId);
        }
    }, [editId]);

    const fetchForm = async (id) => {
        try {
            setLoading(true);
            const res = await api.get(`/forms/${id}`);
            const data = res.data.data;
            setFormId(data._id);
            setFormTitle(data.title);
            setFormDesc(data.description || '');
            setFields(data.fields || []);
            if (data.fields && data.fields.length > 0) {
                const maxId = Math.max(...data.fields.map(f => f.id || 0));
                idCounter = maxId;
            }
            if (data.settings) setSettings(data.settings);
            setStatus(data.status);
            setResponsesCount(data.responsesCount || 0);
            setViewsCount(data.viewsCount || 0);
        } catch (error) {
            console.error("Failed to load form", error);
            alert("Failed to load form.");
        } finally {
            setLoading(false);
        }
    };

    const addField = (type, label) => {
        const id = uid();
        setFields(prev => [...prev, { id, type, label, required: false }]);
        setSelectedId(id);
        setSettingsTab('Field');
    };

    const handleSelectField = (id) => {
        setSelectedId(id);
        setSettingsTab('Field');
    };

    const updateField = (id, updates) => {
        setFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const deleteField = (id) => {
        setFields(prev => prev.filter(f => f.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    const saveFormToDb = async (publishStatus = 'Draft') => {
        try {
            setSaving(true);
            const payload = {
                title: formTitle,
                description: formDesc,
                fields: fields.map(f => ({
                    id: f.id,
                    type: f.type,
                    label: f.label,
                    required: f.required || false,
                    options: f.options || []
                })),
                settings,
                status: publishStatus
            };

            if (formId) {
                // Update existing
                await api.put(`/forms/${formId}`, payload);
            } else {
                // Create new
                const res = await api.post('/forms', payload);
                setFormId(res.data.data._id);
            }

            if (publishStatus === 'Active') {
                setPublished(true);
                setTimeout(() => setPublished(false), 2500);
            } else {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (error) {
            console.error("Failed to save form", error);
            const msg = error.response?.data?.message || "Failed to save form. Please try again.";
            alert(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleSave = () => {
        setStatus('Draft');
        saveFormToDb('Draft');
    };

    const handlePublish = () => {
        setStatus('Active');
        saveFormToDb('Active');
    };

    const handleShare = () => {
        if (!formId) {
            alert("Please save the form first to share it.");
            return;
        }
        const url = `${window.location.origin}/form/${formId}`;
        navigator.clipboard.writeText(url);
        alert('Form link copied to clipboard!');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            {/* Top Bar */}
            <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/forms')}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors" style={{ backgroundColor: settings.themeColor }}>
                            <Zap className="text-white fill-white" size={13} />
                        </div>
                        <span className="font-black text-slate-900 text-[14px]">JinraiForms</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-[12px] text-slate-400 font-bold">
                        <span className="text-slate-700">{formTitle || 'Untitled Form'}</span>
                        <span>•</span>
                        <span className="text-emerald-500">Auto-saved</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* View count / response count */}
                    <div className="hidden md:flex items-center gap-4 mr-2">
                        <button
                            onClick={() => formId ? window.open(`http://localhost:5173/form/${formId}`, '_blank') : alert("Please save the form before previewing.")}
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                            title="Preview Form"
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                            title="Share Form"
                        >
                            <Share2 size={18} />
                        </button>
                        <button
                            onClick={() => setSettingsTab('Global')}
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                            title="Form Settings"
                        >
                            <Settings size={18} />
                        </button>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-black transition-all ${saved
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {saving ? <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
                        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
                    </button>

                    <button
                        onClick={handlePublish}
                        disabled={saving}
                        className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-[12px] font-black shadow-lg transition-all ${published
                            ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                            : 'text-white hover:opacity-90'
                            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={!published ? { backgroundColor: settings.themeColor, boxShadow: `0 10px 15px -3px ${settings.themeColor}30` } : {}}
                    >
                        {saving ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : published ? <Check size={14} /> : <Send size={14} />}
                        {published ? 'Published!' : 'Publish'}
                    </button>

                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-300 to-rose-400 flex items-center justify-center text-white text-[11px] font-black ml-1 shadow-sm">
                        AR
                    </div>
                </div>
            </header>

            {/* Body: Left panel | Canvas | Right panel */}
            <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>

                {/* ── Left: Field Palette ── */}
                <aside className="w-52 flex-shrink-0 bg-white border-r border-slate-100 overflow-y-auto">
                    <FieldGroup title="BASIC FIELDS" fields={BASIC_FIELDS} onAdd={addField} themeColor={settings.themeColor} />
                    <FieldGroup title="ADVANCED FIELDS" fields={ADVANCED_FIELDS} onAdd={addField} themeColor={settings.themeColor} />
                </aside>

                {/* ── Center: Canvas ── */}
                <main className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="max-w-2xl mx-auto space-y-4">
                        {/* Banner Image */}
                        {settings.bannerImage && (
                            <div className="w-full h-40 rounded-[20px] overflow-hidden border border-slate-100 shadow-sm mb-4">
                                <img src={settings.bannerImage} alt="Form Banner" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Form title card */}
                        <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-8" style={{ borderTop: `6px solid ${settings.themeColor}` }}>
                            <input
                                value={formTitle}
                                onChange={e => setFormTitle(e.target.value)}
                                className="w-full text-3xl font-black text-slate-900 bg-transparent outline-none placeholder:text-slate-300 border-b-2 border-transparent focus:border-[#3713ec]/30 pb-1 transition-colors"
                                placeholder="Untitled Form"
                            />
                            <input
                                value={formDesc}
                                onChange={e => setFormDesc(e.target.value)}
                                className="w-full mt-3 text-[14px] text-slate-400 bg-transparent outline-none placeholder:text-slate-300"
                                placeholder="Add a description for your form"
                            />
                        </div>

                        {/* Fields */}
                        {fields.map(field => (
                            <FieldPreview
                                key={field.id}
                                field={field}
                                isSelected={selectedId === field.id}
                                onSelect={() => handleSelectField(field.id)}
                                onDelete={() => deleteField(field.id)}
                                themeColor={settings.themeColor}
                            />
                        ))}

                        {/* Empty state */}
                        {fields.length === 0 && (
                            <div className="bg-white rounded-[20px] border-2 border-dashed border-slate-200 p-16 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-5">
                                    <Plus size={28} className="text-slate-300" />
                                </div>
                                <h3 className="font-black text-slate-800 text-lg mb-1">Build your form</h3>
                                <p className="text-sm text-slate-400 max-w-xs">
                                    Drag and drop fields from the left panel to start collecting data.
                                </p>
                                <button
                                    onClick={() => addField('short_text', 'Question')}
                                    className="mt-6 px-5 py-2.5 font-black text-[13px] rounded-xl transition-all"
                                    style={{ backgroundColor: `${settings.themeColor}15`, color: settings.themeColor }}
                                >
                                    + Add your first field
                                </button>
                            </div>
                        )}

                        {/* Add section strip */}
                        {fields.length > 0 && (
                            <button
                                onClick={() => addField('short_text', 'New Question')}
                                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[12px] font-black text-slate-400 hover:bg-white transition-all flex items-center justify-center gap-2 group"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = settings.themeColor;
                                    e.currentTarget.style.color = settings.themeColor;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.color = '#94a3b8';
                                }}
                            >
                                <Plus size={14} /> ADD SECTION
                            </button>
                        )}

                        {/* Footer badges */}
                        <div className="flex items-center justify-center gap-6 py-2 text-[11px] text-slate-400 font-bold">
                            <span className="flex items-center gap-1.5">🔒 End-to-end encrypted</span>
                            <span className="flex items-center gap-1.5">✅ Compliant with GDPR</span>
                        </div>
                    </div>
                </main>

                {/* ── Right: Settings Panel ── */}
                <SettingsPanel
                    activeTab={settingsTab}
                    setActiveTab={setSettingsTab}
                    settings={settings}
                    setSettings={setSettings}
                    selectedField={fields.find(f => f.id === selectedId)}
                    updateField={updateField}
                />
            </div>

            {/* Status bar */}
            <div className="h-8 bg-white border-t border-slate-100 flex items-center justify-between px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    CONNECTED
                </div>
                <div className="flex items-center gap-6">
                    <span>{responsesCount} RESPONSES</span>
                    <span>{viewsCount} VIEWS</span>
                    <span>DOCS</span>
                    <span>SUPPORT</span>
                    <span>V2.4.0-STABLE</span>
                </div>
            </div>
        </div>
    );
};

/* ───────────────────────── Field group in palette ───────────────────────── */
const FieldGroup = ({ title, fields, onAdd, themeColor }) => (
    <div className="p-4">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">{title}</p>
        <div className="space-y-1">
            {fields.map(f => (
                <button
                    key={f.type}
                    onClick={() => onAdd(f.type, f.label)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold text-slate-600 rounded-xl transition-all group text-left"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${themeColor}10`;
                        e.currentTarget.style.color = themeColor;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#475569';
                    }}
                >
                    <span className="text-slate-400 group-hover:text-inherit transition-colors">{f.icon}</span>
                    {f.label}
                </button>
            ))}
        </div>
    </div>
);

export default CreateForm;
