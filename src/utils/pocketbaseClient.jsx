import PocketBase from 'pocketbase';

// Initialize PocketBase client with persistence
const pb = new PocketBase('https://db.momoh.de');

// Load auth state from localStorage on page load
// This ensures authentication state persists across page refreshes
if (typeof window !== 'undefined') {
    // Check if there's a stored auth state
    try {
        const storedAuthState = localStorage.getItem('pocketbase_auth');

        if (storedAuthState) {
            try {
                const { token, model } = JSON.parse(storedAuthState);
                pb.authStore.save(token, model);
            } catch (error) {
                console.error('Error restoring auth state:', error);
                // Clear invalid auth state
                localStorage.removeItem('pocketbase_auth');
            }
        }
    } catch (error) {
        console.error('Error accessing localStorage:', error);
    }

    // Set up listener to save auth state changes to localStorage
    pb.authStore.onChange((token, model) => {
        try {
            if (token && model) {
                localStorage.setItem('pocketbase_auth', JSON.stringify({ token, model }));
            } else {
                localStorage.removeItem('pocketbase_auth');
            }
        } catch (error) {
            console.error('Error updating auth state in localStorage:', error);
        }
    });
}

export default pb;