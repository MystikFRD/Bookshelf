import pb from '../pocketbaseClient';

// Get user's reading list
export const getUserReadingList = async () => {
    try {
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
        throw new Error('Failed to add to reading list');
    }
};

// Update reading progress
export const updateReadingProgress = async (readingListId, status, progress) => {
    try {
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
        throw new Error('Failed to update reading progress');
    }
};

// Remove from reading list
export const removeFromReadingList = async (readingListId) => {
    try {
        await pb.collection('reading_list').delete(readingListId);
        return true;
    } catch (error) {
        console.error('Error removing from reading list:', error);
        throw new Error('Failed to remove from reading list');
    }
};
