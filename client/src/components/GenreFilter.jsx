import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function GenreFilter({ value, onChange }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/genres`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load genres");
        return res.json();
      })
      .then((data) => {
        setGenres(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(true);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <label className="field">
      <span>Genre</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading || error}
      >
        <option value="">
          {loading ? "Loading genres…" : error ? "Genres unavailable" : "All genres"}
        </option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
    </label>
  );
}
