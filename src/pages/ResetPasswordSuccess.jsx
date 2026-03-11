import ResetPasswordForm from '../components/auth/ResetPasswordForm'

const ResetPasswordSuccess = () => (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
        {/* Left: Success panel */}
        <div className="md:w-1/2 gradient-bg relative overflow-hidden flex flex-col justify-between p-12 lg:p-24">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0); backgroundSize: '40px 40px'" }}></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 text-white mb-24">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-2xl">polyline</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">FormBuilder</h2>
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
        <div className="md:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-white">
            <div className="max-w-md w-full mx-auto">
                <div className="mb-12">
                    <h2 className="text-slate-900 text-4xl font-bold mb-4">Create new password</h2>
                    <p className="text-slate-500 text-lg leading-relaxed">
                        Please enter your new password below to regain access to your dashboard.
                    </p>
                </div>
                <ResetPasswordForm />
                <div className="mt-24 text-center border-t border-slate-100 pt-8">
                    <p className="text-xs text-slate-400 font-medium">
                        © 2024 FormBuilder Inc. All rights reserved.<br />
                        <a href="#" className="hover:text-slate-600 cursor-pointer">Privacy Policy</a> •{' '}
                        <a href="#" className="hover:text-slate-600 cursor-pointer">Terms of Service</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
)

export default ResetPasswordSuccess
