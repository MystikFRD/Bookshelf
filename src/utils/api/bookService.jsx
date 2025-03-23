import pb from '../pocketbaseClient';
import axios from 'axios';
import { handlePocketBaseError } from '../errorHandler';

/**
 * Get all books (from Pocketbase first, then OpenLibrary if empty)
 * @returns {Promise<Array>} List of books
 */
export const getAllBooks = async () => {
    try {
        // Try fetching from OpenLibrary first - it's more reliable for testing
        const response = await axios.get('https://openlibrary.org/subjects/fiction.json?limit=12');

        if (response.data && response.data.works && response.data.works.length > 0) {
            return response.data.works.map(book => ({
                id: book.key.split('/').pop(),
                title: book.title,
                author: book.authors?.map(a => a.name).join(', ') || 'Unknown Author',
                cover_i: book.cover_id,
                subject: book.subject || ['Fiction'],
                type: 'fiction',
                key: book.key,
                description: book.description || 'No description available',
                img: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` : 'https://placehold.co/400x600/png?text=' + encodeURIComponent(book.title)
            }));
        }

        // If OpenLibrary fails, try PocketBase
        try {
            const records = await pb.collection('books').getList(1, 50, {
                sort: '-created',
            });

            if (records.items.length > 0) {
                return records.items;
            }
        } catch (pbError) {
            console.error('PocketBase fetch error:', pbError);
        }

        // If both fail, use sample books
        return getSampleBooks();
    } catch (error) {
        console.error('Error fetching books:', error);
        return getSampleBooks();
    }
};

/**
 * Fallback sample books when all APIs fail
 */
const getSampleBooks = () => {
    return [
        {
            id: 'sample1',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            type: 'fiction',
            description: 'A novel about the American Dream set in the Roaring Twenties.',
            img: 'https://placehold.co/400x600/png?text=The+Great+Gatsby',
            rating: 4.5
        },
        {
            id: 'sample2',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            type: 'fiction',
            description: 'A powerful story about racial injustice and moral growth in the American South.',
            img: 'https://placehold.co/400x600/png?text=To+Kill+a+Mockingbird',
            rating: 4.8
        },
        {
            id: 'sample3',
            title: 'A Brief History of Time',
            author: 'Stephen Hawking',
            type: 'science',
            description: 'An exploration of cosmology, physics, and the nature of the universe.',
            img: 'https://placehold.co/400x600/png?text=A+Brief+History+of+Time',
            rating: 4.6
        },
        {
            id: 'sample4',
            title: 'Harry Potter and the Philosopher\'s Stone',
            author: 'J.K. Rowling',
            type: 'fantacy',
            description: 'The journey of a young wizard attending a magical school.',
            img: 'https://placehold.co/400x600/png?text=Harry+Potter',
            rating: 4.7
        },
        {
            id: 'sample5',
            title: 'The Hobbit',
            author: 'J.R.R. Tolkien',
            type: 'fantacy',
            description: 'A fantasy adventure about a hobbit who embarks on a quest.',
            img: 'https://placehold.co/400x600/png?text=The+Hobbit',
            rating: 4.7
        },
        {
            id: 'sample6',
            title: 'Sapiens: A Brief History of Humankind',
            author: 'Yuval Noah Harari',
            type: 'non_fiction',
            description: 'A study of the history of humanity from ancient times to the present.',
            img: 'https://placehold.co/400x600/png?text=Sapiens',
            rating: 4.6
        }
    ];
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

        // Try to fetch from OpenLibrary by category
        try {
            const response = await axios.get(`https://openlibrary.org/subjects/${normalizedCategory}.json?limit=20`);
            if (response.data && response.data.works && response.data.works.length > 0) {
                return response.data.works.map(book => ({
                    id: book.key.split('/').pop(),
                    title: book.title,
                    author: book.authors?.map(a => a.name).join(', ') || 'Unknown Author',
                    cover_i: book.cover_id,
                    subject: book.subject || [category],
                    type: normalizedCategory,
                    key: book.key,
                    description: book.description || 'No description available',
                    img: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` : 'https://placehold.co/400x600/png?text=' + encodeURIComponent(book.title)
                }));
            }
        } catch (olError) {
            console.error(`Error fetching ${category} books from OpenLibrary:`, olError);
        }

        // If OpenLibrary fails, try PocketBase
        try {
            const records = await pb.collection('books').getList(1, 50, {
                filter: `type = "${normalizedCategory}"`,
                sort: '-created',
            });

            if (records.items.length > 0) {
                return records.items;
            }
        } catch (pbError) {
            console.error(`Error fetching ${category} books from PocketBase:`, pbError);
        }

        // Use sample books and filter by category
        const samples = getSampleBooks();
        const filteredSamples = samples.filter(book =>
            book.type.toLowerCase() === category.toLowerCase()
        );

        if (filteredSamples.length > 0) {
            return filteredSamples;
        }

        return []; // Return empty array if no matches
    } catch (error) {
        console.error(`Error fetching ${category} books:`, error);
        return [];
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

        // Try OpenLibrary search
        try {
            const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
            if (response.data && response.data.docs && response.data.docs.length > 0) {
                return response.data.docs.map(book => ({
                    id: book.key?.split('/').pop() || Math.random().toString(36).substr(2, 9),
                    title: book.title,
                    author: book.author_name?.join(', ') || 'Unknown Author',
                    cover_i: book.cover_i,
                    subject: book.subject,
                    type: book.subject?.[0]?.toLowerCase() || 'fiction',
                    key: book.key,
                    description: book.description || 'No description available',
                    img: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://placehold.co/400x600/png?text=' + encodeURIComponent(book.title)
                }));
            }
        } catch (olError) {
            console.error('Error searching books in OpenLibrary:', olError);
        }

        // If OpenLibrary fails, try PocketBase
        try {
            const pbResults = await pb.collection('books').getList(1, 20, {
                filter: `title ~ "${query}" || author ~ "${query}"`,
            });

            if (pbResults.items.length > 0) {
                return pbResults.items;
            }
        } catch (pbError) {
            console.error('Error searching books in PocketBase:', pbError);
        }

        // Search in sample books as last resort
        const samples = getSampleBooks();
        const query_lower = query.toLowerCase();
        const searchResults = samples.filter(book =>
            book.title.toLowerCase().includes(query_lower) ||
            book.author.toLowerCase().includes(query_lower)
        );

        return searchResults;
    } catch (error) {
        console.error('Error searching books:', error);
        return [];
    }
};

/**
 * Get a single book by ID from either Pocketbase or OpenLibrary
 * @param {string} id - Book ID
 * @returns {Promise<Object>} Book details
 */
export const getBookById = async (id) => {
    try {
        // Try to find in OpenLibrary
        try {
            const response = await axios.get(`https://openlibrary.org/works/${id}.json`);

            if (response.data) {
                // Get cover
                let coverUrl = null;
                if (response.data.covers && response.data.covers.length > 0) {
                    coverUrl = `https://covers.openlibrary.org/b/id/${response.data.covers[0]}-L.jpg`;
                } else {
                    coverUrl = `https://placehold.co/400x600/png?text=${encodeURIComponent(response.data.title)}`;
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
        } catch (olError) {
            console.error('Error fetching book from OpenLibrary:', olError);
        }

        // If not in OpenLibrary, try PocketBase
        try {
            const record = await pb.collection('books').getOne(id);
            return record;
        } catch (pbError) {
            console.error('Error fetching book from PocketBase:', pbError);
        }

        // Try to find in sample books
        const samples = getSampleBooks();
        const foundBook = samples.find(book => book.id === id);

        if (foundBook) {
            return foundBook;
        }

        throw new Error('Book not found');
    } catch (error) {
        console.error('Error fetching book details:', error);
        throw new Error('Failed to fetch book details');
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
        return 'https://placehold.co/400x600/png?text=No+Cover';
    }
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};

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