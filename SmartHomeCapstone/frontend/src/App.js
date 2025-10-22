import { Header } from './components/header/Header';
import { Routes, Route, Outlet } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import NotFound from "./pages/NotFound";
import "./Layout.css";
import Home from "./pages/Home/Home.jsx";

function Layout(){
  return(
    <div className="container">
      <Header />
      <main className="main"><Outlet /></main>
    </div>
  );
}

function AuthCheck() {
  return (
    <>
      <SignedOut>
        <div className="auth-wrap">
          <div className="login-card">
            <h2 className="title">Welcome to SmartHome</h2>
            <p>Please sign in to continue</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <SignInButton>
                <button className="btn-primary">Sign In</button>
              </SignInButton>
              <SignUpButton>
                <button className="btn-secondary">Sign Up</button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <Layout />
      </SignedIn>
    </>
  );
}

export default function App(){
  return(
      <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route element={<AuthCheck />}>
            <Route path="/" element={<Home />}/>
          </Route>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  );
}
