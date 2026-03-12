import ResetPasswordForm from '../components/auth/ResetPasswordForm'
import logo from '../assets/images/JLogobg.png';

const ResetPasswordSuccess = () => (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
        {/* Left: Success panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-[#3713ec] relative overflow-hidden flex-col justify-between p-12 lg:p-24">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0); backgroundSize: '40px 40px'" }}></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 text-white mb-24">
                    <div className="bg-white p-1 rounded-lg w-10 h-10 flex items-center justify-center">
                        <img src={logo} alt="JinraiForms" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">JinraiForms</h2>
                </div>
                <div className="max-w-md">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl w-fit mb-8">
                        <span className="material-symbols-outlined text-white text-5xl">lock</span>
                    </div>
                    <h1 className="text-white text-5xl font-bold leading-tight mb-6">
                        Reset Successful
                    </h1>
                    <p className="text-white/80 text-xl leading-relaxed">
                        Our security systems ensure your data remains protected while you regain access to your account.
                    </p>
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-white/60 text-sm font-semibold tracking-widest uppercase">
                <span className="material-symbols-outlined text-lg">verified_user</span>
                Enterprise Grade Security
            </div>

            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Right: New password form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-16 lg:p-24 bg-white dark:bg-slate-950">
            <div className="max-w-md w-full mx-auto">
                {/* Mobile Logo */}
                <div className="flex lg:hidden items-center gap-3 mb-12">
                    <div className="bg-slate-50 p-1.5 rounded-xl w-10 h-10 flex items-center justify-center border border-slate-100">
                        <img src={logo} alt="JinraiForms" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">JinraiForms</h2>
                </div>

                <div className="mb-8 sm:mb-12">
                    <h2 className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">Create new password</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed font-medium">
                        Please enter your new password below to regain access to your dashboard.
                    </p>
                </div>
                <ResetPasswordForm />
                <div className="mt-16 sm:mt-24 text-center border-t border-slate-100 dark:border-slate-800 pt-8">
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                        © 2026 Jinrai Technologies Pvt Ltd<br />
                        <div className="mt-2 flex justify-center gap-4">
                            <a href="https://jinraitech.com/privacy-policy" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
                            <a href="https://jinraitech.com/terms-and-conditions" className="hover:text-slate-600 transition-colors">Terms of Service</a>
                        </div>
                    </p>
                </div>
            </div>
        </div>
    </div>
)

export default ResetPasswordSuccess
