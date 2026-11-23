import { createContext, useContext, useEffect, useReducer } from "react";

const ReadingListContext = createContext(null);
const STORAGE_KEY = "readingList";

function getInitialBooks() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_BOOK":
      return state.books.some((book) => book.id === action.payload.id)
        ? state
        : { books: [...state.books, action.payload] };
    case "REMOVE_BOOK":
      return { books: state.books.filter((book) => book.id !== action.payload) };
    case "CLEAR_LIST":
      return { books: [] };
    default:
      return state;
  }
}

export function ReadingListProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { books: getInitialBooks() });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.books));
  }, [state.books]);

  const value = {
    books: state.books,
    addBook: (book) => dispatch({ type: "ADD_BOOK", payload: book }),
    removeBook: (id) => dispatch({ type: "REMOVE_BOOK", payload: id }),
    clearList: () => dispatch({ type: "CLEAR_LIST" }),
  };

  return <ReadingListContext.Provider value={value}>{children}</ReadingListContext.Provider>;
}

export function useReadingList() {
  const context = useContext(ReadingListContext);
  if (!context) throw new Error("useReadingList must be used inside ReadingListProvider");
  return context;
}
