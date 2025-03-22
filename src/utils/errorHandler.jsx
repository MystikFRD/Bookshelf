
export const handlePocketBaseError = (error) => {
    // Check if it's a PocketBase ClientResponseError
    if (error && error.response && error.response.data) {
        // Extract the main error message if available
        if (error.response.message) {
            return error.response.message;
        }

        // Handle validation errors (field specific errors)
        if (error.response.data) {
            const messages = [];
            for (const field in error.response.data) {
                const fieldError = error.response.data[field];
                if (typeof fieldError === 'string') {
                    messages.push(`${field}: ${fieldError}`);
                } else if (Array.isArray(fieldError)) {
                    messages.push(`${field}: ${fieldError.join(', ')}`);
                }
            }

            if (messages.length > 0) {
                return messages.join('\n');
            }
        }
    }

    // Fallback to the error message or a generic error
    return error.message || 'An unexpected error occurred';
};

export default handlePocketBaseError;