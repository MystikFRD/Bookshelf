import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaUserCircle, FaSave, FaSync, FaSignOutAlt, FaEdit, FaTimes } from 'react-icons/fa';
import { logout, updateUserProfile } from '../../utils/api/authService';
import { setUser, clearUser } from '../../utils/userSlice';

const ProfilePage = () => {
    const { user, isAuthenticated, loading: authLoading } = useSelector(state => state.user);
    const isDark = useSelector(state => state.darkMode.isDark);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        name: '',
        bio: '',
        favoriteGenre: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login', { state: { from: '/profile' } });
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Set initial form data from user state and ensure avatar always loads
    useEffect(() => {
        if (user) {
            console.log("Setting user data:", user);

            setFormData({
                username: user.username || '',
                email: user.email || '',
                name: user.name || '',
                bio: user.bio || '',
                favoriteGenre: user.favoriteGenre || ''
            });

            // Set avatar preview if available
            if (user.avatar && user.collectionId && user.id) {
                try {
                    // Add a timestamp to prevent caching
                    const timestamp = new Date().getTime();
                    const avatarUrl = `https://db.momoh.de/api/files/${user.collectionId}/${user.id}/${user.avatar}?t=${timestamp}`;
                    console.log("Setting avatar URL:", avatarUrl);
                    setAvatarPreview(avatarUrl);
                } catch (e) {
                    console.error('Error setting avatar preview:', e);
                }
            }
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
        setError('');

        // If canceling edit, reset form data to current user data
        if (isEditing && user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                name: user.name || '',
                bio: user.bio || '',
                favoriteGenre: user.favoriteGenre || ''
            });

            // Reset avatar preview
            setAvatarFile(null);
            if (user.avatar && user.collectionId && user.id) {
                const timestamp = new Date().getTime();
                setAvatarPreview(`https://db.momoh.de/api/files/${user.collectionId}/${user.id}/${user.avatar}?t=${timestamp}`);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            console.log("Starting profile update...");

            // Create form data for the request
            const data = new FormData();
            data.append('username', formData.username);
            data.append('name', formData.name);

            // Add bio if present
            if (formData.bio) {
                data.append('bio', formData.bio);
            }

            // Add favorite genre if present
            if (formData.favoriteGenre) {
                data.append('favoriteGenre', formData.favoriteGenre);
            }

            // Only add avatar if a new one is selected
            if (avatarFile) {
                data.append('avatar', avatarFile);
            }

            console.log("Sending profile update with data:", {
                username: formData.username,
                name: formData.name,
                bio: formData.bio,
                favoriteGenre: formData.favoriteGenre,
                hasAvatar: !!avatarFile
            });

            // Update profile
            const updatedUser = await updateUserProfile(data);
            console.log("Profile updated successfully:", updatedUser);

            // Update Redux state
            dispatch(setUser(updatedUser));

            // Show success message
            setSuccess(true);

            // Exit edit mode
            setIsEditing(false);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        dispatch(clearUser());
        navigate('/');
    };

    // Show loading state while waiting for auth
    if (authLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className={`inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid ${isDark ? 'border-blue-400' : 'border-blue-600'} border-r-transparent`}></div>
            </div>
        );
    }

    // Function to render the avatar section
    const renderAvatar = () => {
        return (
            <div className="mb-6 flex flex-col items-center">
                <div className="relative mb-4">
                    {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            alt="Profile Avatar"
                            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                            onError={(e) => {
                                console.error("Avatar loading error");
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/200/blue/white?text=User";
                            }}
                        />
                    ) : (
                        <div className={`w-32 h-32 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <FaUserCircle className="w-24 h-24 text-gray-400" />
                        </div>
                    )}

                    {isEditing && (
                        <label
                            htmlFor="avatar"
                            className={`absolute bottom-0 right-0 p-2 rounded-full cursor-pointer ${
                                isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
                            } text-white`}
                        >
                            <FaUserCircle className="w-5 h-5" />
                            <input
                                type="file"
                                id="avatar"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
                {isEditing && (
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Click the icon to change your profile picture
                    </p>
                )}
            </div>
        );
    };

    // Render profile in view mode
    const renderViewMode = () => {
        return (
            <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                {renderAvatar()}

                <div className="space-y-4">
                    <div>
                        <h3 className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Username</h3>
                        <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.username || 'Not set'}</p>
                    </div>

                    <div>
                        <h3 className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</h3>
                        <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.email || 'Not set'}</p>
                    </div>

                    <div>
                        <h3 className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Display Name</h3>
                        <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.name || 'Not set'}</p>
                    </div>

                    <div>
                        <h3 className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Favorite Genre</h3>
                        <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {user?.favoriteGenre ? user.favoriteGenre.charAt(0).toUpperCase() + user.favoriteGenre.slice(1).replace('_', ' ') : 'Not set'}
                        </p>
                    </div>

                    {user?.bio && (
                        <div>
                            <h3 className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Bio</h3>
                            <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.bio}</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={toggleEditMode}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md ${
                            isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                    >
                        <FaEdit /> Edit Profile
                    </button>
                </div>
            </div>
        );
    };

    // Render profile in edit mode
    const renderEditMode = () => {
        return (
            <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <form onSubmit={handleSubmit}>
                    {/* Avatar Upload */}
                    {renderAvatar()}

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Username */}
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                    isDark
                                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                                }`}
                                required
                            />
                        </div>

                        {/* Display Name */}
                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                            >
                                Display Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                    isDark
                                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                                }`}
                            />
                        </div>
                    </div>

                    {/* Favorite Genre field */}
                    <div className="mb-4">
                        <label
                            htmlFor="favoriteGenre"
                            className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                            Favorite Genre
                        </label>
                        <select
                            id="favoriteGenre"
                            name="favoriteGenre"
                            value={formData.favoriteGenre}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                isDark
                                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                            }`}
                        >
                            <option value="">Select a genre</option>
                            <option value="fiction">Fiction</option>
                            <option value="non_fiction">Non-Fiction</option>
                            <option value="science">Science</option>
                            <option value="fantacy">Fantasy</option>
                            <option value="crime">Crime</option>
                            <option value="romance">Romance</option>
                            <option value="history">History</option>
                            <option value="biography">Biography</option>
                        </select>
                    </div>

                    {/* Email (read-only) */}
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            className={`w-full px-4 py-2 border rounded-md bg-gray-100 ${
                                isDark
                                    ? 'bg-gray-800 border-gray-600 text-gray-400'
                                    : 'bg-gray-100 border-gray-300 text-gray-600'
                            }`}
                            disabled
                        />
                        <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Email cannot be changed
                        </p>
                    </div>

                    {/* Bio */}
                    <div className="mb-6">
                        <label
                            htmlFor="bio"
                            className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                isDark
                                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                            }`}
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-center gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium ${
                                loading
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : isDark
                                        ? 'bg-blue-700 hover:bg-blue-600 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <FaSync className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    Save Changes
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={toggleEditMode}
                            className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium ${
                                isDark
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                            }`}
                        >
                            <FaTimes />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <div className={`py-8 px-4 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Profile Settings</h1>
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-2 px-4 py-2 rounded ${
                            isDark ? 'bg-red-800 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'
                        } text-white`}
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>

                {error && (
                    <div className={`p-4 mb-6 rounded-md ${isDark ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-700'}`}>
                        {error}
                    </div>
                )}

                {success && (
                    <div className={`p-4 mb-6 rounded-md ${isDark ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-700'}`}>
                        Profile updated successfully!
                    </div>
                )}

                {isEditing ? renderEditMode() : renderViewMode()}

                <div className={`p-6 rounded-lg mt-8 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Account Information
                    </h2>
                    <div className="space-y-2">
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            <span className="font-medium">Account created:</span> {user?.created ? new Date(user.created).toLocaleDateString() : 'N/A'}
                        </p>
                        {/* You can add more account info here if needed */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;