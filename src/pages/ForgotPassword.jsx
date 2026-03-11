// src/pages/ForgotPassword.jsx
import { useState } from 'react'
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm'
import OtpVerify from '../components/auth/OtpVerify'
import ResetPasswordForm from '../components/auth/ResetPasswordForm'
import { StatsGrid } from '../components/ui'
import { MdLockReset } from "react-icons/md";
import check from '../assets/icons/check.json'
import checkIn from '../assets/icons/checkIn.json'
import Lottie from "lottie-react";
import { FaLock } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const ForgotPassword = () => {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')

    const stats = [
        { value: '99.9%', label: 'Security' },
        { value: '24/7', label: 'Support' },
        { value: 'Instant', label: 'Recovery' }
    ]

    const handleNext = (data) => {
        if (data?.email) setEmail(data.email)
        setStep(prev => prev + 1)
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return <ForgotPasswordForm onNext={handleNext} />
            case 2:
                return <OtpVerify email={email} onNext={handleNext} />
            case 3:
                return <ResetPasswordForm email={email} onNext={handleNext} />
            case 4:
                return (
                    <div className="text-center space-y-6 py-10">
                        <div className="flex justify-center">
                            <div className="bg-green-100 dark:bg-green-900/30 p-5 rounded-full shadow-lg shadow-green-500/10">
                                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-6xl">
                                    <Lottie
                                        animationData={checkIn}
                                        loop={false}
                                        autoplay={true}
                                        className="w-20 h-20"
                                    />
                                </span>
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Reset Successful
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                            Your password has been successfully reset. <br /> You can now log in with your new credentials.
                        </p>
                        <a
                            href="/login"
                            className="inline-flex items-center justify-center w-full px-6 py-4 bg-[#3713EC] text-white font-bold rounded-xl hover:bg-[#2911A0] transition-all shadow-xl shadow-[#3713EC]/20 text-lg"
                        >
                            Back to Login
                        </a>
                    </div>
                )
            default:
                return <ForgotPasswordForm onNext={handleNext} />
        }
    }

    const stepInfo = [
        { icon: <MdLockReset />, title: 'Forgot password?', desc: "Enter the email address associated with your account and we'll send you a OTP to reset your password.", leftTitle: "No worries, we've got you covered", leftdesc: "Recover your JinraiForm account access in seconds and get back to building amazing forms." },
        { icon: <FaLock />, title: 'Verify your email', desc: `We've sent a 6-digit code to ${email || 'your email'}`, leftTitle: "Secure Verification", leftdesc: "Protecting your data is our top priority. We use industry-standard encryption to keep your forms and responses safe." },
        { icon: <FaLock />, title: 'Create new password', desc: 'Please enter your new password below to regain access to your dashboard.', leftTitle: "Create New password", leftdesc: "Our security systems ensure your data remains protected while you regain access to your account." },
        { icon: <RiVerifiedBadgeFill />, title: 'Reset Successful', desc: 'Secure Account Recovery', leftTitle: "Reset Successful", leftdesc: "Your password has been successfully reset. You can now log in with your new credentials." }
    ]

    const currentInfo = stepInfo[step - 1] || stepInfo[0]

    return (
        <div className="selection:bg-[#3713EC]/10 selection:text-[#3713EC] flex h-screen min-h-screen max-w-full">
            {/* Left Side: Illustration Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12 bg-primary">
                {/* Decorative Gradients & Blobs */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#5d3ef2] to-[#1a0885] opacity-90"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-black/20 rounded-full blur-3xl"></div>

                {/* Background Image Layer */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                    style={{
                        backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUKkzDUD6ZqFOK_cUNBqAH3kQEW9i1BMcSjg8fW3NoLZGjYO4yYrs01SVpqP78Nl_SvE44kaFCEXSXyD5ujlxKbR6blBs6SDW62PclZtrur0bWRyQ07I_1vecdmEG3JDkXRrEGuFQBAJuUZgazw3Q5p0M6O8MnUwYAEn6VtOlqMUkuDakeKiHdBjp06HvVtURCqFwxiHKvALu7jooQgyx_ErIuxMh-CtcCHBQRD0_tzabtKt_Otwpu0OBGxbXPJWQlH8T2IgziRT0')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                ></div>

                {/* Main Content Area */}
                <div className="relative z-10 max-w-lg text-center">
                    <div className="mb-12 flex justify-center">
                        <div className="bg-white/20 backdrop-blur-lg p-3 rounded-2xl border border-white/20 shadow-[-20px_20px_60px_rgba(0,0,0,0.1)] inline-block">
                            <span className="material-symbols-outlined text-white text-5xl block leading-none opacity-90">
                                {currentInfo.icon}
                            </span>
                        </div>
                    </div>

                    <h1 className="text-white text-5xl font-black leading-tight tracking-tight mb-6">
                        {/* No worries, we've got <br /> you covered. */}
                        {currentInfo.leftTitle}
                    </h1>

                    <p className="text-white/80 text-lg">
                        {/* Recover your JinraiForm account access in <br /> seconds and get back to building amazing forms. */}
                        {currentInfo.leftdesc}
                    </p>

                    <StatsGrid stats={stats} />

                    {/* Step Progress Indicators */}
                    {step < 4 && (
                        <div className="flex justify-center gap-3 mt-12">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 w-12 rounded-full transition-all duration-500 ${s <= step ? 'bg-white' : 'bg-white/20'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </div>

            {/* Right Side: Step Content Area */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 py-16">
                <div className="w-full max-w-[440px] space-y-12">


                    {/* Step Flow Header */}
                    {step < 4 && (
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-[#0F172A] tracking-tighter">
                                {currentInfo.title}
                            </h2>
                            <p className="text-slate-400 text-md leading-relaxed font-medium">
                                {currentInfo.desc}
                            </p>
                        </div>
                    )}

                    {/* Form Component Container */}
                    <div className="transition-all duration-700 ease-out translate-y-0 opacity-100">
                        {renderStep()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
