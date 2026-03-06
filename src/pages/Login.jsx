import LoginForm from '../components/auth/LoginForm'
import GoogleButton from '../components/auth/GoogleButton'
import { Divider } from '../components/ui'
import logo from '../../src/assets/images/JLogobg.png';
import { IoCheckboxOutline } from "react-icons/io5";
import { IoMdRadioButtonOn } from "react-icons/io";
import { SiGoogleanalytics } from "react-icons/si";

const Login = () => {
    return (
        <div className="flex h-screen min-h-screen max-w-full mx-auto">
            {/* Left Side: Form */}
            <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 md:p-16 bg-white">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-10">
                        <div className="w-10 h-10 p-1 bg-white rounded-lg flex items-center justify-center">
                            <img src={logo} alt="JinraiForms" />
                        </div>
                        <span className="text-[#0F172A] text-2xl font-black tracking-tight">JinraiForms</span>
                    </div>

                    {/* Welcome */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-2">Welcome back</h1>
                        <p className="text-[#64748B]">Please enter your details to sign in to your account.</p>
                    </div>

                    {/* Google */}
                    <div className="flex flex-col gap-3 mb-8">
                        <GoogleButton />
                    </div>

                    <Divider>or email</Divider>

                    {/* Form */}
                    <LoginForm />

                    {/* Signup link */}
                    <p className="mt-8 text-center text-slate-600 dark:text-slate-400">
                        Don't have an account?{' '}
                        <a href="/" className="text-primary font-bold hover:underline">Create an account</a>
                    </p>
                </div>
            </div>

            {/* Right Side: Hero */}
            <div className="hidden lg:flex w-1/2 bg-mesh relative overflow-hidden items-center justify-center">
                {/* Decorations */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 w-full max-w-lg p-12 text-center">
                    {/* Form Mockup */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl mb-12 transform -rotate-2">
                        <div className="flex flex-col gap-4 text-left">
                            <div className="h-4 w-3/4 bg-white/20 rounded-full"></div>
                            <div className="h-4 w-1/2 bg-white/20 rounded-full"></div>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="h-20 bg-[#3E29C3] rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white/50 text-4xl">
                                        <IoCheckboxOutline />
                                    </span>
                                </div>
                                <div className="h-20 bg-white/10 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white/50 text-4xl">
                                        <IoMdRadioButtonOn />
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2 h-10 w-full bg-white/30 rounded-lg flex items-center px-4">
                                <div className="h-2 w-1/3 bg-white/40 rounded-full"></div>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 rotate-12">
                            <span className="material-symbols-outlined text-white text-5xl">
                                <SiGoogleanalytics />
                            </span>
                        </div>
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-4">Build better forms.</h2>
                    <p className="text-white/80 text-md leading-relaxed">
                        Join over 10,000 teams who use FormBuilder to capture leads, conduct research, and gather insights effortlessly.
                    </p>
                </div>

                {/* Footer */}
                <div className="absolute bottom-8 left-0 right-0 text-center">
                    <div className="flex justify-center gap-8 text-white/40">
                        <span className="text-sm font-medium">© 2026 Jinrai Technologies Pvt Ltd</span>
                        <a href="https://jinraitech.com/privacy-policy" className="text-sm hover:text-white transition-colors">Privacy</a>
                        <a href="https://jinraitech.com/terms-and-conditions" className="text-sm hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
