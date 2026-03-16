import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F9] flex items-center justify-center p-4">
            <div className="w-full max-w-[480px] bg-white rounded-[32px] shadow-sm p-8 md:p-12">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-[#1A237E] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-900/20">
                        <ShieldCheck className="text-white" size={24} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                    <p className="text-slate-500">Please enter your details to sign in</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-slate-900 placeholder:text-slate-400"
                                placeholder="alex@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2 ml-1">
                            <label className="text-sm font-semibold text-slate-700">
                                Password
                            </label>
                            <button type="button" className="text-xs font-bold text-indigo-700 hover:text-indigo-800 transition-colors">
                                Forgot Password?
                            </button>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-[#F8FAFC] border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-slate-900 placeholder:text-slate-400"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-[#1A237E] hover:bg-[#151B60] text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center space-x-2"
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative flex items-center justify-center mb-8">
                        <div className="w-full border-t border-slate-100"></div>
                        <span className="absolute px-4 bg-white text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                            Or continue with
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center space-x-3 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors font-semibold text-slate-700">
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                            <span>Google</span>
                        </button>
                        <button className="flex items-center justify-center space-x-3 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors font-semibold text-slate-700">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="w-5 h-5" alt="Apple" />
                            <span>Apple</span>
                        </button>
                    </div>
                </div>

                <p className="mt-10 text-center text-slate-500 font-medium text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-indigo-700 font-bold hover:underline underline-offset-4">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}
