import { Routes, Route, NavLink, Outlet, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Devices from "./pages/Devices.jsx";
import DeviceAdd from "./pages/DeviceAdd.jsx";
import DeviceRemove from "./pages/DeviceRemove.jsx";
import NotFound from "./pages/NotFound.jsx";
import Home from "./pages/Home/Home.jsx";
import "./Layout.css";

function Layout(){
  return (
    <div className="container">
      <aside className="sidebar">
        <h2 className="brand">SmartHome</h2>
        <nav className="nav">
          <NavLink to="/devices">Devices</NavLink>
          <NavLink to="/devices/add">Add Device</NavLink>
        </nav>
      </aside>
      <main className="main"><Outlet /></main>
    </div>
  );
}

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route element={<Layout />}>
        <Route path="/home" element={<Home/>}/>
        <Route path="/devices" element={<Devices/>}/>
        <Route path="/devices/add" element={<DeviceAdd/>}/>
        <Route path="/devices/:deviceId/remove" element={<DeviceRemove/>}/>
      </Route>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  );
}
