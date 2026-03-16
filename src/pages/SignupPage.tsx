import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function SignupPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        try {
            await signup(firstName, lastName, email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create account');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex overflow-hidden">
            {/* Left Side: Branding (Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] p-24 flex-col justify-center relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-3xl opacity-50 animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-3xl opacity-50" />

                <div className="relative z-10 max-w-lg">
                    <div className="w-14 h-14 bg-white/50 backdrop-blur-xl border border-white rounded-2xl flex items-center justify-center mb-10 shadow-sm">
                        <Sparkles className="text-indigo-600" size={28} />
                    </div>

                    <h1 className="text-6xl font-extrabold text-slate-900 leading-[1.1] mb-10">
                        Mind your <span className="text-indigo-600 italic">Money</span>
                    </h1>

                    <div className="text-lg text-slate-600 font-medium leading-relaxed mb-12">
                        <p>Stop wondering where it went.</p>
                        <p>Take full control of your spending and start building your future today.</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* <div className="flex -space-x-3">
                            <img src="https://i.pravatar.cc/100?u=1" className="w-12 h-12 rounded-full border-4 border-white shadow-sm" alt="User" />
                            <img src="https://i.pravatar.cc/100?u=2" className="w-12 h-12 rounded-full border-4 border-white shadow-sm" alt="User" />
                            <img src="https://i.pravatar.cc/100?u=3" className="w-12 h-12 rounded-full border-4 border-white shadow-sm" alt="User" />
                        </div> */}
                        <p className="text-slate-600 font-bold text-sm tracking-wide">
                            - by Krushna
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-12 left-12 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center space-x-4">
                    <span>Secure</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span>Verified</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span>Liquid UI V2.4</span>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F8FAFC]">
                <div className="w-full max-w-[480px] bg-white rounded-[40px] shadow-sm p-10 md:p-14">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-3">Join Us</h2>
                        <p className="text-slate-500 font-medium">Start your journey with us today.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                    placeholder="John"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 pr-14 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-[#1A237E] hover:bg-[#151B60] text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-900/10 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center space-x-2 mt-8"
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span>Create Account</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-10">
                        <div className="relative flex items-center justify-center mb-8">
                            <div className="w-full border-t border-slate-100"></div>
                            <span className="absolute px-4 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                Or sign up with
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center space-x-3 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors font-bold text-xs text-slate-700">
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                                <span>Google</span>
                            </button>
                            <button className="flex items-center justify-center space-x-3 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors font-bold text-xs text-slate-700">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="w-4 h-4" alt="Apple" />
                                <span>Apple</span>
                            </button>
                        </div>
                    </div>

                    <p className="mt-10 text-center text-slate-500 font-bold text-xs">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-700 hover:text-indigo-800 transition-colors">
                            Log in.
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
