import { Link, useNavigate } from "react-router-dom";
import { useReadingList } from "../context/ReadingListContext.jsx";

export default function Navbar() {
  const { books } = useReadingList();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <header className="site-header">
      <Link to="/" className="brand">📚 Library Catalog</Link>
      <nav className="nav-links" aria-label="Main navigation">
        <Link to="/">Browse books</Link>
        <Link to="/reading-list">Reading list ({books.length})</Link>
        <Link to="/space-booking">Book a space</Link>
        {token ? <button className="nav-button" onClick={logout}>Log out</button> : <>
          <Link to="/login">Log in</Link><Link to="/register">Register</Link>
        </>}
      </nav>
    </header>
  );
}
