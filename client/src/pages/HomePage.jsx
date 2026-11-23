import { useState } from "react";
import BookGrid from "../components/BookGrid.jsx";
import SearchBar from "../components/SearchBar.jsx";
import GenreFilter from "../components/GenreFilter.jsx";

// HomePage owns the shared filter state; the children just display / change it.
export default function HomePage() {
  const [search, setSearch] = useState("");
  const [genreId, setGenreId] = useState("");
  const [sort, setSort] = useState("");

  return (
    <section>
      <h1>Browse books</h1>

      <div className="toolbar">
        <SearchBar onSearch={setSearch} />
        <GenreFilter value={genreId} onChange={setGenreId} />

        {/* Stretch: sort control */}
        <label className="field">
          <span>Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Default</option>
            <option value="title">Title (A–Z)</option>
            <option value="author">Author (A–Z)</option>
          </select>
        </label>
      </div>

      <BookGrid genreId={genreId} search={search} sort={sort} />
    </section>
  );
}
