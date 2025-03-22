import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Categories from '../../Components/Categories';
import Booksdata from '../../Components/Booksdata';
import Searchfield from '../../Components/Searchfield';
import { getAllBooks, searchBooks } from '../../utils/api/bookService';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const fetchedBooks = await getAllBooks();
        setBooks(fetchedBooks);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Error loading books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Display books based on search or all books
  const displayBooks = inputValue.trim() ? searchResults : books;

  // Handle search functionality
  const handleSearchTxt = async (value) => {
    setInputValue(value);

    if (!value.trim()) {
      setError('');
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const results = await searchBooks(value);
      setSearchResults(results);
      if (results.length === 0) {
        setError('No books found matching your search.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Error searching books. Please try again later.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="p-2">
        <section>
          <Categories />
          <Searchfield handleText={handleSearchTxt} />
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {loading ? (
              <p className="text-blue-500 text-center mt-4">Loading books...</p>
          ) : (
              <Booksdata
                  title={inputValue.trim() ? 'Search Results' : 'All Books'}
                  books={displayBooks}
              />
          )}
        </section>
      </div>
  );
};

export default Books;