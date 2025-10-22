import { Header } from './components/header/Header';
import { Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Devices from "./pages/Devices";
import DeviceAdd from "./pages/DeviceAdd";
import DeviceRemove from "./pages/DeviceRemove";
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

export default function App(){
  return(
      <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />}/>
            <Route path="/devices" element={<Devices/>}/>
            <Route path="/devices/add" element={<DeviceAdd/>}/>
            <Route path="/devices/:deviceId/remove" element={<DeviceRemove/>}/>
          </Route>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  );
}
