import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Categories from '../../Components/Categories';
import Booksdata from '../../Components/Booksdata';
import Searchfield from '../../Components/Searchfield';
import SearchFilter from '../../Components/SearchFilter';
import { getAllBooks, searchBooks } from '../../utils/api/bookService';
import { setBooks } from '../../utils/bookSlice';

const Books = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    genre: '',
    rating: 0,
    sortBy: 'title',
    sortOrder: 'asc'
  });

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

  // Handle search functionality
  const handleSearchTxt = async (value) => {
    setInputValue(value);

    if (!value.trim()) {
      setError('');
      setSearchResults([]);
      setFilteredResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    setError('');

    try {
      const results = await searchBooks(value);
      setSearchResults(results);

      // Apply active filters to the new search results
      applyFilters(results, activeFilters);

      if (results.length === 0) {
        setError(`No books found matching "${value}"`);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Error searching books. Please try again later.');
      setSearchResults([]);
      setFilteredResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Apply filters to results
  const applyFilters = (resultsToFilter, filters) => {
    let filtered = [...resultsToFilter];

    // Apply genre filter if selected
    if (filters.genre) {
      filtered = filtered.filter(book => {
        const bookType = book.type?.toLowerCase() ||
            (book.subject && book.subject[0] ? book.subject[0].toLowerCase() : '');
        return bookType === filters.genre.toLowerCase();
      });
    }

    // Apply rating filter if set
    if (filters.rating > 0) {
      filtered = filtered.filter(book => {
        const rating = Number(book.rating) || 0;
        return rating >= filters.rating;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB;

      switch (filters.sortBy) {
        case 'title':
          valueA = a.title || '';
          valueB = b.title || '';
          break;
        case 'author':
          valueA = a.author || (a.author_name ? a.author_name[0] : '') || '';
          valueB = b.author || (b.author_name ? b.author_name[0] : '') || '';
          break;
        case 'rating':
          valueA = Number(a.rating) || 0;
          valueB = Number(b.rating) || 0;
          return filters.sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        default:
          valueA = a.title || '';
          valueB = b.title || '';
      }

      // String comparison for non-numeric fields
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return filters.sortOrder === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
      }

      return 0;
    });

    setFilteredResults(filtered);
  };

  // Handle filter changes
  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);

    // Apply filters to current search results or all books
    const resultsToFilter = inputValue.trim() ? searchResults : books;
    applyFilters(resultsToFilter, filters);
  };

  // Determine which books to display
  const displayBooks = inputValue.trim()
      ? (filteredResults.length > 0 ? filteredResults : searchResults)
      : (activeFilters.genre || activeFilters.rating > 0 || activeFilters.sortBy !== 'title' || activeFilters.sortOrder !== 'asc')
          ? filteredResults
          : books;

  return (
      <div className="p-4 max-w-7xl mx-auto">
        <section>
          <Categories />

          <div className="my-8">
            <Searchfield handleText={handleSearchTxt} />
          </div>

          {/* Search filter component */}
          <SearchFilter onApplyFilters={handleApplyFilters} />

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
                  title={
                    inputValue.trim()
                        ? `Search Results for "${inputValue}"${displayBooks.length !== searchResults.length ? ` (Filtered: ${displayBooks.length}/${searchResults.length})` : ''}`
                        : activeFilters.genre || activeFilters.rating > 0 || activeFilters.sortBy !== 'title' || activeFilters.sortOrder !== 'asc'
                            ? `Filtered Books (${displayBooks.length})`
                            : 'All Books'
                  }
                  books={displayBooks}
              />
          )}
        </section>
      </div>
  );
};

export default Books;