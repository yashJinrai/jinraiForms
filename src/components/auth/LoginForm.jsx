import { useState } from 'react'
import { Button, Input, Divider, Checkbox } from '../ui'
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useRef } from "react";
import Lottie from "lottie-react";
import arrowForward from "../../assets/icons/arrow_forward.json";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    })

    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Login:', formData)
        // Integrate with your Express auth API
    }

    const lottieRef = useRef();

    const handleMouseEnter = () => {
        lottieRef.current?.play();
    };

    const handleMouseLeave = () => {
        lottieRef.current?.stop();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
                <Input
                    label="Email Address"
                    id="email"
                    type="email"
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <div className="flex justify-end mt-1">
                    <a href="#" className="text-sm font-semibold text-[#3713EC] hover:text-[#2911A0] transition-colors">
                        Forgot password?
                    </a>
                </div>
            </div>

            {/* Password with forgot link */}
            <Input
                label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                iconAfter={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="flex items-center justify-center focus:outline-none cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px] select-none">
                            {showPassword ? <LuEye /> : <LuEyeClosed />}
                        </span>
                    </button>
                }
            />

            {/* Remember me */}
            <Checkbox
                id="remember"
                label="Remember for 30 days"
                checked={formData.remember}
                onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
            />

            {/* Submit */}
            <Button type="submit" variant="primary" className="w-full py-3 gap-5" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <span className='font-semibold text-lg'>Sign In</span>
                <span className="material-symbols-outlined text-[18px]">
                    <div className="w-10 h-5 flex items-center ">
                        <Lottie
                            lottieRef={lottieRef}
                            animationData={arrowForward}
                            loop={false}
                            autoplay={true}
                        />
                    </div>
                </span>
            </Button>
        </form>
    )
}

export default LoginForm
