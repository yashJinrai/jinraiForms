import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    const icons = {
        success: <CheckCircle2 className="text-emerald-400" size={20} />,
        error: <AlertCircle className="text-rose-400" size={20} />,
        info: <Info className="text-indigo-400" size={20} />,
    };

    const borders = {
        success: 'border-emerald-500/20',
        error: 'border-rose-500/20',
        info: 'border-indigo-500/20',
    };

    return (
        <div className={`
            fixed z-[200] flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-900 border ${borders[type]} rounded-xl sm:rounded-2xl shadow-2xl shadow-black/20 
            w-[calc(100%-2rem)] sm:w-auto sm:min-w-[320px] max-w-md
            left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0 
            bottom-4 sm:bottom-8
            transition-all duration-300 transform 
            ${isClosing 
                ? 'translate-y-12 opacity-0 sm:translate-y-0 sm:translate-x-full' 
                : 'translate-y-0 opacity-100 animate-in slide-in-from-bottom sm:slide-in-from-right sm:translate-y-0'
            }
        `}>
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <p className="flex-1 text-[13px] sm:text-sm font-bold text-white tracking-tight leading-snug">{message}</p>
            <button onClick={handleClose} className="text-slate-500 hover:text-white transition-colors p-1">
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
