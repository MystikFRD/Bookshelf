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
            favoriteGenre: authData.record.favoriteGenre || '',
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
        favoriteGenre: model.favoriteGenre || '',
        avatar: model.avatar,
        created: model.created,
        collectionId: model.collectionId
    };
};

/**
 * Update user profile - simplified version with plain object instead of FormData
 * @param {FormData} formData - Form data with profile updates
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserProfile = async (formData) => {
    try {
        if (!pb.authStore.isValid || !pb.authStore.model?.id) {
            console.error("Authentication invalid for profile update");
            throw new Error('User not authenticated');
        }

        const userId = pb.authStore.model.id;
        console.log("Updating profile for user:", userId);

        // Convert FormData to plain object for simpler handling
        // This is more reliable with PocketBase in some cases
        const updateData = {};

        // Extract data from FormData and create a plain object
        if (formData.get('username')) updateData.username = formData.get('username');
        if (formData.get('name')) updateData.name = formData.get('name');
        if (formData.get('bio')) updateData.bio = formData.get('bio');
        if (formData.get('favoriteGenre')) updateData.favoriteGenre = formData.get('favoriteGenre');

        // Special handling for avatar if it's a File object
        if (formData.get('avatar') instanceof File) {
            // Keep avatar as is in FormData for file uploads
            console.log("Avatar file detected for upload");

            // Use a simplified approach for avatar upload
            try {
                // First update text fields
                console.log("Updating text fields:", updateData);
                const updatedRecord = await pb.collection('users').update(userId, updateData);

                // Then, if we have an avatar, update it separately
                if (formData.get('avatar')) {
                    console.log("Now updating avatar file");
                    const avatarData = new FormData();
                    avatarData.append('avatar', formData.get('avatar'));

                    const finalRecord = await pb.collection('users').update(userId, avatarData);
                    pb.authStore.save(pb.authStore.token, finalRecord);
                    return mapUserRecord(finalRecord);
                }

                // If no avatar to update, return the record from text fields update
                pb.authStore.save(pb.authStore.token, updatedRecord);
                return mapUserRecord(updatedRecord);
            } catch (err) {
                console.error("Error in two-step update process:", err);
                throw err;
            }
        } else {
            // No avatar to upload, just update the text fields
            console.log("Updating user profile with data:", updateData);
            try {
                const record = await pb.collection('users').update(userId, updateData);
                console.log("Profile updated successfully:", record);

                // Update auth store model to reflect changes
                pb.authStore.save(pb.authStore.token, record);

                return mapUserRecord(record);
            } catch (err) {
                console.error("Error updating profile:", err);
                throw err;
            }
        }
    } catch (error) {
        console.error('Error in updateUserProfile:', error);

        // Return detailed error message
        if (error.data) {
            // Extract field-specific error messages
            const errorMessages = [];
            for (const field in error.data) {
                errorMessages.push(`${field}: ${error.data[field].message}`);
            }
            if (errorMessages.length > 0) {
                throw new Error(errorMessages.join(', '));
            }
        }

        throw new Error(`Failed to update profile: ${error.message || 'Unknown error'}`);
    }
};

// Helper function to map PB user record to our app's user object format
function mapUserRecord(record) {
    return {
        id: record.id,
        email: record.email,
        username: record.username,
        name: record.name,
        bio: record.bio || '',
        favoriteGenre: record.favoriteGenre || '',
        avatar: record.avatar,
        created: record.created,
        collectionId: record.collectionId
    };
}