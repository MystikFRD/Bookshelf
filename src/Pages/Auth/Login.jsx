import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../utils/api/authService';
import { setUser, setLoading, setError } from '../../utils/userSlice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { loading, error, isAuthenticated } = useSelector((state) => state.user);
    const isDark = useSelector((state) => state.darkMode.isDark);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));

        try {
            const userData = await login(email, password);
            dispatch(setUser(userData));
            navigate('/');
        } catch (err) {
            dispatch(setError(err.message || 'Login failed. Please check your credentials.'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="bg-bgBanner bg-cover bg-center py-16 min-h-screen flex items-center justify-center">
            <div className={`max-w-md w-full p-8 rounded-lg shadow-lg ${
                isDark ? 'bg-gray-800/90' : 'bg-white/90'
            }`}>
                <h2 className={`text-2xl font-bold mb-6 text-center ${
                    isDark ? 'text-white' : 'text-gray-800'
                }`}>
                    Login to Your Account
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className={`block mb-2 font-medium ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                isDark
                                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                            }`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className={`block mb-2 font-medium ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                isDark
                                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                            }`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded-md font-medium ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className={`mt-4 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;