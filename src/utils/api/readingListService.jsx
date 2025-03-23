import pb from '../pocketbaseClient';

// Get user's reading list with retry mechanism
export const getUserReadingList = async (retryCount = 0) => {
    try {
        // Delay for retries to allow auth to settle
        if (retryCount > 0) {
            await new Promise(resolve => setTimeout(resolve, 800 * retryCount));
        }

        // Check if user is authenticated
        if (!pb.authStore.isValid || !pb.authStore.model?.id) {
            console.log('User not authenticated, cannot fetch reading list');

            // Auto-retry once if we think authentication might still be initializing
            if (retryCount < 1 && localStorage.getItem('pocketbase_auth')) {
                console.log('Auth token exists but not loaded yet, retrying...');
                return getUserReadingList(retryCount + 1);
            }

            return [];
        }

        const userId = pb.authStore.model.id;

        // Set options with an abort controller to prevent hanging requests
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
            // Use a simpler request first to avoid expand issues
            const records = await pb.collection('reading_list').getList(1, 100, {
                filter: `user = "${userId}"`,
                signal: controller.signal
            });

            clearTimeout(timeout);

            // If we got the list without books, now fetch with expansion
            if (records.items.length > 0) {
                try {
                    const expandedRecords = await pb.collection('reading_list').getList(1, 100, {
                        filter: `user = "${userId}"`,
                        expand: 'book'
                    });
                    return expandedRecords.items;
                } catch (expandError) {
                    console.log('Error expanding book data:', expandError);
                    return records.items; // Return unexpanded items if expand fails
                }
            }

            return records.items;
        } catch (error) {
            // Check if it's a cancellation error
            if (error.name === 'AbortError' ||
                (error.message && error.message.includes('autocancelled'))) {
                console.log('Request was cancelled or timed out');

                // Auto-retry once for cancellation errors
                if (retryCount < 2) {
                    console.log(`Retrying after cancellation (attempt ${retryCount + 1})...`);
                    return getUserReadingList(retryCount + 1);
                }

                return [];
            }
            throw error;
        }
    } catch (error) {
        console.error('Error fetching reading list:', error);

        // Return empty array instead of throwing to prevent UI crashes
        if (error.status === 401) {
            console.log('Authentication error, returning empty reading list');
            return [];
        }

        // Auto-retry for network errors
        if (retryCount < 2 && (error.status === 0 || error.status >= 500)) {
            console.log(`Network error, retrying (attempt ${retryCount + 1})...`);
            return getUserReadingList(retryCount + 1);
        }

        throw new Error('Failed to fetch reading list');
    }
};

// Add book to reading list
export const addToReadingList = async (bookId, status = 'to-read', progress = {}) => {
    try {
        // Validate authentication
        if (!pb.authStore.isValid || !pb.authStore.model?.id) {
            throw new Error('You must be logged in to add books to your reading list');
        }

        const userId = pb.authStore.model.id;

        const data = {
            user: userId,
            book: bookId,
            status: status,
            currentPage: progress.currentPage || 0,
            totalPages: progress.totalPages || 0,
            currentChapter: progress.currentChapter || 0,
            totalChapters: progress.totalChapters || 0,
            dateAdded: new Date().toISOString(),
        };

        const record = await pb.collection('reading_list').create(data);
        return record;
    } catch (error) {
        console.error('Error adding to reading list:', error);

        if (error.status === 401) {
            throw new Error('You must be logged in to add books to your reading list');
        } else if (error.status === 400 && error.data?.book?.message) {
            throw new Error(error.data.book.message);
        }

        throw new Error('Failed to add to reading list');
    }
};

// Update reading progress
export const updateReadingProgress = async (readingListId, status, progress) => {
    try {
        // Validate authentication
        if (!pb.authStore.isValid) {
            throw new Error('You must be logged in to update your reading progress');
        }

        const data = {
            status: status,
            currentPage: progress.currentPage || 0,
            totalPages: progress.totalPages || 0,
            currentChapter: progress.currentChapter || 0,
            totalChapters: progress.totalChapters || 0,
        };

        const record = await pb.collection('reading_list').update(readingListId, data);
        return record;
    } catch (error) {
        console.error('Error updating reading progress:', error);

        if (error.status === 401) {
            throw new Error('You must be logged in to update your reading progress');
        } else if (error.status === 404) {
            throw new Error('This book is no longer in your reading list');
        }

        throw new Error('Failed to update reading progress');
    }
};

// Remove from reading list
export const removeFromReadingList = async (readingListId) => {
    try {
        // Validate authentication
        if (!pb.authStore.isValid) {
            throw new Error('You must be logged in to manage your reading list');
        }

        await pb.collection('reading_list').delete(readingListId);
        return true;
    } catch (error) {
        console.error('Error removing from reading list:', error);

        if (error.status === 401) {
            throw new Error('You must be logged in to manage your reading list');
        } else if (error.status === 404) {
            throw new Error('This book is no longer in your reading list');
        }

        throw new Error('Failed to remove from reading list');
    }
};