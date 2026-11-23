import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function change(e) {
    setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Login failed.");
      if (!data.access_token) throw new Error("Login response did not contain access_token.");
      localStorage.setItem("token", data.access_token);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setError(err.message === "Failed to fetch" ? "Cannot reach the API. Is the backend running?" : err.message);
    } finally {
      setBusy(false);
    }
  }

  return <section className="form-page"><form className="form-card" onSubmit={submit}>
    <h1>Log in</h1>
    <label className="field">Email<input name="email" type="email" value={form.email} onChange={change} required autoComplete="email" /></label>
    <label className="field">Password<input name="password" type="password" value={form.password} onChange={change} required autoComplete="current-password" /></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="btn" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
    <p>New here? <Link to="/register">Create an account</Link></p>
  </form></section>;
}
