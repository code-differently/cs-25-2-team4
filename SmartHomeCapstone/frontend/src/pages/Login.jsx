import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setMsg("Please enter email and password.");
      return;
    }
    setMsg("Submitting...");
    setTimeout(() => setMsg("Logged in (demo)."), 400);
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#111" }}>
      <form onSubmit={onSubmit} style={{ width: 360, background: "#13325B", color: "#fff", padding: 24, borderRadius: 16 }}>
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>Login</h2>
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} placeholder="user@email.com" style={{ width: "100%", padding: 10, borderRadius: 6, border: 0, margin: "6px 0 12px" }} />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Password" style={{ width: "100%", padding: 10, borderRadius: 6, border: 0, margin: "6px 0 16px" }} />
        <button type="submit" style={{ width: "100%", padding: 10, borderRadius: 6, border: 0, background: "#1e4fa1", color: "#fff" }}>Sign in</button>
        {msg && <div style={{ marginTop: 12, background: "#0b1f3b", padding: 8, borderRadius: 6 }}>{msg}</div>}
      </form>
    </div>
  );
}
