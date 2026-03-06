const Button = ({ children, className = "", variant = "primary", size = "default", ...props }) => {
    const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    const variants = {
        primary: "bg-gradient-to-r from-[#3713ec] to-[#7c3aed] text-white shadow-lg hover:opacity-90 active:scale-[0.98] focus:ring-primary/20",
        secondary: "border border-[#E2E8F0] border-1 text-[#334155] hover:bg-slate-800 hover:text-[#ffffff]",
        ghost: "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
    }
    const sizes = {
        default: "px-6 py-3 text-sm",
        sm: "px-4 py-2.5 text-sm",
        lg: "px-8 py-4 text-base"
    }

    return (
        <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {children}
        </button>
    )
}

export default Button
