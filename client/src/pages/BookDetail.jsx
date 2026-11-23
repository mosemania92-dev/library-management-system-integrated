import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useReadingList } from "../context/ReadingListContext.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function BookDetail() {
  const { id } = useParams();
  const { addBook, books } = useReadingList();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/books/${id}`, { signal: controller.signal })
      .then((res) => {
        if (res.status === 404) throw new Error("This book doesn't exist.");
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(
          err.message === "Failed to fetch"
            ? "Can't reach the server. Is the API running?"
            : err.message
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  const back = (
    <Link to="/" className="back-link">
      ← Back to catalog
    </Link>
  );

  if (loading) {
    return (
      <section>
        {back}
        <div className="detail skeleton" aria-busy="true">
          <div className="sk-line wide sk-block" />
          <div className="sk-line sk-block" />
          <div className="sk-line short sk-block" />
          <div className="sk-line sk-block" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        {back}
        <div className="state-box error" role="alert">
          <h2>Couldn't load this book</h2>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  const available = book.copiesAvailable > 0;

  return (
    <section>
      {back}
      <article className="detail">
        <h1>{book.title}</h1>
        <p className="card-author">by {book.author}</p>

        <div className="card-meta">
          {book.genre && <span className="badge">{book.genre.name}</span>}
          <span className={available ? "avail yes" : "avail no"}>
            {available
              ? `${book.copiesAvailable} of ${book.totalCopies} copies available`
              : "All copies are currently out"}
          </span>
        </div>

        <div className="detail-actions">
          <button
            className="btn secondary-btn"
            type="button"
            onClick={() => addBook({ id: book.id, title: book.title, author: book.author })}
            disabled={books.some((item) => item.id === book.id)}
          >
            {books.some((item) => item.id === book.id) ? "In reading list" : "Add to reading list"}
          </button>
          <Link className="btn" to={`/borrow/${book.id}`}>Request to borrow</Link>
        </div>

        <p className="description">
          {book.description || "No description has been added for this book."}
        </p>

        <dl className="facts">
          <div>
            <dt>ISBN</dt>
            <dd>{book.isbn || "—"}</dd>
          </div>
          <div>
            <dt>Published</dt>
            <dd>{book.publishedYear || "—"}</dd>
          </div>
          <div>
            <dt>Total copies</dt>
            <dd>{book.totalCopies}</dd>
          </div>
          <div>
            <dt>Added to catalog</dt>
            <dd>{new Date(book.createdAt).toLocaleDateString()}</dd>
          </div>
        </dl>
      </article>
    </section>
  );
}
