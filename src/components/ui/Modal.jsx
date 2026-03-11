import React, { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "primary", // primary, danger
    loading = false
}) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) setIsClosing(false);
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 200);
    };

    if (!isOpen && !isClosing) return null;

    const variants = {
        primary: {
            button: "bg-[#3713ec] hover:bg-[#2911A0] text-white shadow-[#3713ec]/20",
            icon: "bg-indigo-50 text-[#3713ec]",
        },
        danger: {
            button: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200",
            icon: "bg-rose-50 text-rose-600",
        }
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className={`relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-300 transform ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${variants[variant].icon}`}>
                            {variant === 'danger' ? <AlertCircle size={24} /> : <X size={24} />}
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 mb-10">
                        <h3 className="text-2xl font-black text-slate-900 leading-tight">{title}</h3>
                        <div className="text-slate-500 font-medium text-sm">
                            {children}
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleClose}
                            className="flex-1 py-4 px-6 bg-slate-50 hover:bg-slate-100 text-slate-600 font-black rounded-2xl transition-all border border-slate-100"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                if (!loading) handleClose();
                            }}
                            disabled={loading}
                            className={`flex-1 py-4 px-6 font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 ${variants[variant].button}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
