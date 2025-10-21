import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email:"", password:"" });
  const [msg, setMsg] = useState("");

  function onChange(e){ setForm({ ...form, [e.target.name]: e.target.value }); }
  function onSubmit(e){
    e.preventDefault();
    if(!form.email || !form.password){ setMsg("Please enter email and password."); return; }
    setMsg("Submitting...");
    setTimeout(() => setMsg("Logged in (demo)."), 400);
  }

  return (
    <div className="auth-wrap">
      <form onSubmit={onSubmit} className="login-card">
        <h2 className="title">Login</h2>
        <label>Email</label>
        <input className="input" name="email" type="email" value={form.email} onChange={onChange} placeholder="user@email.com"/>
        <label>Password</label>
        <input className="input mb16" name="password" type="password" value={form.password} onChange={onChange} placeholder="Password"/>
        <button type="submit" className="btn-primary">Sign in</button>
        {msg && <div className="msg">{msg}</div>}
        <div style={{marginTop:12,fontSize:14}}>
          Don’t have an account? <Link to="/register" className="link">Register</Link>
        </div>
      </form>
    </div>
  );
}
