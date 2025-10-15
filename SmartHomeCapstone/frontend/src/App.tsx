import { Routes, Route, NavLink, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Devices from "./pages/Devices";
import DeviceAdd from "./pages/DeviceAdd";
import DeviceRemove from "./pages/DeviceRemove";
import NotFound from "./pages/NotFound";

function Layout() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <aside style={{ borderRight: "1px solid #eee", padding: "16px" }}>
        <h2 style={{ marginTop: 0 }}>SmartHome</h2>
        <nav style={{ display: "grid", gap: 8 }}>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/devices">Devices</NavLink>
          <NavLink to="/devices/add">Add Device</NavLink>
        </nav>
      </aside>
      <main style={{ padding: "16px" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/devices/add" element={<DeviceAdd />} />
        <Route path="/devices/:deviceId/remove" element={<DeviceRemove />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
