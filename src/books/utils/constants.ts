export const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json';

export const OPEN_LIBRARY_COVER_URL = 'https://covers.openlibrary.org/b/id';

// Only the fields the form uses, which keeps the response small.
export const OPEN_LIBRARY_FIELDS = 'key,title,author_name,number_of_pages_median,cover_i';

export const BOOK_SEARCH_LIMIT = 10;

export const BOOK_SEARCH_MIN_LENGTH = 3;

export const BOOK_SEARCH_DEBOUNCE_MS = 450;

export const COVER_PAIRS = [
  { coverColor: '#F26A2E', accentColor: '#FFEFE7' },
  { coverColor: '#2F80C9', accentColor: '#E6F1FB' },
  { coverColor: '#2E9D6A', accentColor: '#E5F5EC' },
  { coverColor: '#7B5CE0', accentColor: '#EFEAFC' },
  { coverColor: '#D9962B', accentColor: '#FBF2E2' },
];
