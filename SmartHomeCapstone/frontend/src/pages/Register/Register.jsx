import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import "./Register.css";


export default function Register() {
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState({ 
    firstName:"", 
    lastName:"", 
    username:"", 
    email:"", 
    password:"", 
    dob:"" 
  });
  const { signUp, setActive, isLoaded } = useSignUp();
  const navigate = useNavigate();

  function onChangeUser(e){ 
    setUser({ ...user, [e.target.name]: e.target.value }); 
  }

  async function signUpWithOAuth(strategy) {
    if(!isLoaded) return;
    
    try {
      sessionStorage.setItem('freshRegistration', 'true');
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/"
      });
    } catch (err) {
      setMsg(`${strategy} sign-up failed. Please try again.`);
    }
  }

  async function submit(e){
    e.preventDefault();

    if(!user.firstName || !user.lastName || !user.username || !user.email || !user.password){ 
      setMsg("Please fill all required fields."); 
      return; 
    }

    // Username cannot contain spaces
    if (/\s/.test(user.username)) {
      setMsg("Username cannot contain spaces.");
      return;
    }

    if (user.password.length < 6) {
      setMsg("Password must be at least 6 characters long.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      setMsg("Invalid email format");
      return;
    }

    // Add future date validation
    const today = new Date();
    const dob = new Date(user.dob);
    if (dob > today) {
      setMsg("Date of birth cannot be in the future.");
      return;
    }
    // Add this block for 1900 check
    if (dob.getFullYear() < 1900) {
      setMsg("Date of birth must be after 1900.");
      return;
    }

    if(!isLoaded) return;
    
    setMsg("Creating account...");

    try {
      const result = await signUp.create({
        emailAddress: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        unsafeMetadata: {
          dob: user.dob
        }
      });

      if (result.status === "missing_requirements") {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setMsg("Please check your email for a verification code.");
      }

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        sessionStorage.setItem('freshRegistration', 'true');
        setMsg("Account created successfully!");
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      setMsg(err.errors?.[0]?.message || "Registration failed. Please try again.");
    }
  }

  return (
    <div className="auth-wrap">
      <form onSubmit={submit} className="register-card">
        <h2 className="title">Create your account</h2>
        <p style={{margin: '0 0 16px', opacity: 0.9, fontSize: 14}}>
          Welcome! Please fill in the details to get started.
        </p>
        
        <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
          <button 
            type="button" 
            onClick={() => signUpWithOAuth("oauth_apple")}
            className="btn-oauth"
            style={{flex: 1}}
          >
            🍎 Apple
          </button>
          <button 
            type="button" 
            onClick={() => signUpWithOAuth("oauth_google")}
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

        <div style={{display: 'flex', gap: '8px'}}>
          <div style={{flex: 1}}>
            <label>First name</label>
            <input 
              className="input" 
              name="firstName" 
              value={user.firstName} 
              onChange={onChangeUser}
              required
            />
          </div>
          <div style={{flex: 1}}>
            <label>Last name</label>
            <input 
              className="input" 
              name="lastName" 
              value={user.lastName} 
              onChange={onChangeUser}
              required
            />
          </div>
        </div>
        
        <label>Username</label>
        <input 
          className="input" 
          name="username" 
          value={user.username} 
          onChange={onChangeUser}
          required
        />
        
        <label>Email address</label>
        <input 
          className="input" 
          name="email" 
          type="email" 
          value={user.email} 
          onChange={onChangeUser}
          required
        />
        
        <label htmlFor="password">Password</label>
        <input
          className="input"
          id="password"
          name="password"
          required
          type="password"
          value={user.password}
          onChange={onChangeUser}
        />
        
        <label htmlFor="dob">Date of Birth (Optional)</label>
        <input
          className="input mb16"
          id="dob"
          name="dob"
          type="date"
          value={user.dob}
          onChange={onChangeUser}
        />
        
        <button type="submit" className="btn-primary btn-full">Continue →</button>

        {msg && <div className="msg">{msg}</div>}
        
        <div style={{marginTop:12,fontSize:14,textAlign:'center'}}>
          Already have an account? <Link to="/login" className="link">Sign in</Link>
        </div>
      </form>
    </div>
  );
}