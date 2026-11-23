import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  const available = book.copiesAvailable > 0;

  return (
    <Link to={`/books/${book.id}`} className="card">
      <div className="card-cover" aria-hidden="true">
        {book.title.charAt(0).toUpperCase()}
      </div>
      <div className="card-body">
        <h3 className="card-title">{book.title}</h3>
        <p className="card-author">{book.author}</p>
        <div className="card-meta">
          {book.genre && <span className="badge">{book.genre.name}</span>}
          <span className={available ? "avail yes" : "avail no"}>
            {available ? `${book.copiesAvailable} available` : "All copies out"}
          </span>
        </div>
      </div>
    </Link>
  );
}
