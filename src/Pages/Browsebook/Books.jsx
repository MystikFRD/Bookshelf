import React, { useState } from 'react';
import Categories from '../../Components/Categories';
import Booksdata from '../../Components/Booksdata';
import Searchfield from '../../Components/Searchfield';
import { searchBooks } from '../../utils/api/OpenLibrary_Search'; // Importiere die API für die Buchsuche

const Books = () => {
  const [inputValue, setInputValue] = useState(''); // Suchanfrage
  const [books, setBooks] = useState([]); // Ergebnisse
  const [error, setError] = useState(''); // Fehlerstatus
  const [loading, setLoading] = useState(false); // Ladeanzeige

  // Funktion, um die Suchanfrage zu aktualisieren
  const handleSearchTxt = async (inputValue) => {
    setInputValue(inputValue);

    if (!inputValue.trim()) {
      setError('Bitte geben Sie einen Suchbegriff ein.');
      setBooks([]);
      return;
    }

    setLoading(true); // Ladeanzeige aktivieren
    setError(''); // Fehlerstatus zurücksetzen

    try {
      const results = await searchBooks(inputValue); // Suche nach Büchern
      setBooks(results); // Speichere die Ergebnisse
      if (results.length === 0) {
        setError('Keine Bücher gefunden.');
      }
    } catch (err) {
      setError('Fehler beim Abrufen der Bücher. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false); // Ladeanzeige deaktivieren
    }
  };

  return (
      <div className="p-2">
        <section>
          <Categories />
          <Searchfield handleText={handleSearchTxt} />
          {error && <p className="text-red-500">{error}</p>}
          {loading ? (
              <p className="text-blue-500">Lade Bücher...</p>
          ) : (
              <Booksdata title={'All Books'} books={books} />
          )}
        </section>
      </div>
  );
};

export default Books;
