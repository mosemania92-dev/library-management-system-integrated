import { useEffect, useMemo, useState } from "react";
import BookCard from "./BookCard.jsx";
import BookSkeleton from "./BookSkeleton.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function BookGrid({ genreId, search, sort }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0); // bump to retry after an error

  useEffect(() => {
    const controller = new AbortController();

    const params = new URLSearchParams({ limit: "100" });
    if (genreId) params.set("genreId", genreId);
    if (search) params.set("search", search);

    setLoading(true);
    setError(null);

    fetch(`${API_URL}/books?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setBooks(json.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return; // a newer request replaced this one
        setError(
          err.message === "Failed to fetch"
            ? "Can't reach the server. Is the API running?"
            : err.message
        );
        setLoading(false);
      });

    // Cleanup: cancel the in-flight request if filters change or we unmount.
    return () => controller.abort();
  }, [genreId, search, attempt]);

  // Stretch: client-side sort (copy first, never mutate state).
  const sorted = useMemo(() => {
    if (!sort) return books;
    return [...books].sort((a, b) => a[sort].localeCompare(b[sort]));
  }, [books, sort]);

  if (loading) {
    return (
      <div className="grid" aria-busy="true" aria-label="Loading books">
        {Array.from({ length: 8 }, (_, i) => (
          <BookSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-box error" role="alert">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button className="btn" onClick={() => setAttempt((n) => n + 1)}>
          Try again
        </button>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="state-box">
        <h2>No books found</h2>
        <p>Try a different search or choose another genre.</p>
      </div>
    );
  }

  return (
    <>
      <p className="count">
        {sorted.length} {sorted.length === 1 ? "book" : "books"}
      </p>
      <div className="grid">
        {sorted.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </>
  );
}
