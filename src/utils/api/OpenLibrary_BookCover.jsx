// Generiere die URL für ein Buchcover basierend auf der Cover-ID
export const getBookCover = (coverId, size = 'M') => {
    if (!coverId) {
        return 'https://via.placeholder.com/150'; // Fallback-Bild, falls keine Cover-ID vorhanden ist
    }
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};
