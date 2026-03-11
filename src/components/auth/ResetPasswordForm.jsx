import { useState } from 'react'
import { Input, Button } from '../ui'
import { IoArrowBack } from "react-icons/io5"
import { resetPassword } from '../../lib/auth'

const ResetPasswordForm = ({ email, onNext }) => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        setError('')
        try {
            await resetPassword(email, password)
            onNext()
        } catch (err) {
            setError(err.message || 'Failed to reset password. Please try again.')
            console.error('Reset password error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-lg animate-shake">
                    {error}
                </div>
            )}

            <Input
                label="New Password"
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Input
                label="Confirm New Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
                type="submit"
                className="w-full gap-5 py-3"
                disabled={loading}
            >
                <span className='font-semibold text-lg'>
                    {loading ? 'Resetting...' : 'Reset Password'}
                </span>
            </Button>

            <div className="mt-2 text-center">
                <a href="/login" className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm">
                    <span className="material-symbols-outlined text-lg"><IoArrowBack /></span>
                    Back to login
                </a>
                {/* </div> */}
            </div>

            {/* <div className="pt-24 text-center">
                <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-black mb-4">
                    Secure Account Recovery
                </p>
                <div className="flex justify-center gap-6 text-slate-300 dark:text-slate-700">
                    <span className="material-symbols-outlined text-2xl"><FiUserCheck /></span>
                    <span className="material-symbols-outlined text-2xl"><BiLockAlt /></span>
                    <span className="material-symbols-outlined text-2xl"><MdOutlineVerifiedUser /></span>
                </div>
            </div> */}
        </form>
    )
}

export default ResetPasswordForm
