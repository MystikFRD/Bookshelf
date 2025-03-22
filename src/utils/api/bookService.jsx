import pb from '../pocketbaseClient';

// Get all books
export const getAllBooks = async () => {
    try {
        const records = await pb.collection('books').getList(1, 50, {
            sort: '-created',
        });
        return records.items;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw new Error('Failed to fetch books');
    }
};

// Get books by category
export const getBooksByCategory = async (category) => {
    try {
        const records = await pb.collection('books').getList(1, 50, {
            filter: `type = "${category}"`,
            sort: '-created',
        });
        return records.items;
    } catch (error) {
        console.error(`Error fetching ${category} books:`, error);
        throw new Error(`Failed to fetch ${category} books`);
    }
};

// Get a single book by ID
export const getBookById = async (id) => {
    try {
        const record = await pb.collection('books').getOne(id);
        return record;
    } catch (error) {
        console.error('Error fetching book details:', error);
        throw new Error('Failed to fetch book details');
    }
};

// Add a new book
export const addBook = async (bookData) => {
    try {
        // If there's an image file, we need to handle it differently
        const formData = new FormData();

        // Add text fields
        formData.append('title', bookData.title);
        formData.append('author', bookData.author);
        formData.append('type', bookData.type);
        formData.append('description', bookData.description);

        // Add the image if it exists
        if (bookData.image) {
            formData.append('image', bookData.image);
        }

        const record = await pb.collection('books').create(formData);
        return record;
    } catch (error) {
        console.error('Error adding book:', error);
        throw new Error('Failed to add book');
    }
};

// Search books
export const searchBooks = async (query) => {
    try {
        const records = await pb.collection('books').getList(1, 50, {
            filter: `title ~ "${query}" || author ~ "${query}"`,
        });
        return records.items;
    } catch (error) {
        console.error('Error searching books:', error);
        throw new Error('Failed to search books');
    }
};

// Update book rating
export const updateBookRating = async (bookId, rating, review = '') => {
    try {
        // First, get the current book to get existing ratings
        const book = await pb.collection('books').getOne(bookId);

        // Create a new rating record
        const ratingRecord = await pb.collection('ratings').create({
            book: bookId,
            user: pb.authStore.model.id,
            rating: rating,
            review: review,
        });

        // Calculate the new average rating
        const ratingsResponse = await pb.collection('ratings').getList(1, 100, {
            filter: `book = "${bookId}"`,
        });

        const ratings = ratingsResponse.items;
        const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

        // Update the book with the new average rating
        await pb.collection('books').update(bookId, {
            rating: averageRating,
        });

        return { ratingRecord, averageRating };
    } catch (error) {
        console.error('Error updating book rating:', error);
        throw new Error('Failed to update book rating');
    }
};
