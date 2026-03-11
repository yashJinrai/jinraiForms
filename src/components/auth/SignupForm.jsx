import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Divider, Checkbox } from '../ui'
import GoogleButton from './GoogleButton'
import Lottie from "lottie-react"
import arrowForward from "../../assets/icons/arrow_forward.json"
import { register } from '../../lib/auth'

const SignupForm = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        terms: false
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.terms) {
            setError('You must agree to the Terms and Conditions')
            return
        }

        setLoading(true)
        setError('')
        try {
            const data = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'user'
            })
            console.log('Signup successful:', data)
            // Automatically log in or redirect to login
            navigate('/login')
        } catch (err) {
            setError(err.message || 'Signup failed. Please try again.')
            console.error('Signup error:', err)
        } finally {
            setLoading(false)
        }
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
            <GoogleButton text="Sign up with Google" />

            <Divider>Or continue with email</Divider>

            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-lg animate-shake">
                    {error}
                </div>
            )}

            {/* Name */}
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
            {/* Email */}
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
            {/* Password */}
            <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            {/* Submit */}
            <div className="pt-2">
                <Button
                    type="submit"
                    className="w-full gap-5 py-3"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    disabled={loading}
                >
                    <span className='font-semibold text-lg'>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </span>
                    {!loading && (
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
                    )}
                </Button>
            </div>
        </form>
    )
}

export default SignupForm
