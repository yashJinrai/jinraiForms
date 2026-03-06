const Divider = ({ children }) => (
    <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-[#E2E8F0]"></div>
        {children && (
            <span className="flex-shrink mx-4 text-[#94A3B8] text-xs font-medium uppercase tracking-widest">
                {children}
            </span>
        )}
        <div className="flex-grow border-t border-[#E2E8F0]"></div>
    </div>
)

export default Divider
