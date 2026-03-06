const Checkbox = ({ id, label, className = "", ...props }) => (
    <div className="flex items-start gap-3">
        <input
            id={id}
            type="checkbox"
            className="mt-1 w-4 h-4 text-primary bg-[#F8FAFC] border-[#E2E8F0] rounded focus:ring-primary cursor-pointer"
            {...props}
        />
        {label && (
            <label htmlFor={id} className="text-xs text-[#64748B] dark:text-slate-400 leading-normal cursor-pointer select-none">
                {label}
            </label>
        )}
    </div>
)

export default Checkbox
