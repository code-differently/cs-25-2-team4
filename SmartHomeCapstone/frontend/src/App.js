import './App.css';
import { Header } from './components/header/Header';
import { Routes, Route, NavLink, Outlet, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Devices from "./pages/Devices";
import DeviceAdd from "./pages/DeviceAdd";
import DeviceRemove from "./pages/DeviceRemove";
import NotFound from "./pages/NotFound";
import "./Layout.css";

function Layout(){
  return(
    <div className="container">
        <Header />
      <main className="main"><Outlet /></main>
    </div>
  );
}

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Login/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        <Route path="/devices" element={<Devices/>}/>
        <Route path="/devices/add" element={<DeviceAdd/>}/>
        <Route path="/devices/:deviceId/remove" element={<DeviceRemove/>}/>
      </Route>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
    </BrowserRouter>
  );
}
