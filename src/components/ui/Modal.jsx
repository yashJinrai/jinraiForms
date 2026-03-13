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
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 200);
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
            <div className={`relative w-full max-w-[calc(100%-2rem)] sm:max-w-md bg-white dark:bg-[#1e1c2e] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl dark:shadow-black/30 overflow-hidden transition-all duration-300 transform ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
                <div className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center ${variants[variant].icon}`}>
                            {variant === 'danger' ? <AlertCircle size={20} className="sm:w-6 sm:h-6" /> : <X size={20} className="sm:w-6 sm:h-6" />}
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-slate-400 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 mb-6 sm:mb-10 text-center sm:text-left">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">{title}</h3>
                        <div className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
                            {children}
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                        <button
                            onClick={handleClose}
                            className="w-full sm:flex-1 py-3.5 sm:py-4 px-6 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-black rounded-xl sm:rounded-2xl transition-all border border-slate-100 dark:border-slate-700 text-sm sm:text-base"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                if (!loading) handleClose();
                            }}
                            disabled={loading}
                            className={`w-full sm:flex-1 py-3.5 sm:py-4 px-6 font-black rounded-xl sm:rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base ${variants[variant].button}`}
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
