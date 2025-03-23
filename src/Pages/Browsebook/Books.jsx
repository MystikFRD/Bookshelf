import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Categories from '../../Components/Categories';
import Booksdata from '../../Components/Booksdata';
import Searchfield from '../../Components/Searchfield';
import { getAllBooks, searchBooks } from '../../utils/api/bookService';
import { setBooks } from '../../utils/bookSlice';

const Books = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Get books from Redux store
  const books = useSelector(state => state.book.books);
  const isDark = useSelector(state => state.darkMode.isDark);
  const dispatch = useDispatch();

  // Fetch all books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      if (!books || books.length === 0) {
        setLoading(true);
        setError('');
        try {
          const fetchedBooks = await getAllBooks();
          dispatch(setBooks(fetchedBooks));
        } catch (err) {
          console.error('Error fetching books:', err);
          setError('Error loading books. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBooks();
  }, [dispatch, books]);

  // Display books based on search or all books
  const displayBooks = inputValue.trim() ? searchResults : books;

  // Handle search functionality
  const handleSearchTxt = async (value) => {
    setInputValue(value);

    if (!value.trim()) {
      setError('');
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    setError('');

    try {
      const results = await searchBooks(value);
      setSearchResults(results);
      if (results.length === 0) {
        setError(`No books found matching "${value}"`);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Error searching books. Please try again later.');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
      <div className="p-4 max-w-7xl mx-auto">
        <section>
          <Categories />

          <div className="my-8">
            <Searchfield handleText={handleSearchTxt} />
          </div>

          {error && (
              <div className={`p-4 rounded-md ${isDark ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-700'} mb-6`}>
                <p>{error}</p>
              </div>
          )}

          {loading || searching ? (
              <div className="text-center py-12">
                <div className={`inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid ${isDark ? 'border-blue-400' : 'border-blue-600'} border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}></div>
                <p className="text-lg mt-4">{searching ? 'Searching books...' : 'Loading books...'}</p>
              </div>
          ) : (
              <Booksdata
                  title={inputValue.trim() ? `Search Results for "${inputValue}"` : 'All Books'}
                  books={displayBooks}
              />
          )}
        </section>
      </div>
  );
};

export default Books;