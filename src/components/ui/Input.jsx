import { useState } from 'react'
import { LuEye, LuEyeClosed } from "react-icons/lu";

const Input = ({ label, id, className = "", iconAfter, error, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = props.type === "password" || id === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : props.type;

    return (
        <div className="space-y-1.5">
            {label && (
                <label htmlFor={id} className="block text-sm font-semibold text-[#334155] mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={id}
                    {...props}
                    type={inputType}
                    className={`w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none transition-all text-[#6B7280] ${className}`}
                />

                {/* Auto-add password toggle if it's a password field and no iconAfter is provided */}
                {isPassword && !iconAfter ? (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center focus:outline-none cursor-pointer"
                    >
                        <span className="flex items-center text-[20px] select-none text-slate-400 hover:text-slate-600 transition-colors">
                            {showPassword ? <LuEye /> : <LuEyeClosed />}
                        </span>
                    </button>
                ) : (
                    iconAfter && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#334155]">
                            {iconAfter}
                        </span>
                    )
                )}
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default Input
