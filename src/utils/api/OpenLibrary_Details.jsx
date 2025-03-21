import axios from 'axios';

// Hole die Details eines Buches basierend auf der OpenLibrary ID (OLID)
export const getBookDetails = async (olid) => {
    if (!olid) {
        throw new Error('Die Buch-ID (OLID) darf nicht leer sein.');
    }

    try {
        const response = await axios.get(`https://openlibrary.org/works/${olid}.json`);
        return response.data; // Rückgabe der Buchdetails
    } catch (error) {
        console.error('Fehler beim Abrufen der Buchdetails:', error);
        throw new Error('Es gab ein Problem beim Abrufen der Buchdetails.');
    }
};
