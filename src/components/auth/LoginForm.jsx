import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Divider } from '../ui'
import Lottie from "lottie-react"
import GoogleButton from './GoogleButton'
import arrowForward from "../../assets/icons/arrow_forward.json"
import { login as loginApi } from '../../lib/auth'
import { useAuth } from '../../hooks/useAuth'

const LoginForm = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const data = await loginApi({
                email: formData.email,
                password: formData.password
            })
            console.log('Login successful:', data)
            login(data) // Update global auth state
            navigate('/dashboard')
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.')
            console.error('Login error:', err)
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
            <GoogleButton text="Sign in with Google" />

            <Divider>Login with email</Divider>

            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-lg animate-shake">
                    {error}
                </div>
            )}

            {/* Email and forgot password link*/}
            <div>
                <Input
                    label="Email Address"
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <div className="flex justify-end mt-1">
                    <a href="/forgot-password" className="text-sm font-semibold text-[#3713EC] hover:text-[#2911A0] transition-colors">
                        Forgot password?
                    </a>
                </div>
            </div>

            {/* Password*/}
            <Input
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            {/* Submit */}
            <div className='pt-2'>
                <Button
                    type="submit"
                    className="w-full gap-5 py-3"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    disabled={loading}
                >
                    <span className='font-semibold text-lg'>
                        {loading ? 'Signing In...' : 'Sign In'}
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

export default LoginForm
