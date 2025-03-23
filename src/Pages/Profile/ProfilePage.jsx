import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../utils/userSlice';
import { FaCamera, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const ProfilePage = () => {
    const { user, loading } = useSelector((state) => state.user);
    const isDark = useSelector((state) => state.darkMode.isDark);
    const dispatch = useDispatch();

    const [editMode, setEditMode] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [userData, setUserData] = useState({
        name: '',
        bio: '',
        email: '',
        favoriteGenre: '',
    });

    // Load user data
    useEffect(() => {
        if (user) {
            setUserData({
                name: user.name || '',
                bio: user.bio || '',
                email: user.email || '',
                favoriteGenre: user.favoriteGenre || '',
            });

            if (user.avatar) {
                setAvatarPreview(user.avatar);
            }
        }
    }, [user]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    // Handle avatar file selection
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAvatarFile(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = () => {
            setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create form data with user info and avatar if present
        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('bio', userData.bio);
        formData.append('favoriteGenre', userData.favoriteGenre);

        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        try {
            // Here you would normally make an API call to update the user profile
            // For now, we'll just update the Redux state directly
            dispatch(updateUser({
                ...user,
                ...userData,
                avatar: avatarPreview,
            }));

            setEditMode(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    // Cancel edit mode
    const handleCancel = () => {
        setEditMode(false);
        // Reset to original user data
        if (user) {
            setUserData({
                name: user.name || '',
                bio: user.bio || '',
                email: user.email || '',
                favoriteGenre: user.favoriteGenre || '',
            });
            setAvatarPreview(user.avatar || '');
        }
        setAvatarFile(null);
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
                    <p>You need to be logged in to access your profile page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`max-w-4xl mx-auto py-8 px-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>

            <div className={`rounded-lg shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                {/* Profile header */}
                <div className={`h-40 ${isDark ? 'bg-blue-900' : 'bg-blue-500'} relative`}>
                    {/* Profile picture */}
                    <div className="absolute -bottom-16 left-8">
                        <div className="relative">
                            <div className={`h-32 w-32 rounded-full overflow-hidden border-4 ${isDark ? 'border-gray-800' : 'border-white'}`}>
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className={`h-full w-full flex items-center justify-center text-4xl ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                        {userData.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {editMode && (
                                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer">
                                    <FaCamera className="h-4 w-4" />
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Edit/Save button */}
                    <div className="absolute top-4 right-4">
                        {editMode ? (
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleCancel}
                                    className={`flex items-center space-x-1 px-3 py-1 rounded-md ${
                                        isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                >
                                    <FaTimes className="h-3 w-3" />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex items-center space-x-1 px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <FaSave className="h-3 w-3" />
                                    <span>Save</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setEditMode(true)}
                                className="flex items-center space-x-1 px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <FaEdit className="h-3 w-3" />
                                <span>Edit Profile</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile content */}
                <div className="p-8 pt-20">
                    {editMode ? (
                        <form className="space-y-6">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={userData.name}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                            : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                                    }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    disabled
                                    className={`w-full px-3 py-2 border rounded-md cursor-not-allowed opacity-70 ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-gray-100 border-gray-300 text-gray-900'
                                    }`}
                                />
                                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Favorite Genre
                                </label>
                                <select
                                    name="favoriteGenre"
                                    value={userData.favoriteGenre}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
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
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={userData.bio}
                                    onChange={handleChange}
                                    rows="4"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                            : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                                    }`}
                                />
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold">{userData.name}</h2>
                                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{userData.email}</p>
                            </div>

                            {userData.favoriteGenre && (
                                <div>
                                    <h3 className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Favorite Genre
                                    </h3>
                                    <p className="mt-1">
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                            isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {userData.favoriteGenre.charAt(0).toUpperCase() + userData.favoriteGenre.slice(1).replace('_', ' ')}
                                        </span>
                                    </p>
                                </div>
                            )}

                            {userData.bio && (
                                <div>
                                    <h3 className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Bio
                                    </h3>
                                    <p className="mt-1">{userData.bio}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Reading Statistics */}
            <div className={`mt-8 rounded-lg shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className={`px-6 py-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h2 className="text-xl font-bold">Reading Stats</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className="text-lg font-medium mb-1">Books Read</h3>
                        <p className="text-3xl font-bold text-blue-600">12</p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className="text-lg font-medium mb-1">Currently Reading</h3>
                        <p className="text-3xl font-bold text-green-600">3</p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className="text-lg font-medium mb-1">Want to Read</h3>
                        <p className="text-3xl font-bold text-yellow-600">25</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;