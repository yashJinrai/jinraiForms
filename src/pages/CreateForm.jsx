import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/api'; // Import API client
import {
    Type, AlignLeft, CheckSquare, Circle, ChevronDown,
    Upload, Calendar, Star, Mail, Plus, Zap, Eye, Send,
    Trash2, GripVertical, ChevronRight, ChevronLeft, Settings, Globe,
    ToggleRight, Bell, Check, X, ArrowLeft, Save, Share2,
    Clock, Sliders, Palette, Image, Youtube, Maximize2,
    Bold, Italic, Underline, Link as LinkIcon, List as ListIcon,
    AlignCenter, AlignRight, MessageSquare, Instagram, Facebook, MessageCircle, Twitter,
    Layers, FilePlus, Edit3, Copy
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../hooks/useAuth';
import { getImageUrl } from '../lib/utils';
import logo from '../assets/images/JLogobg.png';

const formatSocialLink = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
};

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
    { type: 'time_picker', label: 'Time Picker', icon: <Clock size={16} /> },
    { type: 'rating', label: 'Rating', icon: <Star size={16} /> },
    { type: 'linear_scale', label: 'Linear Scale', icon: <Maximize2 size={16} /> },
    { type: 'slider', label: 'Range Slider', icon: <Sliders size={16} /> },
    { type: 'color_picker', label: 'Color Picker', icon: <Palette size={16} /> },
    { type: 'email', label: 'Email', icon: <Mail size={16} /> },
];

const CONTENT_FIELDS = [
    { type: 'image', label: 'Image', icon: <Image size={16} /> },
    { type: 'video', label: 'Video (YouTube)', icon: <Youtube size={16} /> },
    { type: 'bullet_list', label: 'Bullet List', icon: <ListIcon size={16} /> },
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
                            <label 
                                key={i} 
                                className="flex items-center gap-2.5 text-sm"
                                style={{
                                    fontSize: field.optionStyle?.fontSize || '14px',
                                    fontWeight: field.optionStyle?.fontWeight || '500',
                                    color: field.optionStyle?.color || '#64748b'
                                }}
                            >
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
                            <label 
                                key={i} 
                                className="flex items-center gap-2.5 text-sm"
                                style={{
                                    fontSize: field.optionStyle?.fontSize || '14px',
                                    fontWeight: field.optionStyle?.fontWeight || '500',
                                    color: field.optionStyle?.color || '#64748b'
                                }}
                            >
                                <div className="w-4 h-4 rounded border-2 border-slate-300 flex-shrink-0" />
                                {o}
                            </label>
                        ))}
                    </div>
                );
            case 'dropdown':
                return (
                    <div className={`${baseInput} flex items-center justify-between`}>
                        <span style={{ color: field.optionStyle?.color }}>Select an option</span>
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
            case 'time_picker':
                return <input type="text" className={baseInput} placeholder="00 : 00 AM" readOnly />;
            case 'color_picker':
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-100" />
                        <span className="text-sm text-slate-400">Choose a color</span>
                    </div>
                );
            case 'linear_scale':
                return (
                    <div className="flex items-center justify-between gap-4 py-2">
                        <span className="text-[10px] font-black text-slate-400">{field.minLabel || 'Min'}</span>
                        <div className="flex-1 flex justify-between px-4">
                            {[1, 2, 3, 4, 5].map(v => (
                                <div key={v} className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">{v}</div>
                            ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-400">{field.maxLabel || 'Max'}</span>
                    </div>
                );
            case 'slider':
                return (
                    <div className="py-4">
                        <div className="h-2 w-full bg-slate-100 rounded-full relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-slate-300 shadow-sm" />
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
                            <span>{field.min || 0}</span>
                            <span>{field.max || 100}</span>
                        </div>
                    </div>
                );
            case 'image':
                return (
                    <div className="w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300 overflow-hidden">
                        {field.imageUrl ? (
                            <img src={getImageUrl(field.imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <Image size={24} className="mb-2" />
                                <span className="text-[10px] font-bold">IMAGE CONTENT</span>
                            </>
                        )}
                    </div>
                );
            case 'video':
                const videoId = field.videoUrl ? (field.videoUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/) || [])[2] : null;

                return (
                    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group/vid relative aspect-video flex flex-col items-center justify-center">
                        {videoId && videoId.length === 11 ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                className="pointer-events-none"
                            ></iframe>
                        ) : (
                            <>
                                <Youtube size={32} className="mb-2 text-slate-700" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">YouTube Video Preview</span>
                            </>
                        )}
                    </div>
                );
            case 'bullet_list':
                return (
                    <ul className="space-y-2 list-disc pl-5">
                        {(field.options || ['Item 1', 'Item 2']).map((o, i) => (
                            <li 
                                key={i} 
                                className="text-sm"
                                style={{
                                    fontSize: field.optionStyle?.fontSize || '14px',
                                    fontWeight: field.optionStyle?.fontWeight || '500',
                                    color: field.optionStyle?.color || '#64748b'
                                }}
                            >
                                {o}
                            </li>
                        ))}
                    </ul>
                );
            default:
                return <input className={baseInput + " dark:bg-slate-800 dark:border-slate-800 dark:text-slate-500"} placeholder="Answer" readOnly />;
        }
    };

    return (
        <div
            onClick={onSelect}
            className={`group relative bg-white dark:bg-[#1e1c2e] rounded-[20px] border-2 transition-all duration-200 cursor-pointer select-none
                ${isSelected
                    ? 'shadow-lg'
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md'
                }`}
            style={{ 
                borderColor: isSelected ? themeColor : (document.documentElement.classList.contains('dark') ? '#1e293b' : '#f1f5f9'), 
                boxShadow: isSelected ? `0 10px 25px -5px ${themeColor}15` : 'none',
                backgroundColor: field.style?.backgroundColor || (document.documentElement.classList.contains('dark') ? '#1e1c2e' : '#ffffff')
            }}
        >
            {/* Drag handle */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                <GripVertical size={16} />
            </div>

            <div className="p-5 pl-10">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <p 
                        className="font-bold text-slate-800 dark:text-white text-[14px] leading-snug flex-1"
                        style={{
                            fontSize: field.style?.fontSize || '14px',
                            fontWeight: field.style?.fontWeight === 'black' ? 900 : field.style?.fontWeight || 'bold',
                            color: document.documentElement.classList.contains('dark') ? (field.style?.color ? field.style.color : '#ffffff') : (field.style?.color || '#1e293b'),
                            textAlign: field.style?.textAlign || 'left',
                            fontStyle: field.style?.fontStyle || 'normal',
                            textDecoration: field.style?.textDecoration || 'none',
                            fontFamily: field.style?.fontFamily || 'inherit',
                        }}
                    >
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                    </p>
                    <button
                        type="button"
                        onClick={e => { e.stopPropagation(); onDelete(); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-300 hover:text-red-500 rounded-lg"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
                {field.description && (
                    <p 
                        className="mb-3 leading-relaxed"
                        style={{ 
                            textAlign: field.descriptionStyle?.textAlign || field.style?.textAlign || 'left',
                            fontSize: field.descriptionStyle?.fontSize || '11px',
                            color: field.descriptionStyle?.color || '#94a3b8',
                            fontStyle: field.descriptionStyle?.fontStyle || 'normal',
                            textDecoration: field.descriptionStyle?.textDecoration || 'none',
                            fontFamily: field.descriptionStyle?.fontFamily || field.style?.fontFamily || 'inherit',
                        }}
                    >
                        {field.description}
                    </p>
                )}
                {renderInput()}
            </div>

            {isSelected && (
                <div className="absolute -left-1 top-5 bottom-5 w-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
            )}
        </div>
    );
};

/* ───────────────────────── Style Toolbar ───────────────────────── */
const StyleToolbar = ({ style, onChange, showLink, linkValue, onLinkChange, showBg = false }) => (
    <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
            <div>
                <p className="text-[9px] font-black text-slate-300 mb-1">FONT SIZE</p>
                <select
                    value={style?.fontSize || '14px'}
                    onChange={e => onChange({ ...style, fontSize: e.target.value })}
                    className="w-full border border-slate-100 dark:border-slate-800 rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 outline-none bg-white dark:bg-slate-800 transition-colors"
                >
                    <option value="12px">XS</option>
                    <option value="14px">Base</option>
                    <option value="18px">MD</option>
                    <option value="24px">LG</option>
                    <option value="32px">XL</option>
                    <option value="48px">2XL</option>
                </select>
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-300 mb-1">FONT FAMILY</p>
                <select
                    value={style?.fontFamily || 'Inter'}
                    onChange={e => onChange({ ...style, fontFamily: e.target.value })}
                    className="w-full border border-slate-100 dark:border-slate-800 rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 outline-none bg-white dark:bg-slate-800 transition-colors"
                >
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="'Roboto', sans-serif">Roboto</option>
                    <option value="'Playfair Display', serif">Playfair</option>
                    <option value="'Fira Code', monospace">Mono</option>
                    <option value="'Outfit', sans-serif">Outfit</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <div>
                <p className="text-[9px] font-black text-slate-300 mb-1">ALIGNMENT</p>
                <div className="flex bg-slate-50 rounded-lg p-0.5">
                    {['left', 'center', 'right'].map(align => (
                        <button
                            key={align}
                            onClick={() => onChange({ ...style, textAlign: align })}
                            className={`flex-1 py-1 rounded-md flex items-center justify-center transition-all ${style?.textAlign === align ? 'bg-white shadow-sm text-[#3713ec]' : 'text-slate-300 hover:text-slate-500'}`}
                        >
                            {align === 'left' ? <AlignLeft size={12} /> : align === 'center' ? <AlignCenter size={12} /> : <AlignRight size={12} />}
                        </button>
                    ))}
                </div>
            </div>
            <div />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
            <button
                onClick={() => onChange({ ...style, fontWeight: style?.fontWeight === 'bold' ? 'normal' : 'bold' })}
                className={`p-2 rounded-lg transition-all ${style?.fontWeight === 'bold' || style?.fontWeight === '900' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#3713ec]' : 'text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-300'}`}
            >
                <Bold size={14} />
            </button>
            <button
                onClick={() => onChange({ ...style, fontStyle: style?.fontStyle === 'italic' ? 'normal' : 'italic' })}
                className={`p-2 rounded-lg transition-all ${style?.fontStyle === 'italic' ? 'bg-white shadow-sm text-[#3713ec]' : 'text-slate-400'}`}
            >
                <Italic size={14} />
            </button>
            <button
                onClick={() => onChange({ ...style, textDecoration: style?.textDecoration === 'underline' ? 'none' : 'underline' })}
                className={`p-2 rounded-lg transition-all ${style?.textDecoration === 'underline' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#3713ec]' : 'text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-300'}`}
            >
                <Underline size={14} />
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
            <div className="flex items-center gap-2">
                <div className="relative group/color flex flex-col items-center">
                    <input
                        type="color"
                        value={style?.color || '#1e293b'}
                        onChange={e => onChange({ ...style, color: e.target.value })}
                        className="w-7 h-7 rounded-lg overflow-hidden border-2 border-white shadow-sm cursor-pointer p-0"
                    />
                    <span className="text-[8px] font-black text-slate-300 mt-0.5">TEXT</span>
                </div>
                {showBg && (
                    <div className="relative group/bgcolor flex flex-col items-center">
                        <input
                            type="color"
                            value={style?.backgroundColor || '#ffffff'}
                            onChange={e => onChange({ ...style, backgroundColor: e.target.value })}
                            className="w-7 h-7 rounded-lg overflow-hidden border-2 border-white shadow-sm cursor-pointer p-0"
                        />
                        <span className="text-[8px] font-black text-slate-300 mt-0.5">BG</span>
                    </div>
                )}
            </div>
        </div>

        {showLink && (
            <div className="relative">
                <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" />
                <input
                    type="text"
                    placeholder="Add link URL..."
                    value={linkValue || ''}
                    onChange={e => onLinkChange(e.target.value)}
                    className="w-full border border-slate-100 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 outline-none focus:border-[#3713ec]/40 bg-white dark:bg-slate-900 transition-colors"
                />
            </div>
        )}
    </div>
);

/* ───────────────────────── Settings panel ───────────────────────── */
const SettingsPanel = ({ activeTab, setActiveTab, settings, setSettings, selectedField, updateField, onUpload, fields, setFields }) => {
    const bannerInputRef = useRef(null);
    const fieldImageInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e, target) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);
            const res = await onUpload(formData);
            const imageUrl = getImageUrl(res.data.url);

            if (target === 'banner') {
                setSettings(s => ({ ...s, bannerImage: imageUrl }));
            } else if (target === 'field') {
                updateField(selectedField.id, { imageUrl: imageUrl });
            }
        } catch (err) {
            console.error("Upload failed", err);
            showToast("Failed to upload image.", "error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-64 flex-shrink-0 bg-white dark:bg-[#1a1829] border-l border-slate-100 dark:border-slate-800 flex flex-col h-full overflow-y-auto no-scrollbar transition-colors">
        {/* Tab bar */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-[#1a1829] z-10 transition-colors">
            {['Field', 'Global'].map(t => (
                <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`flex-1 py-4 text-[12px] font-black transition-all border-b-2 -mb-px ${activeTab === t
                        ? 'border-[#3713ec] text-[#3713ec]'
                        : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
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
                            className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-[#3713ec]/20 focus:border-[#3713ec]/40 transition-all"
                            value={settings.visibility}
                            onChange={e => setSettings(s => ({ ...s, visibility: e.target.value }))}
                        >
                            <option className="dark:bg-slate-900">Public (Anyone with link)</option>
                            <option className="dark:bg-slate-900">Private (Login required)</option>
                            <option className="dark:bg-slate-900">Password protected</option>
                        </select>
                    </SettingSection>

                    {settings.visibility === 'Password protected' && (
                        <SettingSection title="FORM PASSWORD">
                            <input
                                type="text"
                                placeholder="Enter password to unlock"
                                value={settings.password || ''}
                                onChange={e => setSettings(s => ({ ...s, password: e.target.value }))}
                                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-[#3713ec]/20 focus:border-[#3713ec]/40 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                            />
                        </SettingSection>
                    )}

                    <SettingSection title="MULTI-PAGE FORM">
                        <ToggleSetting
                            label="Enable pages"
                            desc="Split form into multiple pages"
                            value={settings.pages?.enabled || false}
                            onChange={v => {
                                setSettings(s => ({
                                    ...s,
                                    pages: {
                                        ...s.pages,
                                        enabled: v,
                                        labels: s.pages?.labels?.length ? s.pages.labels : ['Page 1']
                                    }
                                }));
                                if (v) {
                                    // Assign all existing fields to page 1 if they don't have a page
                                    setFields(prev => prev.map(f => ({ ...f, page: f.page || 1 })));
                                }
                            }}
                        />
                        {settings.pages?.enabled && (
                            <div className="mt-3 space-y-2">
                                <p className="text-[9px] font-black text-slate-300 uppercase">Page Labels</p>
                                {(settings.pages?.labels || ['Page 1']).map((label, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white" style={{ backgroundColor: settings.themeColor }}>
                                            {idx + 1}
                                        </div>
                                        <input
                                            type="text"
                                            value={label}
                                            onChange={e => {
                                                const newLabels = [...(settings.pages?.labels || ['Page 1'])];
                                                newLabels[idx] = e.target.value;
                                                setSettings(s => ({ ...s, pages: { ...s.pages, labels: newLabels } }));
                                            }}
                                            className="flex-1 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:border-[#3713ec]/40 transition-all"
                                        />
                                        <span className="text-[9px] font-black text-slate-300">
                                            {fields.filter(f => f.page === idx + 1).length} fields
                                        </span>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const newLabels = [...(settings.pages?.labels || ['Page 1']), `Page ${(settings.pages?.labels?.length || 1) + 1}`];
                                        setSettings(s => ({ ...s, pages: { ...s.pages, labels: newLabels } }));
                                    }}
                                    className="w-full py-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-black text-slate-400 dark:text-slate-600 hover:border-[#3713ec]/40 hover:text-[#3713ec] transition-all flex items-center justify-center gap-1.5"
                                >
                                    <Plus size={12} /> ADD PAGE
                                </button>
                            </div>
                        )}
                    </SettingSection>

                    <SettingSection title="BUTTON LABEL">
                        <input
                            type="text"
                            value={settings.buttonLabel}
                            onChange={e => setSettings(s => ({ ...s, buttonLabel: e.target.value }))}
                            className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-[#3713ec]/20 focus:border-[#3713ec]/40 transition-all"
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
                        <div className="mt-4">
                            <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 mb-2 uppercase">Background Color</p>
                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                                <input
                                    type="color"
                                    value={settings.secondaryColor || '#f8fafc'}
                                    onChange={e => setSettings(s => ({ ...s, secondaryColor: e.target.value }))}
                                    className="w-10 h-8 rounded-lg overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm cursor-pointer p-0"
                                />
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">{settings.secondaryColor || '#F8FAFC'}</span>
                            </div>
                        </div>
                    </SettingSection>

                    <SettingSection title="HEADER STYLE">
                        <StyleToolbar 
                            style={settings.headerStyle} 
                            onChange={newStyle => setSettings(s => ({ ...s, headerStyle: newStyle }))} 
                            showBg={true}
                        />
                    </SettingSection>

                    <SettingSection title="SOCIAL LINKS">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center text-pink-500 transition-colors">
                                    <Instagram size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Instagram URL"
                                    value={settings.socialLinks?.instagram || ''}
                                    onChange={e => setSettings(s => ({ ...s, socialLinks: { ...s.socialLinks, instagram: e.target.value } }))}
                                    className="flex-1 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:border-pink-300 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 transition-colors">
                                    <Facebook size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Facebook URL"
                                    value={settings.socialLinks?.facebook || ''}
                                    onChange={e => setSettings(s => ({ ...s, socialLinks: { ...s.socialLinks, facebook: e.target.value } }))}
                                    className="flex-1 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:border-blue-300 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 transition-colors">
                                    <MessageCircle size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="WhatsApp Number or Link"
                                    value={settings.socialLinks?.whatsapp || ''}
                                    onChange={e => setSettings(s => ({ ...s, socialLinks: { ...s.socialLinks, whatsapp: e.target.value } }))}
                                    className="flex-1 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:border-emerald-300 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white transition-colors">
                                    <Twitter size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Twitter/X URL"
                                    value={settings.socialLinks?.twitter || ''}
                                    onChange={e => setSettings(s => ({ ...s, socialLinks: { ...s.socialLinks, twitter: e.target.value } }))}
                                    className="flex-1 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:border-slate-400 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 transition-colors">
                                    <Globe size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Website URL"
                                    value={settings.socialLinks?.website || ''}
                                    onChange={e => setSettings(s => ({ ...s, socialLinks: { ...s.socialLinks, website: e.target.value } }))}
                                    className="flex-1 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:border-indigo-300 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                            </div>
                        </div>
                    </SettingSection>

                    <SettingSection title="FOOTER">
                        <div className="space-y-3">
                            <textarea
                                value={settings.footer?.text || ''}
                                onChange={e => setSettings(s => ({ ...s, footer: { ...s.footer, text: e.target.value } }))}
                                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 outline-none focus:border-[#3713ec]/40 h-20 resize-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                placeholder="Add custom footer text (e.g. Copyright, Address...)"
                            />
                            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-2.5">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-300 mb-1 uppercase">Size</p>
                                        <select 
                                            value={settings.footer?.style?.fontSize || '12px'}
                                            onChange={e => setSettings(s => ({ ...s, footer: { ...s.footer, style: { ...s.footer.style, fontSize: e.target.value } } }))}
                                            className="w-full border border-slate-100 dark:border-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 outline-none bg-white dark:bg-slate-800 transition-colors"
                                        >
                                            <option value="10px">Smallest</option>
                                            <option value="12px">Small</option>
                                            <option value="14px">Base</option>
                                            <option value="16px">Large</option>
                                        </select>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-300 mb-1 uppercase">Align</p>
                                        <div className="flex bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-100 dark:border-slate-800 transition-colors">
                                            {['left', 'center', 'right'].map(align => (
                                                <button
                                                    key={align}
                                                    type="button"
                                                    onClick={() => setSettings(s => ({ ...s, footer: { ...s.footer, style: { ...s.footer.style, textAlign: align } } }))}
                                                    className={`flex-1 py-1 rounded-md flex items-center justify-center transition-all ${settings.footer?.style?.textAlign === align ? 'bg-slate-50 dark:bg-slate-700 text-[#3713ec]' : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400'}`}
                                                >
                                                    {align === 'left' ? <AlignLeft size={10} /> : align === 'center' ? <AlignCenter size={10} /> : <AlignRight size={10} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-1.5 px-2.5 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors">
                                    <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase">Text Color</p>
                                    <input
                                        type="color"
                                        value={settings.footer?.style?.color || '#94a3b8'}
                                        onChange={e => setSettings(s => ({ ...s, footer: { ...s.footer, style: { ...s.footer.style, color: e.target.value } } }))}
                                        className="w-8 h-5 rounded overflow-hidden border border-slate-100 dark:border-slate-700 cursor-pointer p-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </SettingSection>

                    <SettingSection title="BANNER IMAGE">
                        <div className="space-y-3">
                            <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 min-h-20 flex items-center justify-center">
                                {uploading ? (
                                    <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                                ) : settings.bannerImage ? (
                                    <>
                                        <img src={getImageUrl(settings.bannerImage)} alt="Banner" className="w-full h-20 object-cover" />
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
                            <div className="flex flex-col gap-2">
                                <input
                                    type="file"
                                    ref={bannerInputRef}
                                    onChange={(e) => handleFileChange(e, 'banner')}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    onClick={() => bannerInputRef.current?.click()}
                                    className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-black transition-all flex items-center justify-center gap-2"
                                >
                                    <Upload size={12} /> UPLOAD IMAGE
                                </button>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Or paste URL here..."
                                        value={settings.bannerImage || ''}
                                        onChange={(e) => setSettings(s => ({ ...s, bannerImage: e.target.value }))}
                                        className="w-full border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-[#3713ec]/40 bg-white dark:bg-slate-900 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                    />
                                </div>
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
                                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-[#3713ec]/20 focus:border-[#3713ec]/40 transition-all"
                            />
                        </SettingSection>

                        <SettingSection title="FIELD DESCRIPTION">
                            <textarea
                                value={selectedField.description || ''}
                                onChange={e => updateField(selectedField.id, { description: e.target.value })}
                                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 outline-none focus:border-[#3713ec]/40 h-16 resize-none transition-all"
                                placeholder="Add instructions or details..."
                            />
                        </SettingSection>

                        <SettingSection title="LABEL STYLE">
                            <StyleToolbar 
                                style={selectedField.style} 
                                onChange={s => updateField(selectedField.id, { style: s })} 
                                showLink={true}
                                linkValue={selectedField.link}
                                onLinkChange={l => updateField(selectedField.id, { link: l })}
                                showBg={true}
                            />
                        </SettingSection>

                        <SettingSection title="DESCRIPTION STYLE">
                            <StyleToolbar 
                                style={selectedField.descriptionStyle} 
                                onChange={s => updateField(selectedField.id, { descriptionStyle: s })} 
                            />
                        </SettingSection>

                        {['multiple_choice', 'checkboxes', 'dropdown', 'bullet_list'].includes(selectedField.type) && (
                            <SettingSection title="OPTION STYLE">
                                <StyleToolbar 
                                    style={selectedField.optionStyle} 
                                    onChange={s => updateField(selectedField.id, { optionStyle: s })} 
                                />
                            </SettingSection>
                        )}

                        <ToggleSetting
                            label="Required Field"
                            desc="Make answering this mandatory"
                            value={selectedField.required || false}
                            onChange={v => updateField(selectedField.id, { required: v })}
                        />

                        {selectedField.type === 'linear_scale' && (
                            <>
                                <div className="grid grid-cols-2 gap-3">
                                    <SettingSection title="MIN VALUE">
                                        <input
                                            type="number"
                                            value={selectedField.min || 0}
                                            onChange={e => updateField(selectedField.id, { min: parseInt(e.target.value) })}
                                            className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:border-[#3713ec]/40"
                                        />
                                    </SettingSection>
                                    <SettingSection title="MAX VALUE">
                                        <input
                                            type="number"
                                            value={selectedField.max || 10}
                                            onChange={e => updateField(selectedField.id, { max: parseInt(e.target.value) })}
                                            className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:border-[#3713ec]/40"
                                        />
                                    </SettingSection>
                                </div>
                                <SettingSection title="MIN LABEL">
                                    <input
                                        type="text"
                                        value={selectedField.minLabel || ''}
                                        onChange={e => updateField(selectedField.id, { minLabel: e.target.value })}
                                        className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:border-[#3713ec]/40"
                                        placeholder="E.g. Unsatisfied"
                                    />
                                </SettingSection>
                                <SettingSection title="MAX LABEL">
                                    <input
                                        type="text"
                                        value={selectedField.maxLabel || ''}
                                        onChange={e => updateField(selectedField.id, { maxLabel: e.target.value })}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-[#3713ec]/40"
                                        placeholder="E.g. Very Satisfied"
                                    />
                                </SettingSection>
                            </>
                        )}

                        {selectedField.type === 'slider' && (
                            <div className="grid grid-cols-3 gap-2">
                                <SettingSection title="MIN">
                                    <input
                                        type="number"
                                        value={selectedField.min || 0}
                                        onChange={e => updateField(selectedField.id, { min: parseInt(e.target.value) })}
                                        className="w-full border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#3713ec]/40"
                                    />
                                </SettingSection>
                                <SettingSection title="MAX">
                                    <input
                                        type="number"
                                        value={selectedField.max || 100}
                                        onChange={e => updateField(selectedField.id, { max: parseInt(e.target.value) })}
                                        className="w-full border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#3713ec]/40"
                                    />
                                </SettingSection>
                                <SettingSection title="STEP">
                                    <input
                                        type="number"
                                        value={selectedField.step || 1}
                                        onChange={e => updateField(selectedField.id, { step: parseInt(e.target.value) })}
                                        className="w-full border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#3713ec]/40"
                                    />
                                </SettingSection>
                            </div>
                        )}

                        {selectedField.type === 'image' && (
                            <SettingSection title="IMAGE SOURCE">
                                <div className="space-y-3">
                                    <input
                                        type="file"
                                        ref={fieldImageInputRef}
                                        onChange={(e) => handleFileChange(e, 'field')}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <button
                                        onClick={() => fieldImageInputRef.current?.click()}
                                        className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-600 hover:border-[#3713ec]/40 hover:text-[#3713ec] transition-all flex flex-col items-center justify-center gap-1"
                                    >
                                        {uploading ? (
                                            <div className="w-4 h-4 border-2 border-slate-300 border-t-[#3713ec] rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Upload size={18} />
                                                <span className="text-[10px] font-black uppercase">Click to Upload</span>
                                            </>
                                        )}
                                    </button>
                                    <div className="text-center text-[10px] font-black text-slate-300 dark:text-slate-700">OR</div>
                                    <input
                                        type="text"
                                        value={selectedField.imageUrl || ''}
                                        onChange={e => updateField(selectedField.id, { imageUrl: e.target.value })}
                                        className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:border-[#3713ec]/40"
                                        placeholder="Paste image URL here..."
                                    />
                                </div>
                            </SettingSection>
                        )}

                        {selectedField.type === 'video' && (
                            <SettingSection title="YOUTUBE URL">
                                <input
                                    type="text"
                                    value={selectedField.videoUrl || ''}
                                    onChange={e => updateField(selectedField.id, { videoUrl: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-[#3713ec]/40"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </SettingSection>
                        )}

                        {(selectedField.type === 'multiple_choice' || selectedField.type === 'checkboxes' || selectedField.type === 'dropdown' || selectedField.type === 'bullet_list') && (
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
                                                className="flex-1 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:border-[#3713ec]/40 transition-all"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newOpts = (selectedField.options || ['Option 1', 'Option 2', 'Option 3']).filter((_, idx) => idx !== i);
                                                    updateField(selectedField.id, { options: newOpts });
                                                }}
                                                className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
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
                                        className="w-full py-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-black text-slate-400 dark:text-slate-600 hover:border-[#3713ec]/40 hover:text-[#3713ec] transition-all flex items-center justify-center gap-1.5"
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
};

const SettingSection = ({ title, children }) => (
    <div className="space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        {children}
    </div>
);

const ToggleSetting = ({ label, desc, value, onChange }) => (
    <div 
        className="flex items-start justify-between gap-3 cursor-pointer group/toggle"
        onClick={(e) => {
            e.preventDefault();
            onChange(!value);
        }}
    >
        <div className="flex-1">
            <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 group-hover/toggle:text-[#3713ec] transition-colors">{label}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{desc}</p>
        </div>
        <button
            type="button"
            className={`relative w-10 h-6 rounded-full transition-all flex-shrink-0 mt-0.5 ${value ? 'bg-[#3713ec]' : 'bg-slate-200'}`}
            onClick={(e) => {
                e.stopPropagation();
                onChange(!value);
            }}
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
    const { showToast, confirm } = useNotification();
    const { user } = useAuth();

    const [formTitle, setFormTitle] = useState('Untitled Form');
    const [formDesc, setFormDesc] = useState('');
    const [fields, setFields] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [settingsTab, setSettingsTab] = useState('Palette');
    const [activeTab, setActiveTab] = useState('Global');
    const [settings, setSettings] = useState({
        visibility: 'Public (Anyone with link)',
        buttonLabel: 'Submit',
        resubmission: true,
        emailNotifications: false,
        themeColor: '#3713ec',
        secondaryColor: '#f8fafc',
        bannerImage: null,
        headerStyle: {
            fontSize: '32px',
            color: '#0f172a',
            fontWeight: '900',
            textAlign: 'center',
            fontStyle: 'normal',
            textDecoration: 'none',
        },
        socialLinks: {
            instagram: '',
            facebook: '',
            whatsapp: '',
            twitter: '',
            website: ''
        },
        footer: {
            text: '',
            style: {
                fontSize: '12px',
                color: '#94a3b8',
                textAlign: 'center',
                fontWeight: 'bold',
                backgroundColor: 'transparent'
            }
        },
        pages: {
            enabled: false,
            labels: ['Page 1']
        }
    });
    const [status, setStatus] = useState('Draft');
    const [published, setPublished] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formId, setFormId] = useState(null); // Track the created form ID
    const [loading, setLoading] = useState(false);
    const [responsesCount, setResponsesCount] = useState(0);
    const [viewsCount, setViewsCount] = useState(0);
    const [isDirty, setIsDirty] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingPageLabel, setEditingPageLabel] = useState(null);
    const initialLoadRef = useRef(true);

    // Track unsaved changes
    useEffect(() => {
        if (initialLoadRef.current) {
            initialLoadRef.current = false;
            return;
        }
        setIsDirty(true);
    }, [formTitle, formDesc, fields, settings]);

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
            if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
            setStatus(data.status);
            setResponsesCount(data.responsesCount || 0);
            setViewsCount(data.viewsCount || 0);
        } catch (error) {
            console.error("Failed to load form", error);
            showToast("Failed to load form.", "error");
        } finally {
            setLoading(false);
        }
    };

    const addField = (type, label) => {
        const id = uid();
        const page = settings.pages?.enabled ? currentPage : 1;
        setFields(prev => [...prev, { id, type, label, required: false, page }]);
        setSelectedId(id);
        setSettingsTab('Field');
    };

    // --- Multi-page helpers ---
    const totalPages = settings.pages?.labels?.length || 1;

    const addPage = () => {
        const newLabels = [...(settings.pages?.labels || ['Page 1']), `Page ${totalPages + 1}`];
        setSettings(s => ({ ...s, pages: { ...s.pages, labels: newLabels } }));
        setCurrentPage(newLabels.length);
    };

    const deletePage = async (pageNum) => {
        if (totalPages <= 1) return;
        const fieldsOnPage = fields.filter(f => f.page === pageNum);
        if (fieldsOnPage.length > 0) {
            const ok = await confirm({
                title: 'Delete Page?',
                message: `This page has ${fieldsOnPage.length} field(s). Deleting it will also remove those fields. Continue?`,
                confirmText: 'Delete Page',
                cancelText: 'Cancel',
                variant: 'danger'
            });
            if (!ok) return;
        }
        // Remove fields on this page and re-number pages above
        setFields(prev => prev
            .filter(f => f.page !== pageNum)
            .map(f => f.page > pageNum ? { ...f, page: f.page - 1 } : f)
        );
        const newLabels = (settings.pages?.labels || ['Page 1']).filter((_, i) => i !== pageNum - 1);
        setSettings(s => ({ ...s, pages: { ...s.pages, labels: newLabels } }));
        if (currentPage >= pageNum) setCurrentPage(Math.max(1, currentPage - 1));
    };

    const renamePageLabel = (pageNum, newLabel) => {
        const newLabels = [...(settings.pages?.labels || ['Page 1'])];
        newLabels[pageNum - 1] = newLabel;
        setSettings(s => ({ ...s, pages: { ...s.pages, labels: newLabels } }));
    };

    const moveField = (fromIndex, toIndex) => {
        setFields(prev => {
            const result = [...prev];
            const [removed] = result.splice(fromIndex, 1);
            result.splice(toIndex, 0, removed);
            return result;
        });
    };

    const [draggedIndex, setDraggedIndex] = useState(null);

    const onDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.setData('text/plain', index);
        e.dataTransfer.effectAllowed = 'move';
        // Add a visual class if needed
    };

    const onDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (e, toIndex) => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (fromIndex !== toIndex) {
            moveField(fromIndex, toIndex);
        }
        setDraggedIndex(null);
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
                    options: f.options || [],
                    min: f.min,
                    max: f.max,
                    step: f.step,
                    imageUrl: f.imageUrl,
                    videoUrl: f.videoUrl,
                    minLabel: f.minLabel,
                    maxLabel: f.maxLabel,
                    description: f.description,
                    style: f.style,
                    descriptionStyle: f.descriptionStyle,
                    optionStyle: f.optionStyle,
                    link: f.link,
                    page: f.page || 1
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
            } else if (publishStatus === 'Draft') {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
            setIsDirty(false);
        } catch (error) {
            console.error("Failed to save form", error);
            const msg = error.response?.data?.message || "Failed to save form. Please try again.";
            showToast(msg, "error");
        } finally {
            setSaving(false);
        }
    };


    const onUpload = (formData) => {
        return api.post('/forms/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    };

    const handleSave = () => {
        setStatus('Draft');
        saveFormToDb('Draft');
    };

    const handleBack = async () => {
        if (!isDirty) {
            navigate('/forms');
            return;
        }
        const ok = await confirm({
            title: 'Unsaved Changes?',
            message: 'You have unsaved changes. Are you sure you want to leave the builder? Any unsaved progress will be lost.',
            confirmText: 'Leave Builder',
            cancelText: 'Stay & Save',
            variant: 'danger'
        });
        if (ok) {
            navigate('/forms');
        }
    };

    const handlePublish = () => {
        setStatus('Active');
        saveFormToDb('Active');
    };

    const handleShare = () => {
        if (!formId) {
            showToast("Please save the form first to share it.", "info");
            return;
        }
        const url = `${window.location.origin}/form/${formId}`;
        navigator.clipboard.writeText(url);
        showToast('Form link copied to clipboard!');
    };

    return (
        <div className="h-screen bg-[#F8FAFC] flex flex-col overflow-hidden">
            {/* Top Bar */}
            <header className="h-14 bg-white dark:bg-[#1a1829] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-50 shadow-sm transition-colors">
                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={handleBack}
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm overflow-hidden p-0.5 shrink-0 transition-colors">
                            <img src={logo} alt="JinraiForms Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-black text-slate-900 dark:text-white text-[13px] hidden lg:block uppercase tracking-tighter">JinraiForms</span>
                    </div>
                    <div className="hidden lg:flex items-center gap-1.5 text-[12px] text-slate-400 dark:text-slate-500 font-bold max-w-[100px] sm:max-w-none truncate">
                        <span className="text-slate-700 dark:text-slate-400">{formTitle || 'Untitled Form'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    {/* View count / response count */}
                    <div className="flex items-center sm:gap-1 mr-1">
                        <button
                            onClick={() => formId ? window.open(`http://localhost:5173/form/${formId}`, '_blank') : showToast("Please save the form before previewing.", "info")}
                            className="flex items-center gap-2 p-1.5 sm:p-2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                            title="Preview Form"
                        >
                            <Eye className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                            <span className="hidden xl:inline text-[11px] font-black uppercase tracking-wider">Preview</span>
                        </button>
                        <button
                            onClick={() => formId ? navigate(`/responses?formId=${formId}`) : showToast("Please save the form first to view responses.", "info")}
                            className="flex items-center gap-2 p-1.5 sm:p-2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                            title="View Responses"
                        >
                            <MessageSquare className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                            <span className="hidden xl:inline text-[11px] font-black uppercase tracking-wider">Responses</span>
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 p-1.5 sm:p-2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                            title="Share Form"
                        >
                            <Share2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                            <span className="hidden xl:inline text-[11px] font-black uppercase tracking-wider">Share</span>
                        </button>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-[12px] font-black transition-all ${saved
                            ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {saving ? <div className="w-3.5 h-3.5 border-2 border-slate-600 dark:border-slate-400 border-t-transparent rounded-full animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
                        <span className="hidden xs:block">{saving ? 'Saving...' : saved ? 'Saved' : 'Save'}</span>
                    </button>

                    <button
                        onClick={handlePublish}
                        disabled={saving}
                        className={`flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-[12px] font-black shadow-lg transition-all ${published
                            ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                            : 'text-white hover:opacity-90'
                            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={!published ? { backgroundColor: settings.themeColor, boxShadow: `0 10px 15px -3px ${settings.themeColor}30` } : {}}
                    >
                        {saving ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : published ? <Check size={14} /> : <Send size={14} />}
                        <span className="hidden xs:block">{published ? 'Live' : 'Publish'}</span>
                    </button>

                </div>
            </header>

            {/* Body: Left panel | Canvas | Right panel */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Tab Switcher: Visible on Mobile and Tablet (below xl) */}
                <div className="xl:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-white dark:bg-[#1e1c2e] border border-slate-100 dark:border-slate-700 shadow-2xl rounded-2xl flex items-center p-1.5 gap-1 transition-colors">
                    <button 
                        onClick={() => setSettingsTab('Palette')} 
                        className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all ${settingsTab === 'Palette' ? 'bg-[#3713ec] text-white shadow-lg shadow-[#3713ec]/20' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        Fields
                    </button>
                    {/* Canvas tab only needed on mobile (below lg) as it's always visible on Tablet/Desktop */}
                    <button 
                        onClick={() => setSettingsTab('Canvas')} 
                        className={`lg:hidden px-4 py-2 rounded-xl text-[11px] font-black transition-all ${settingsTab === 'Canvas' ? 'bg-[#3713ec] text-white shadow-lg shadow-[#3713ec]/20' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        Canvas
                    </button>
                    <button 
                        onClick={() => setSettingsTab('Global')} 
                        className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all ${settingsTab === 'Global' || settingsTab === 'Field' ? 'bg-[#3713ec] text-white shadow-lg shadow-[#3713ec]/20' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        Settings
                    </button>
                </div>

                {/* ── Left: Field Palette ── */}
                <aside className={`
                    w-full lg:w-52 h-full flex-shrink-0 bg-white dark:bg-[#1a1829] lg:border-r border-slate-100 dark:border-slate-800 overflow-y-auto no-scrollbar absolute inset-0 z-40 lg:relative transition-all duration-300
                    ${settingsTab === 'Palette' ? 'translate-x-0 opacity-100' : '-translate-x-full xl:translate-x-0 xl:opacity-100 pointer-events-none xl:pointer-events-auto'}
                    ${(settingsTab === 'Palette' || window.innerWidth >= 1280) ? 'block' : 'hidden xl:block'}
                `}>
                    <FieldGroup title="BASIC FIELDS" fields={BASIC_FIELDS} onAdd={(t, l) => { addField(t, l); setSettingsTab('Canvas'); }} themeColor={settings.themeColor} />
                    <FieldGroup title="ADVANCED FIELDS" fields={ADVANCED_FIELDS} onAdd={(t, l) => { addField(t, l); setSettingsTab('Canvas'); }} themeColor={settings.themeColor} />
                    <FieldGroup title="PRESENTATION" fields={CONTENT_FIELDS} onAdd={(t, l) => { addField(t, l); setSettingsTab('Canvas'); }} themeColor={settings.themeColor} />
                    <div className="h-24 lg:hidden" /> {/* Spacer for mobile nav */}
                </aside>
                {/* ── Center: Canvas ── */}
                <main className={`
                    flex-1 h-full overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 no-scrollbar transition-all duration-300
                    ${settingsTab === 'Canvas' ? 'translate-x-0 opacity-100' : 'hidden lg:block lg:translate-x-0 lg:opacity-100'}
                `} style={{ backgroundColor: settings.secondaryColor || (document.documentElement.classList.contains('dark') ? '#0f0e17' : '#F8FAFC') }}>
                    <div className="max-w-2xl mx-auto space-y-4">
                        {/* Banner Image */}
                        {settings.bannerImage && (
                            <div className="w-full h-40 rounded-[20px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm mb-4">
                                <img src={getImageUrl(settings.bannerImage)} alt="Form Banner" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Form title card */}
                        <div className="rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm p-8" style={{ borderTop: `6px solid ${settings.themeColor}`, backgroundColor: settings.headerStyle?.backgroundColor || (document.documentElement.classList.contains('dark') ? '#1e1c2e' : '#ffffff') }}>
                            <input
                                value={formTitle}
                                onChange={e => setFormTitle(e.target.value)}
                                className="w-full bg-transparent outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 border-b-2 border-transparent focus:border-[#3713ec]/30 pb-1 transition-all"
                                style={{
                                    fontSize: settings.headerStyle?.fontSize || '30px',
                                    fontWeight: settings.headerStyle?.fontWeight === 'black' ? 900 : settings.headerStyle?.fontWeight || '900',
                                    color: settings.headerStyle?.color || '#0f172a',
                                    textAlign: settings.headerStyle?.textAlign || 'left',
                                    fontStyle: settings.headerStyle?.fontStyle || 'normal',
                                    textDecoration: settings.headerStyle?.textDecoration || 'none',
                                    fontFamily: settings.headerStyle?.fontFamily || 'inherit'
                                }}
                                placeholder="Untitled Form"
                            />
                            <input
                                value={formDesc}
                                onChange={e => setFormDesc(e.target.value)}
                                className="w-full mt-3 text-[14px] text-slate-400 dark:text-slate-500 bg-transparent outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all font-medium"
                                style={{
                                    textAlign: settings.headerStyle?.textAlign || 'left',
                                    fontFamily: settings.headerStyle?.fontFamily || 'inherit',
                                    color: document.documentElement.classList.contains('dark') ? (settings.headerStyle?.color ? settings.headerStyle.color : '#94a3b8') : (settings.headerStyle?.color || '#64748b')
                                }}
                                placeholder="Add a description for your form"
                            />
                        </div>

                        {/* ── Multi-Page Tabs Bar ── */}
                        {settings.pages?.enabled && (
                            <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
                                {(settings.pages?.labels || ['Page 1']).map((label, idx) => {
                                    const pageNum = idx + 1;
                                    const isActive = currentPage === pageNum;
                                    const fieldCount = fields.filter(f => f.page === pageNum).length;
                                    return (
                                        <div key={idx} className="flex items-center gap-1 flex-shrink-0">
                                            {editingPageLabel === pageNum ? (
                                                <input
                                                    autoFocus
                                                    className="px-3 py-2 text-[12px] font-black rounded-xl border-2 outline-none w-28 dark:bg-slate-800"
                                                    style={{ borderColor: settings.themeColor, color: settings.themeColor }}
                                                    value={label}
                                                    onChange={e => renamePageLabel(pageNum, e.target.value)}
                                                    onBlur={() => setEditingPageLabel(null)}
                                                    onKeyDown={e => { if (e.key === 'Enter') setEditingPageLabel(null); }}
                                                />
                                            ) : (
                                                <button
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    onDoubleClick={() => setEditingPageLabel(pageNum)}
                                                    className={`relative px-4 py-2 text-[12px] font-black rounded-xl transition-all flex items-center gap-2 ${isActive
                                                        ? 'text-white shadow-lg'
                                                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                                                    }`}
                                                    style={isActive ? { backgroundColor: settings.themeColor, boxShadow: `0 4px 12px ${settings.themeColor}30` } : {}}
                                                    title="Double-click to rename"
                                                >
                                                    <Layers size={12} />
                                                    <span className="truncate max-w-[80px]">{label}</span>
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                        {fieldCount}
                                                    </span>
                                                </button>
                                            )}
                                            {isActive && totalPages > 1 && (
                                                <button
                                                    onClick={() => deletePage(pageNum)}
                                                    className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete this page"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                                <button
                                    onClick={addPage}
                                    className="flex-shrink-0 p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                                    title="Add new page"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        )}

                        {/* Fields (filtered by current page when multi-page is enabled) */}
                        {(() => {
                            const visibleFields = settings.pages?.enabled
                                ? fields.filter(f => f.page === currentPage)
                                : fields;
                            return visibleFields.map((field) => {
                                const globalIndex = fields.findIndex(f => f.id === field.id);
                                return (
                                    <div
                                        key={field.id}
                                        draggable
                                        onDragStart={(e) => onDragStart(e, globalIndex)}
                                        onDragOver={(e) => onDragOver(e, globalIndex)}
                                        onDrop={(e) => onDrop(e, globalIndex)}
                                        className={draggedIndex === globalIndex ? 'opacity-40' : ''}
                                    >
                                        <FieldPreview
                                            field={field}
                                            isSelected={selectedId === field.id}
                                            onSelect={() => handleSelectField(field.id)}
                                            onDelete={() => deleteField(field.id)}
                                            themeColor={settings.themeColor}
                                        />
                                    </div>
                                );
                            });
                        })()}

                        {/* Empty state */}
                        {(() => {
                            const visibleFields = settings.pages?.enabled
                                ? fields.filter(f => f.page === currentPage)
                                : fields;
                            return visibleFields.length === 0 && (
                                <div className="bg-white dark:bg-[#1e1c2e] rounded-[20px] border-2 border-dashed border-slate-200 dark:border-slate-800 p-16 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-5">
                                        <Plus size={28} className="text-slate-300 dark:text-slate-600" />
                                    </div>
                                    <h3 className="font-black text-slate-800 dark:text-white text-lg mb-1">
                                        {settings.pages?.enabled ? `Build ${settings.pages?.labels?.[currentPage - 1] || `Page ${currentPage}`}` : 'Build your form'}
                                    </h3>
                                    <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs">
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
                            );
                        })()}

                        {/* Add section strip */}
                        {(() => {
                            const visibleFields = settings.pages?.enabled
                                ? fields.filter(f => f.page === currentPage)
                                : fields;
                            return visibleFields.length > 0 && (
                                <button
                                    onClick={() => addField('short_text', 'New Question')}
                                    className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-[12px] font-black text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-[#1e1c2e] transition-all flex items-center justify-center gap-2 group"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = settings.themeColor;
                                        e.currentTarget.style.color = settings.themeColor;
                                    }}
                                    onMouseLeave={(e) => {
                                        if (document.documentElement.classList.contains('dark')) {
                                            e.currentTarget.style.borderColor = '#1e293b'; // slate-800ish
                                            e.currentTarget.style.color = '#64748b'; // slate-500ish
                                        } else {
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.color = '#94a3b8';
                                        }
                                    }}
                                >
                                    <Plus size={14} /> ADD FIELD
                                </button>
                            );
                        })()}

                        {/* Footer badges & Social Links */}
                        <div className="flex flex-col items-center gap-4 py-8">
                            {settings.socialLinks && Object.values(settings.socialLinks).some(l => l) && (
                                <div className="flex items-center gap-4">
                                    {settings.socialLinks.instagram && (
                                        <a href={formatSocialLink(settings.socialLinks.instagram)} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm text-pink-500 hover:scale-110 transition-transform">
                                            <Instagram size={18} />
                                        </a>
                                    )}
                                    {settings.socialLinks.facebook && (
                                        <a href={formatSocialLink(settings.socialLinks.facebook)} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm text-blue-600 hover:scale-110 transition-transform">
                                            <Facebook size={18} />
                                        </a>
                                    )}
                                    {settings.socialLinks.whatsapp && (
                                        <a href={settings.socialLinks.whatsapp.startsWith('http') ? settings.socialLinks.whatsapp : `https://wa.me/${settings.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm text-emerald-500 hover:scale-110 transition-transform">
                                            <MessageCircle size={18} />
                                        </a>
                                    )}
                                    {settings.socialLinks.twitter && (
                                        <a href={formatSocialLink(settings.socialLinks.twitter)} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm text-slate-900 dark:text-white hover:scale-110 transition-transform">
                                            <Twitter size={18} />
                                        </a>
                                    )}
                                    {settings.socialLinks.website && (
                                        <a href={formatSocialLink(settings.socialLinks.website)} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm text-indigo-600 hover:scale-110 transition-transform">
                                            <Globe size={18} />
                                        </a>
                                    )}
                                </div>
                            )}
                            <div className="flex items-center justify-center gap-6 text-[11px] text-slate-400 font-bold">
                                <span className="flex items-center gap-1.5">🔒 End-to-end encrypted</span>
                                <span className="flex items-center gap-1.5">✅ Compliant with GDPR</span>
                            </div>
                        </div>
                    </div>
                </main>

                {/* ── Right: Settings Panel ── */}
                <div className={`
                    w-full lg:w-64 flex-shrink-0 bg-white dark:bg-[#1a1829] lg:border-l border-slate-100 dark:border-slate-800 overflow-y-auto no-scrollbar absolute inset-0 z-40 lg:relative transition-all duration-300
                    ${(settingsTab === 'Global' || settingsTab === 'Field') ? 'translate-x-0 opacity-100' : 'translate-x-full xl:translate-x-0 xl:opacity-100 pointer-events-none xl:pointer-events-auto'}
                    ${(settingsTab === 'Global' || settingsTab === 'Field' || window.innerWidth >= 1280) ? 'block' : 'hidden xl:block'}
                `}>
                    <SettingsPanel
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        settings={settings}
                        setSettings={setSettings}
                        selectedField={fields.find(f => f.id === selectedId)}
                        updateField={updateField}
                        onUpload={onUpload}
                        onClose={() => setSettingsTab('Canvas')}
                        fields={fields}
                        setFields={setFields}
                    />
                    <div className="h-24 lg:hidden" /> {/* Spacer for mobile nav */}
                </div>
            </div>
        </div>
    );
};

/* ───────────────────────── Field group in palette ───────────────────────── */
const FieldGroup = ({ title, fields, onAdd, themeColor }) => (
    <div className="p-3 sm:p-4">
        <p className="text-[8px] sm:text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 sm:mb-3 px-1">{title}</p>
        <div className="space-y-0.5 sm:space-y-1">
            {fields.map(f => (
                <button
                    key={f.type}
                    onClick={() => onAdd(f.type, f.label)}
                    className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-[11px] sm:text-[13px] font-bold text-slate-600 dark:text-slate-300 rounded-xl transition-all group text-left"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${themeColor}10`;
                        e.currentTarget.style.color = themeColor;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        if (document.documentElement.classList.contains('dark')) {
                            e.currentTarget.style.color = '#cbd5e1'; // slate-300
                        } else {
                            e.currentTarget.style.color = '#475569';
                        }
                    }}
                >
                    <span className="text-slate-400 dark:text-slate-600 group-hover:text-inherit transition-colors scale-90 sm:scale-100">{f.icon}</span>
                    <span className="truncate">{f.label}</span>
                </button>
            ))}
        </div>
    </div>
);

export default CreateForm;
