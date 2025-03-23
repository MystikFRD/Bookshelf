import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register } from '../../utils/api/authService';
import { setUser, setLoading, setError } from '../../utils/userSlice';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { loading, error, isAuthenticated } = useSelector((state) => state.user);
    const isDark = useSelector((state) => state.darkMode.isDark);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the redirect path from location state or default to home
    const from = location.state?.from?.pathname || '/';

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setError(null)); // Clear previous errors

        // Simple validation
        if (formData.password !== formData.confirmPassword) {
            dispatch(setError('Passwords do not match'));
            return;
        }

        if (formData.password.length < 8) {
            dispatch(setError('Password must be at least 8 characters'));
            return;
        }

        dispatch(setLoading(true));

        try {
            const userData = await register(formData);
            dispatch(setUser(userData));
            navigate(from, { replace: true });
        } catch (err) {
            dispatch(setError(err.message || 'Registration failed. Please try again.'));
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
                    Create an Account
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className={`block mb-2 font-medium ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                isDark
                                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                            }`}
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            required
                        />
                    </div>

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
                            name="email"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                isDark
                                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                            }`}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className="mb-4">
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
                            name="password"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                isDark
                                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                            }`}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="confirmPassword"
                            className={`block mb-2 font-medium ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                isDark
                                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                            }`}
                            value={formData.confirmPassword}
                            onChange={handleChange}
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
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className={`mt-4 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;