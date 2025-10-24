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
        
        <label>Password</label>
        <input 
          className="input" 
          name="password" 
          type="password" 
          value={user.password} 
          onChange={onChangeUser}
          required
        />
        
        <label>Date of Birth <span style={{opacity: 0.6, fontSize: 12}}>(Optional)</span></label>
        <input 
          className="input mb16" 
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