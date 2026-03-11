import OtpVerify from '../components/auth/OtpVerify'

const OtpVerifyPage = () => (
    <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left: Secure panel */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary via-[#7c3aed] to-primary p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <svg height="100%" width="100%">
                    <defs>
                        <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect fill="url(#grid)" height="100%" width="100%" />
                </svg>
            </div>

            <div className="relative z-10 flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-xl">
                    <span className="material-symbols-outlined text-white text-3xl">dashboard_customize</span>
                </div>
                <span className="text-xl font-bold text-white">FormBuilder</span>
            </div>

            <div className="relative z-10">
                <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-sm mb-8">
                        <span className="material-symbols-outlined text-white text-5xl">enhanced_encryption</span>
                    </div>
                    <h1 className="text-white text-6xl font-extrabold leading-tight mb-6">Secure</h1>
                    <h1 className="text-white text-6xl font-extrabold leading-tight mb-6">Verification</h1>
                    <p className="text-white/90 text-lg">
                        Protecting your data is our top priority. We use industry-standard encryption to keep your forms and responses safe.
                    </p>
                </div>
            </div>

            <div className="relative z-10 flex gap-4">
                <div className="h-1 w-12 bg-white rounded-full"></div>
                <div className="h-1 w-12 bg-white/30 rounded-full"></div>
                <div className="h-1 w-12 bg-white/30 rounded-full"></div>
            </div>
        </div>

        {/* Right: OTP Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-24 bg-white dark:bg-slate-950">
            <OtpVerify />
        </div>
    </div>
)

export default OtpVerifyPage
