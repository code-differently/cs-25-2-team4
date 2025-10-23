import { Header } from './components/header/Header';
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { UserProvider } from './context/UserContext';
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import CreateHome from "./pages/CreateHome/CreateHome.jsx";
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

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedOut>
        <Navigate to="/login" replace />
      </SignedOut>
      <SignedIn>
        <UserProvider>
          {children}
        </UserProvider>
      </SignedIn>
    </>
  );
}

export default function App(){
  return(
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Home />}/>
        <Route path="/createhome" element={<CreateHome />}/>
      </Route>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  );
}