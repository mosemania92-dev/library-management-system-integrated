import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function change(e) {
    setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Registration failed.");
      // The supplied NestJS register endpoint returns a user, not a JWT.
      setMessage("Account created. Redirecting to login…");
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err) {
      setError(err.message === "Failed to fetch" ? "Cannot reach the API. Is the backend running?" : err.message);
    } finally {
      setBusy(false);
    }
  }

  return <section className="form-page"><form className="form-card" onSubmit={submit}>
    <h1>Create account</h1>
    <label className="field">Full name<input name="name" value={form.name} onChange={change} required autoComplete="name" /></label>
    <label className="field">Email<input name="email" type="email" value={form.email} onChange={change} required autoComplete="email" /></label>
    <label className="field">Password<input name="password" type="password" value={form.password} onChange={change} minLength={6} required autoComplete="new-password" /></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    {message && <p className="form-success" role="status">{message}</p>}
    <button className="btn" disabled={busy}>{busy ? "Creating account…" : "Register"}</button>
    <p>Already registered? <Link to="/login">Log in</Link></p>
  </form></section>;
}
