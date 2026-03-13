const OtpInput = ({ length = 6, value, onChange, className = "" }) => {
    const inputs = Array.from({ length }, (_, i) => (
        <input
            key={i}
            className={`w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-semibold border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#3713EC] focus:ring-4 focus:ring-[#3713EC]/10 transition-all shadow-sm rounded-xl flex-1 ${className}`}
            maxLength={1}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value[i] || ''}
            onChange={(e) => {
                const val = e.target.value;
                if (!/^[0-9]?$/.test(val)) return; // Only allow single digits

                const nextValue = [...value];
                nextValue[i] = val;
                onChange(nextValue.join(''));

                // Move to next input if value is entered
                if (val && i < length - 1) {
                    document.getElementById(`otp-${i + 1}`)?.focus();
                }
            }}
            onKeyDown={(e) => {
                if (e.key === 'Backspace') {
                    if (!value[i] && i > 0) {
                        // Move to previous input on backspace if current is empty
                        document.getElementById(`otp-${i - 1}`)?.focus();
                    }
                }
            }}
            id={`otp-${i}`}
        />
    ))

    return <div className="flex justify-between gap-2">{inputs}</div>
}

export default OtpInput
