import SignupForm from '../components/auth/SignupForm'
import logo from '../../src/assets/images/JLogobg.png';
import GlassPlaceholder from '../components/ui/GlassPlaceholder';

const Signup = () => {

    const testimonial = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCcdFXeUsEOd4Fk8Xzves0IltBixCYf7cH6dall64ydX8N71KEnp1BR9vj5Za55bBWnWRJwJAZ9dZ3V4uUFCeXSKIw8UOzw8x0tGp7wkWmOZS1IwFcZMk-fX_Me8q41cYZ6OsL1Hg45FMjWPrFHOURtkBdGxGrcYviCzoCPwkgOcT3fVSZ0dDq8sCPBM-qjogQJeBwS1HLcgdd7xsBCkPU9BhtPEBes3G6kLM_8VKP6s6erYLtRw1l-djRbWfJS7XB1BDXtDlFSseY",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA6LNnZQarZDzQFKc5sI-kyhoAauBb_7ptq_w1aS-Z4jA0TkRzOJbhLcYyuvYheNgJJWtqItfV4tAbPdD_635dzDz8t59TOt5ttxfArUhc2YpNEoVY3B-jaFH5IbuC2_8BNTBbWnKK6rJ_KdjrcRI4PIpJUz-1SdW8_N2T0uXVnjrvn_w0ysBxSL7FQ36HDKO5GU1AZMrWx-QPWhuKJ790V4FoL2nAOGzPhztiemdZAozClkM6QW5T7YeOY9ONGKoByrKq4geVyd6A",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCuzOxPKBUuRASHf3xMTgX_1St9iRfHzOhgU8II1d9TIL9xd4WScSR2zRq3O9rGLhC401hIGlefQXlO3cpQpJw2y3NL9-Hz_PPuSlMAYWqwQqPF4h0UeE7j-m3tx_MfKmqdOhn0Sznl1buSfHmOFG6EEwyfR9JrQbtSRNmLwNPiQbmf6jhQht41CHcqNFTJi80QiuHGGnmP6zS949n8groAQhDaM0bH-BXPbhN7aQjDLgcYthQZndY6Y4Xf4eGB3GDPPydfmHIrHRk",
    ];

    return (
        <div className="flex h-screen min-h-screen max-w-full">
            {/* Left Side: Brand & Visuals */}
            <div className="hidden lg:flex lg:w-1/2 gradient-bg p-12 flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-10">
                        <div className="w-10 h-10 p-1 bg-white rounded-lg flex items-center justify-center">
                            <img src={logo} alt="JinraiForms" />
                        </div>
                        <span className="text-white text-2xl font-black tracking-tight">JinraiForms</span>
                    </div>
                    <div className="max-w-md">
                        <h1 className="text-white text-5xl font-black leading-tight tracking-tight mb-6">
                            Join 10,000+ teams building better forms.
                        </h1>
                        <p className="text-white/80 text-lg">
                            Create, share, and analyze professional forms in minutes. The most powerful form builder for modern teams.
                        </p>
                    </div>
                </div>

                {/* Testimonial */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <div className="flex -space-x-3 mb-4">
                        {testimonial.map((imgSrc, index) => (
                            <img key={index} src={imgSrc} alt="" className="w-10 h-10 rounded-full border-2 border-primary" />
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-primary bg-primary flex items-center justify-center text-xs text-white font-bold">+9k</div>
                    </div>
                    <p className="text-white text-sm font-medium">"JinraiForms transformed how we collect lead data. It's fast, beautiful, and integrates with everything."</p>
                </div>

                {/* Background Glass Element */}
                <GlassPlaceholder className="top-[20%] -right-32 rotate-[-10deg] opacity-50" />

                {/* Background Decorations */}
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
                <div className="max-w-md w-full">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                            <img src={logo} alt="JinraiForms" />
                        </div>
                        <span className="text-[#0F172A] text-xl font-bold">JinraiForms</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-[#0F172A] text-3xl font-extrabold tracking-tight mb-2">Create your account</h1>
                        {/* <p className="text-[#64748B]">Start your 14-day free trial. No credit card required.</p> */}
                    </div>

                    {/* Form */}
                    <SignupForm />
                    
                    {/* Login Link */}
                    <div className="mt-4 text-center">
                        <p className="text-[#475569] text-sm font-regular">
                            Already have an account?{' '}
                            <a href="/login" className="text-[#3713EC] font-bold hover:underline ml-1 transition-all">Sign in</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
