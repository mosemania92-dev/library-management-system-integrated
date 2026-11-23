import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function BorrowRequestPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/books/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load this book.");
        return res.json();
      })
      .then(setBook)
      .catch((err) => setError(err.message));
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const response = await fetch(`${API_URL}/borrow-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ bookId: Number(id) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Borrow request failed.");
      setMessage(`Borrow request created. Due date: ${new Date(data.dueDate).toLocaleDateString()}`);
    } catch (err) {
      setError(err.message === "Failed to fetch" ? "Cannot reach the API." : err.message);
    } finally {
      setBusy(false);
    }
  }

  if (error && !book) return <div className="state-box error"><p>{error}</p><Link to="/">Back to catalog</Link></div>;
  if (!book) return <p>Loading book…</p>;

  return <section className="form-page"><form className="form-card" onSubmit={submit}>
    <h1>Request to borrow</h1>
    <p><strong>{book.title}</strong> by {book.author}</p>
    <p className="muted">The server sets the due date and checks current availability.</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    {message && <p className="form-success" role="status">{message}</p>}
    <button className="btn" disabled={busy || book.copiesAvailable < 1}>{busy ? "Submitting…" : "Submit borrow request"}</button>
    <Link to={`/books/${book.id}`}>Back to book</Link>
  </form></section>;
}
