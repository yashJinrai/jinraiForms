import { useState, useEffect } from 'react'
import { Button, OtpInput } from '../ui'
import { IoArrowBack } from "react-icons/io5"
import { verifyOtp, forgotPassword } from '../../lib/auth'

const OtpVerify = ({ email, onNext }) => {
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [timer, setTimer] = useState(30) // 30 second cooldown

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleVerify = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')
        try {
            await verifyOtp(email, otp)
            onNext()
        } catch (err) {
            setError(err.message || 'Verification failed. Please check the code and try again.')
            console.error('OTP verification error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async (e) => {
        e.preventDefault();
        if (timer > 0 || resending) return;

        setResending(true);
        setError('');
        setMessage('');
        try {
            await forgotPassword(email);
            setMessage('A new code has been sent to your email.');
            setTimer(30); // reset cooldown
        } catch (err) {
            setError(err.message || 'Failed to resend code. Please try again.');
            console.error('Resend OTP error:', err);
        } finally {
            setResending(false);
        }
    }

    return (
        <div className="w-full max-w-md space-y-8">
            <form onSubmit={handleVerify} className="space-y-6 pt-2">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-lg animate-shake">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
                        {message}
                    </div>
                )}

                <OtpInput
                    length={6}
                    value={otp.split('')}
                    onChange={setOtp}
                />

                <div className="space-y-4">
                    <Button
                        type="submit"
                        className="w-full gap-5 py-3"
                        disabled={loading || otp.length < 6}
                    >
                        <span className='font-semibold text-lg'>
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </span>
                    </Button>

                    <div className="flex flex-col items-center gap-4 pt-4">
                        <p className="text-slate-500 text-sm">
                            Didn't receive the code?{' '}
                            {timer > 0 ? (
                                <span className="font-bold text-primary">Resend in {timer}s</span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resending}
                                    className="text-primary font-bold hover:underline bg-transparent border-none p-0 cursor-pointer disabled:opacity-50"
                                >
                                    {resending ? 'Sending...' : 'Resend code'}
                                </button>
                            )}
                        </p>
                        <a href="/login" className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm">
                            <span className="material-symbols-outlined text-lg"><IoArrowBack /></span>
                            Back to login
                        </a>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default OtpVerify
