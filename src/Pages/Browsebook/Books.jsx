import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Categories from '../../Components/Categories';
import Booksdata from '../../Components/Booksdata';
import Searchfield from '../../Components/Searchfield';
import { searchBooks } from '../../utils/api/OpenLibrary_Search';

const Books = () => {
  const [inputValue, setInputValue] = useState(''); // Suchanfrage
  const [searchResults, setSearchResults] = useState([]); // API search results
  const [error, setError] = useState(''); // Fehlerstatus
  const [loading, setLoading] = useState(false); // Ladeanzeige

  // Get books from Redux store
  const localBooks = useSelector(state => state.book.books);

  // Use local books as default, use search results when available
  const displayBooks = inputValue.trim() ? searchResults : localBooks;

  // Funktion, um die Suchanfrage zu aktualisieren
  const handleSearchTxt = async (value) => {
    setInputValue(value);

    if (!value.trim()) {
      setError('');
      setSearchResults([]);
      return;
    }

    setLoading(true); // Ladeanzeige aktivieren
    setError(''); // Fehlerstatus zurücksetzen

    try {
      const results = await searchBooks(value); // Suche nach Büchern
      setSearchResults(results); // Speichere die Ergebnisse
      if (results.length === 0) {
        setError('Keine Bücher gefunden.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Fehler beim Abrufen der Bücher. Bitte versuchen Sie es später erneut.');
      setSearchResults([]);
    } finally {
      setLoading(false); // Ladeanzeige deaktivieren
    }
  };

  return (
      <div className="p-2">
        <section>
          <Categories />
          <Searchfield handleText={handleSearchTxt} />
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {loading ? (
              <p className="text-blue-500 text-center mt-4">Lade Bücher...</p>
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