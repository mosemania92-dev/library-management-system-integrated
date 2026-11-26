import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function todayLocal() {
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export default function SpaceBookingPage() {
  const [spaces, setSpaces] = useState([]);
  const [form, setForm] = useState({ spaceId: "", date: "", startTime: "", endTime: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/spaces`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load available spaces.");
        return res.json();
      })
      .then(setSpaces)
      .catch((err) => setError(err.message));
  }, []);

  function change(e) {
    setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (form.date < todayLocal()) return setError("Choose today or a future date.");
    if (form.startTime >= form.endTime) return setError("End time must be later than start time.");
    setBusy(true);
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ spaceId: Number(form.spaceId), ...form, spaceId: Number(form.spaceId) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || `Booking failed (${response.status}).`);
      setMessage("Your space booking has been confirmed.");
      setForm({ spaceId: "", date: "", startTime: "", endTime: "" });
    } catch (err) {
      setError(err.message === "Failed to fetch" ? "Cannot reach the API." : err.message);
    } finally {
      setBusy(false);
    }
  }

  return <section className="form-page"><form className="form-card" onSubmit={submit}>
    <h1>Book a study space</h1>
    <label className="field">Space
      <select name="spaceId" value={form.spaceId} onChange={change} required>
        <option value="">Choose a space</option>
        {spaces.map((space) => <option key={space.id} value={space.id}>{space.name} (capacity {space.capacity})</option>)}
      </select>
    </label>
    <label className="field">Date<input type="date" name="date" min={todayLocal()} value={form.date} onChange={change} required /></label>
    <div className="time-fields">
      <label className="field">Start time<input type="time" name="startTime" value={form.startTime} onChange={change} required /></label>
      <label className="field">End time<input type="time" name="endTime" value={form.endTime} onChange={change} required /></label>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    {message && <p className="form-success" role="status">{message}</p>}
    <button className="btn" disabled={busy || spaces.length === 0}>{busy ? "Submitting…" : "Confirm booking"}</button>
  </form></section>;
}
