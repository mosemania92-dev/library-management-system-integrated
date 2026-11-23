import { useEffect, useState } from "react";

// Debounced search: waits until the user stops typing before calling onSearch.
export default function SearchBar({ onSearch, delay = 400 }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value.trim());
    }, delay);

    // Cleanup: every new keystroke cancels the previous timer.
    return () => clearTimeout(timer);
  }, [value, delay, onSearch]);

  return (
    <label className="field grow">
      <span>Search</span>
      <input
        type="search"
        placeholder="Search by title or author…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
}
