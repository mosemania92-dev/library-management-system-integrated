import { Link } from "react-router-dom";
import { useReadingList } from "../context/ReadingListContext.jsx";

export default function ReadingListPage() {
  const { books, removeBook, clearList } = useReadingList();
  return <section>
    <h1>My reading list</h1>
    {books.length === 0 ? <div className="state-box"><p>Your reading list is empty.</p><Link className="btn" to="/">Browse books</Link></div> : <>
      <button className="btn secondary-btn" onClick={clearList}>Clear list</button>
      <div className="reading-list">{books.map((book) => <article className="list-row" key={book.id}>
        <div><strong>{book.title}</strong><p className="muted">by {book.author}</p></div>
        <div className="list-actions"><Link to={`/books/${book.id}`}>View</Link><button className="text-button" onClick={() => removeBook(book.id)}>Remove</button></div>
      </article>)}</div>
    </>}
  </section>;
}
