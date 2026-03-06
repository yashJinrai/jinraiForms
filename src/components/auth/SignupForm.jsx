import { useState } from 'react'
import { Button, Input, Divider, Checkbox } from '../ui'
import GoogleButton from './GoogleButton'
import Lottie from "lottie-react";
import { useRef } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import arrowForward from "../../assets/icons/arrow_forward.json";

const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        terms: false
    })
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Signup:', formData)
    }

    const lottieRef = useRef();

    const handleMouseEnter = () => {
        lottieRef.current?.play();
    };

    const handleMouseLeave = () => {
        lottieRef.current?.stop();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <GoogleButton />

            <Divider>Or continue with email</Divider>

            <Input
                label="Full Name"
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
                label="Password"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
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

            <Checkbox
                id="terms"
                label={
                    <>
                        By signing up, you agree to our{' '}
                        <a href="https://jinraitech.com/terms-and-conditions" className="text-[#3713EC] hover:underline font-medium">Terms of Service</a>{' '}
                        and{' '}
                        <a href="https://jinraitech.com/privacy-policy" className="text-[#3713EC] hover:underline font-medium">Privacy Policy</a>.
                    </>
                }
                checked={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
            />

            <div className="pt-2">
                <Button type="submit" className="w-full gap-5 py-3" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <span className='font-semibold text-lg'>Create Account</span>
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
            </div>
        </form>
    )
}

export default SignupForm
