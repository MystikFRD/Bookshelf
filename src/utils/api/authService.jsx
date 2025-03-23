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
            avatar: authData.record.avatar,
            created: authData.record.created,
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
        avatar: model.avatar,
        created: model.created,
    };
};