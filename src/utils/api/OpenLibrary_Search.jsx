import axios from 'axios';

// Suche nach Büchern basierend auf einem Suchbegriff
export const searchBooks = async (query) => {
    if (!query.trim()) {
        throw new Error('Die Suchanfrage darf nicht leer sein.');
    }

    try {
        const response = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
        return response.data.docs; // Rückgabe der Buchdaten
    } catch (error) {
        console.error('Fehler beim Abrufen der Bücher:', error);
        throw new Error('Es gab ein Problem beim Abrufen der Bücher.');
    }
};
