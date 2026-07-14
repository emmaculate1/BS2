import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import api from '../api';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            await api.post(`/api/auth/reset-password/${token}`, { password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error resetting password. Link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FCF9F6] flex items-center justify-center px-4 py-20">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-red-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-gray-800">Reset Password</h2>
                    <p className="text-gray-500 mt-2">Enter your new password below</p>
                </div>

                {success ? (
                    <div className="text-center">
                        <div className="bg-green-50 text-green-600 p-4 rounded-lg text-sm mb-6">
                            ✅ Password reset successfully! Redirecting to login...
                        </div>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-70"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <span>Reset Password</span>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link to="/login" className="text-primary font-bold hover:underline text-sm">
                                Back to Sign In
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;

