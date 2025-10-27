import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email:"", password:"" });
  const [msg, setMsg] = useState("");
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigate = useNavigate();

  function onChange(e){ setForm({ ...form, [e.target.name]: e.target.value }); }
  
  async function onSubmit(e){
    e.preventDefault();
    if(!form.email || !form.password){ 
      setMsg("Please enter email and password."); 
      return; 
    }
    
    if(!isLoaded) return;
    
    setMsg("Signing in...");
    
    try {
      const result = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/");
      } else {
        setMsg("Additional verification needed.");
      }
    } catch (err) {
      setMsg(err.errors?.[0]?.message || "Login failed. Please try again.");
    }
  }

  async function signInWithOAuth(strategy) {
    if(!isLoaded) return;
    
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/"
      });
    } catch (err) {
      setMsg(`${strategy} sign-in failed. Please try again.`);
    }
  }

  return (
    <div className="auth-wrap">
      <form onSubmit={onSubmit} className="login-card">
        <h2 className="title">Sign in to My Smart Home</h2>
        <p style={{margin: '0 0 16px', opacity: 0.9, fontSize: 14}}>
          Welcome back! Please sign in to continue
        </p>
        
        <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
          <button 
            type="button" 
            onClick={() => signInWithOAuth("oauth_apple")}
            className="btn-oauth"
            style={{flex: 1}}
          >
            🍎 Apple
          </button>
          <button 
            type="button" 
            onClick={() => signInWithOAuth("oauth_google")}
            className="btn-oauth"
            style={{flex: 1}}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
              alt="Google logo" 
              style={{height: '18px', verticalAlign: 'middle', marginRight: '6px'}} 
            /> Google
          </button>
        </div>

        <div style={{textAlign: 'center', margin: '12px 0', opacity: 0.7, fontSize: 14}}>
          or
        </div>

        <label htmlFor="login-identifier">Email address or username</label>
        <input
          id="login-identifier"
          className="input" 
          name="email" 
          type="text" 
          value={form.email} 
          onChange={onChange} 
          placeholder="Enter email or username"
        />
        <label htmlFor="login-password">Password</label>
        <input 
          id="login-password"
          className="input mb16" 
          name="password" 
          type="password" 
          value={form.password} 
          onChange={onChange} 
          placeholder="Enter your password"
        />
        <button type="submit" className="btn-primary">Continue →</button>
        {msg && <div className="msg">{msg}</div>}
        <div style={{marginTop:12,fontSize:14,textAlign:'center'}}>
          Don't have an account? <Link to="/register" className="link">Sign up</Link>
        </div>
      </form>
    </div>
  );
}