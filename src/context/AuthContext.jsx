import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import pb from '../utils/pocketbaseClient';
import { setUser, clearUser, setLoading } from '../utils/userSlice';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [initialized, setInitialized] = useState(false);
    const dispatch = useDispatch();

    // Initialize auth state on component mount
    useEffect(() => {
        const initAuth = async () => {
            dispatch(setLoading(true));

            // Check if there's a valid session in PocketBase
            if (pb.authStore.isValid) {
                const userData = {
                    id: pb.authStore.model.id,
                    email: pb.authStore.model.email,
                    name: pb.authStore.model.username || pb.authStore.model.name,
                    avatar: pb.authStore.model.avatar,
                    created: pb.authStore.model.created,
                };
                dispatch(setUser(userData));
            } else {
                dispatch(clearUser());
            }

            dispatch(setLoading(false));
            setInitialized(true);
        };

        initAuth();

        // Set up listener for auth state changes
        pb.authStore.onChange((token, model) => {
            if (model) {
                const userData = {
                    id: model.id,
                    email: model.email,
                    name: model.username || model.name,
                    avatar: model.avatar,
                    created: model.created,
                };
                dispatch(setUser(userData));
            } else {
                dispatch(clearUser());
            }
        });
    }, [dispatch]);

    // Render children only when initialization is complete
    if (!initialized) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ initialized }}>
            {children}
        </AuthContext.Provider>
    );
};