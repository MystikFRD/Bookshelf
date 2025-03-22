import pb from '../pocketbaseClient';
import axios from 'axios';
import { handlePocketBaseError } from '../errorHandler';

/**
 * Get all books (from Pocketbase first, then OpenLibrary if empty)
 * @returns {Promise<Array>} List of books
 */
export const getAllBooks = async () => {
    try {
        // First try to get books from Pocketbase
        const records = await pb.collection('books').getList(1, 50, {
            sort: '-created',
        });

        // If there are books in Pocketbase, return them
        if (records.items.length > 0) {
            return records.items;
        }

        // If no books in Pocketbase, fetch from OpenLibrary
        const response = await axios.get('https://openlibrary.org/subjects/fiction.json?limit=12');
        return response.data.works.map(book => ({
            id: book.key.split('/').pop(),
            title: book.title,
            author: book.authors?.map(a => a.name).join(', ') || 'Unknown Author',
            cover_i: book.cover_id,
            subject: book.subject || ['Fiction'],
            type: 'fiction',
            key: book.key,
            description: book.description || 'No description available'
        }));
    } catch (error) {
        console.error('Error fetching books:', error);
        if (error.isAxiosError) {
            // If OpenLibrary is down, return empty array instead of throwing
            return [];
        }
        throw new Error(handlePocketBaseError(error) || 'Failed to fetch books');
    }
};

/**
 * Get books by category
 * @param {string} category - Category to filter by
 * @returns {Promise<Array>} List of books in the category
 */
export const getBooksByCategory = async (category) => {
    try {
        // Normalize category
        const normalizedCategory = category.toLowerCase();

        // First try to get books from Pocketbase by category
        const records = await pb.collection('books').getList(1, 50, {
            filter: `type = "${normalizedCategory}"`,
            sort: '-created',
        });

        // If there are books in Pocketbase, return them
        if (records.items.length > 0) {
            return records.items;
        }

        // If no books in Pocketbase for this category, fetch from OpenLibrary
        const response = await axios.get(`https://openlibrary.org/subjects/${normalizedCategory}.json?limit=20`);
        return response.data.works.map(book => ({
            id: book.key.split('/').pop(),
            title: book.title,
            author: book.authors?.map(a => a.name).join(', ') || 'Unknown Author',
            cover_i: book.cover_id,
            subject: book.subject || [category],
            type: normalizedCategory,
            key: book.key,
            description: book.description || 'No description available'
        }));
    } catch (error) {
        console.error(`Error fetching ${category} books:`, error);
        if (error.isAxiosError) {
            // If OpenLibrary is down, return empty array
            return [];
        }
        throw new Error(handlePocketBaseError(error) || `Failed to fetch ${category} books`);
    }
};

/**
 * Search books in both Pocketbase and OpenLibrary
 * @param {string} query - Search query
 * @returns {Promise<Array>} List of matching books
 */
export const searchBooks = async (query) => {
    try {
        if (!query.trim()) return [];

        // First search in Pocketbase
        const pbResults = await pb.collection('books').getList(1, 20, {
            filter: `title ~ "${query}" || author ~ "${query}"`,
        });

        // If results found in Pocketbase, return them
        if (pbResults.items.length > 0) {
            return pbResults.items;
        }

        // Otherwise search in OpenLibrary
        const response = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
        return response.data.docs.map(book => ({
            id: book.key?.split('/').pop() || Math.random().toString(36).substr(2, 9),
            title: book.title,
            author: book.author_name?.join(', ') || 'Unknown Author',
            cover_i: book.cover_i,
            subject: book.subject,
            type: book.subject?.[0]?.toLowerCase() || 'fiction',
            key: book.key,
            description: book.description || 'No description available'
        }));
    } catch (error) {
        console.error('Error searching books:', error);
        if (error.isAxiosError) {
            // If OpenLibrary is down, return empty array
            return [];
        }
        throw new Error(handlePocketBaseError(error) || 'Failed to search books');
    }
};

/**
 * Get a single book by ID from either Pocketbase or OpenLibrary
 * @param {string} id - Book ID
 * @returns {Promise<Object>} Book details
 */
export const getBookById = async (id) => {
    try {
        // Try to find in Pocketbase first
        try {
            const record = await pb.collection('books').getOne(id);
            return record;
        } catch (pbError) {
            // If not found in Pocketbase, check OpenLibrary
            const response = await axios.get(`https://openlibrary.org/works/${id}.json`);

            // Get cover
            let coverUrl = null;
            if (response.data.covers && response.data.covers.length > 0) {
                coverUrl = `https://covers.openlibrary.org/b/id/${response.data.covers[0]}-L.jpg`;
            }

            return {
                id: id,
                title: response.data.title,
                author: response.data.authors ?
                    await getAuthorNames(response.data.authors) : 'Unknown Author',
                description: response.data.description?.value || response.data.description || 'No description available',
                img: coverUrl,
                cover_i: response.data.covers?.[0],
                subject: response.data.subjects || [],
                type: response.data.subjects?.[0]?.toLowerCase() || 'fiction',
                rating: response.data.ratings_average || 4.0
            };
        }
    } catch (error) {
        console.error('Error fetching book details:', error);
        throw new Error('Failed to fetch book details');
    }
};

/**
 * Add a new book to Pocketbase
 * @param {Object} bookData - Book data
 * @returns {Promise<Object>} Created book record
 */
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
        throw new Error(handlePocketBaseError(error) || 'Failed to add book');
    }
};

/**
 * Update book rating
 * @param {string} bookId - Book ID
 * @param {number} rating - Rating value (1-5)
 * @param {string} review - Optional review text
 * @returns {Promise<Object>} Updated rating info
 */
export const updateBookRating = async (bookId, rating, review = '') => {
    try {
        // Check if the book exists in Pocketbase
        let book;

        try {
            book = await pb.collection('books').getOne(bookId);
        } catch (error) {
            // Book doesn't exist in Pocketbase, it might be from OpenLibrary
            throw new Error('Cannot rate books from external sources. Add the book to your library first.');
        }

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
        throw new Error(handlePocketBaseError(error) || 'Failed to update book rating');
    }
};

/**
 * Add an OpenLibrary book to Pocketbase
 * @param {Object} openLibraryBook - Book data from OpenLibrary
 * @returns {Promise<Object>} Created book record
 */
export const importOpenLibraryBook = async (openLibraryBook) => {
    try {
        // Get more detailed book info if needed
        let bookDetails = openLibraryBook;

        if (!bookDetails.description) {
            try {
                const response = await axios.get(`https://openlibrary.org${openLibraryBook.key}.json`);
                bookDetails = { ...openLibraryBook, ...response.data };
            } catch (error) {
                console.error('Error fetching additional book details:', error);
            }
        }

        // Create image URL from cover_i
        let imageUrl = null;
        if (bookDetails.cover_i) {
            imageUrl = `https://covers.openlibrary.org/b/id/${bookDetails.cover_i}-L.jpg`;
        }

        // Download the image
        let imageBlob = null;
        if (imageUrl) {
            try {
                const imageResponse = await axios.get(imageUrl, { responseType: 'blob' });
                imageBlob = imageResponse.data;
            } catch (error) {
                console.error('Error downloading book cover:', error);
            }
        }

        // Create the book in Pocketbase
        const formData = new FormData();
        formData.append('title', bookDetails.title);
        formData.append('author', bookDetails.author_name?.[0] || bookDetails.authors?.[0]?.name || 'Unknown Author');
        formData.append('type', bookDetails.subject?.[0]?.toLowerCase() || 'fiction');
        formData.append('description', bookDetails.description || 'No description available');

        if (imageBlob) {
            const filename = `${bookDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
            const imageFile = new File([imageBlob], filename, { type: 'image/jpeg' });
            formData.append('image', imageFile);
        }

        const record = await pb.collection('books').create(formData);
        return record;
    } catch (error) {
        console.error('Error importing OpenLibrary book:', error);
        throw new Error(handlePocketBaseError(error) || 'Failed to import book from OpenLibrary');
    }
};

// Helper function to get author names from OpenLibrary
const getAuthorNames = async (authors) => {
    try {
        const authorKeys = authors.map(a => a.author.key);
        const authorPromises = authorKeys.map(key =>
            axios.get(`https://openlibrary.org${key}.json`));
        const responses = await Promise.all(authorPromises);
        return responses.map(res => res.data.name).join(', ');
    } catch (error) {
        console.error('Error fetching author details:', error);
        return 'Unknown Author';
    }
};

// Helper function to get book cover URL from OpenLibrary
export const getBookCover = (coverId, size = 'M') => {
    if (!coverId) {
        return 'https://via.placeholder.com/150?text=No+Cover';
    }
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};