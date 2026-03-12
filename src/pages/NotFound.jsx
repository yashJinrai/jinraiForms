import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Ghost, LogIn } from 'lucide-react';
import { Button } from '../components/ui';
import { useAuth } from '../hooks/useAuth';

const NotFound = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleBack = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#3713EC]/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />

            <div className="max-w-2xl w-full text-center relative z-10">
                {/* 404 Illustration placeholder/icon */}
                <div className="mb-8 relative flex justify-center">
                    <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl shadow-[#3713EC]/10 flex items-center justify-center animate-bounce duration-[3000ms]">
                        <Ghost size={64} className="text-[#3713EC]" strokeWidth={1.5} />
                    </div>
                    {/* Shadow for the ghost */}
                    <div className="absolute bottom-[-10px] w-20 h-4 bg-slate-200/50 rounded-full blur-md animate-pulse" />
                </div>

                <h1 className="text-[120px] font-black text-slate-900 leading-none tracking-tighter mb-4 flex justify-center items-center">
                    4<span className="text-[#3713EC]">0</span>4
                </h1>
                
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                    Lost in the Void?
                </h2>
                
                <p className="text-slate-500 font-bold text-lg mb-10 max-w-md mx-auto leading-relaxed">
                    The page you're looking for has vanished or never existed. Don't worry, even the best explorers get lost sometimes.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button 
                        onClick={() => navigate(-1)}
                        className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 px-8 py-4 w-full sm:w-auto flex items-center gap-3 shadow-sm"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </Button>
                    <Button 
                        onClick={handleBack}
                        className="bg-[#3713EC] text-white hover:bg-[#2911A0] px-8 py-4 w-full sm:w-auto flex items-center gap-3 shadow-xl shadow-[#3713EC]/20"
                    >
                        {user ? (
                            <>
                                <Home size={18} />
                                Back to Dashboard
                            </>
                        ) : (
                            <>
                                <LogIn size={18} />
                                Back to Login
                            </>
                        )}
                    </Button>
                </div>

                {/* Technical Info */}
                <div className="mt-16 pt-8 border-t border-slate-100">
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                        JinraiForms Cloud Engine
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
