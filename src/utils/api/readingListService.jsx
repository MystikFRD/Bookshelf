import pb from '../pocketbaseClient';

// Get user's reading list
export const getUserReadingList = async () => {
    try {
        if (!pb.authStore.isValid) {
            throw new Error('User not authenticated');
        }

        const userId = pb.authStore.model.id;
        const records = await pb.collection('reading_list').getList(1, 100, {
            filter: `user = "${userId}"`,
            expand: 'book',
        });
        return records.items;
    } catch (error) {
        console.error('Error fetching reading list:', error);
        throw new Error('Failed to fetch reading list');
    }
};

// Add book to reading list
export const addToReadingList = async (bookId, status = 'to-read', progress = {}) => {
    try {
        if (!pb.authStore.isValid) {
            throw new Error('User not authenticated');
        }

        const userId = pb.authStore.model.id;

        // Check if the book is already in the reading list
        const existingRecords = await pb.collection('reading_list').getList(1, 1, {
            filter: `user = "${userId}" && book = "${bookId}"`
        });

        if (existingRecords.items.length > 0) {
            // Update existing record
            const existingId = existingRecords.items[0].id;
            const data = {
                status: status,
                currentPage: progress.currentPage || 0,
                totalPages: progress.totalPages || 0,
                currentChapter: progress.currentChapter || 0,
                totalChapters: progress.totalChapters || 0,
                dateUpdated: new Date().toISOString(),
            };

            const record = await pb.collection('reading_list').update(existingId, data);
            return record;
        } else {
            // Create new record
            const data = {
                user: userId,
                book: bookId,
                status: status,
                currentPage: progress.currentPage || 0,
                totalPages: progress.totalPages || 0,
                currentChapter: progress.currentChapter || 0,
                totalChapters: progress.totalChapters || 0,
                dateAdded: new Date().toISOString(),
                dateUpdated: new Date().toISOString(),
            };

            const record = await pb.collection('reading_list').create(data);
            return record;
        }
    } catch (error) {
        console.error('Error adding to reading list:', error);

        // For development without a backend, return a mock success
        if (process.env.NODE_ENV === 'development') {
            console.log('Mock success - would have added book to list with status:', status);
            return {
                id: 'mock-id-' + Math.random().toString(36).substr(2, 9),
                book: bookId,
                status,
                currentPage: progress.currentPage || 0,
                totalPages: progress.totalPages || 0,
                created: new Date().toISOString()
            };
        }

        throw new Error('Failed to add to reading list');
    }
};

// Update reading progress
export const updateReadingProgress = async (readingListId, status, progress) => {
    try {
        if (!pb.authStore.isValid) {
            throw new Error('User not authenticated');
        }

        const data = {
            status: status,
            currentPage: progress.currentPage || 0,
            totalPages: progress.totalPages || 0,
            currentChapter: progress.currentChapter || 0,
            totalChapters: progress.totalChapters || 0,
            dateUpdated: new Date().toISOString(),
        };

        const record = await pb.collection('reading_list').update(readingListId, data);
        return record;
    } catch (error) {
        console.error('Error updating reading progress:', error);

        // For development without a backend
        if (process.env.NODE_ENV === 'development') {
            console.log('Mock success - would have updated reading progress', { readingListId, status, progress });
            return {
                id: readingListId,
                status,
                ...progress,
                updated: new Date().toISOString()
            };
        }

        throw new Error('Failed to update reading progress');
    }
};

// Remove from reading list
export const removeFromReadingList = async (readingListId) => {
    try {
        if (!pb.authStore.isValid) {
            throw new Error('User not authenticated');
        }

        await pb.collection('reading_list').delete(readingListId);
        return true;
    } catch (error) {
        console.error('Error removing from reading list:', error);

        // For development without a backend
        if (process.env.NODE_ENV === 'development') {
            console.log('Mock success - would have removed item from reading list:', readingListId);
            return true;
        }

        throw new Error('Failed to remove from reading list');
    }
};``