import pb from '../pocketbaseClient';

// Login with email and password
export const login = async (email, password) => {
    try {
        const authData = await pb.collection('users').authWithPassword(email, password);

        // Return the user data
        return {
            id: authData.record.id,
            email: authData.record.email,
            name: authData.record.name || authData.record.username,
            username: authData.record.username,
            bio: authData.record.bio || '',
            avatar: authData.record.avatar,
            created: authData.record.created,
            collectionId: authData.record.collectionId
            // You can add more user fields here as needed
        };
    } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Authentication failed');
    }
};

// Register a new user
export const register = async (userData) => {
    try {
        const data = {
            email: userData.email,
            password: userData.password,
            passwordConfirm: userData.confirmPassword,
            name: userData.username,
        };

        const record = await pb.collection('users').create(data);

        // After creating the user, log them in
        return await login(userData.email, userData.password);
    } catch (error) {
        console.error('Registration error:', error);
        throw new Error(error.message || 'Registration failed');
    }
};

// Logout user
export const logout = () => {
    pb.authStore.clear();
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return pb.authStore.isValid;
};

// Get current user data
export const getCurrentUser = () => {
    if (!isAuthenticated()) {
        return null;
    }

    const model = pb.authStore.model;
    return {
        id: model.id,
        email: model.email,
        name: model.name || model.username,
        username: model.username,
        bio: model.bio || '',
        avatar: model.avatar,
        created: model.created,
        collectionId: model.collectionId
    };
};

/**
 * Update user profile
 * @param {FormData} formData - Form data with profile updates
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserProfile = async (formData) => {
    try {
        if (!pb.authStore.isValid || !pb.authStore.model?.id) {
            throw new Error('User not authenticated');
        }

        const userId = pb.authStore.model.id;

        // Make sure formData contains the correct fields
        // PocketBase might reject the request if we try to update fields that don't exist
        const validFormData = new FormData();

        // Only add fields that exist in the form data and are allowed to be updated
        if (formData.has('username')) validFormData.append('username', formData.get('username'));
        if (formData.has('name')) validFormData.append('name', formData.get('name'));
        if (formData.has('bio')) validFormData.append('bio', formData.get('bio'));
        if (formData.has('avatar')) validFormData.append('avatar', formData.get('avatar'));

        // Handle special case for avatar
        if (formData.has('avatar') && !formData.get('avatar')) {
            // If avatar is null or empty, clear the avatar field
            validFormData.append('avatar', null);
        }

        // Add retry mechanism
        let retries = 0;
        const maxRetries = 2;

        while (retries <= maxRetries) {
            try {
                const record = await pb.collection('users').update(userId, validFormData);

                // Update auth store model to reflect changes
                pb.authStore.save(pb.authStore.token, record);

                return {
                    id: record.id,
                    email: record.email,
                    username: record.username,
                    name: record.name,
                    bio: record.bio || '',
                    avatar: record.avatar,
                    created: record.created,
                    collectionId: record.collectionId
                };
            } catch (err) {
                // Check if it's a network error or auto-cancellation
                if ((err.status === 0 || err.message?.includes('autocancelled')) && retries < maxRetries) {
                    retries++;
                    console.log(`Retrying profile update (${retries}/${maxRetries})...`);
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else {
                    throw err;
                }
            }
        }
    } catch (error) {
        console.error('Error updating user profile:', error);

        // Provide more specific error messages
        if (error.status === 400) {
            if (error.data?.username?.message) {
                throw new Error(`Username error: ${error.data.username.message}`);
            } else if (error.data?.avatar?.message) {
                throw new Error(`Avatar error: ${error.data.avatar.message}`);
            }
        }

        throw new Error('Failed to update profile');
    }
};