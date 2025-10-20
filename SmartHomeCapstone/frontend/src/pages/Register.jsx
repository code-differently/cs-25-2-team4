import { useState } from "react";

export default function Register() {
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState({
    firstName: "", lastName: "", username: "", email: "", password: "", dob: ""
  });
  const [house, setHouse] = useState({
    name: "", address: "", type: ""
  });

  function onChangeUser(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }
  function onChangeHouse(e) {
    setHouse({ ...house, [e.target.name]: e.target.value });
  }

  function next() {
    if (!user.firstName || !user.lastName || !user.username || !user.email || !user.password) {
      setMsg("Please fill all user fields.");
      return;
    }
    setMsg("");
    setStep(2);
  }

  function back() {
    setMsg("");
    setStep(1);
  }

  function submit(e) {
    e.preventDefault();
    if (!house.name || !house.address || !house.type) {
      setMsg("Please fill all house fields.");
      return;
    }
    setMsg("Creating account (demo)...");
    const payload = { user, house };
    setTimeout(() => {
      console.log(payload);
      setMsg("Account created (demo).");
    }, 500);
  }

  const card = { width: 420, background: "#13325B", color: "#fff", padding: 24, borderRadius: 16 };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#111" }}>
      <form onSubmit={submit} style={card}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Register</h2>
        <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 12 }}>Step {step} of 2</div>

        {step === 1 && (
          <>
            <label>First Name</label>
            <input name="firstName" value={user.firstName} onChange={onChangeUser} style={{ width: "100%", padding: 10, borderRadius: 6, border: 0, margin: "6px 0 12px" }} />
            <label>Last Name</label>
            <input name="lastName" value={user.lastName} onChange={onChangeUser} style={{ width: "100%", padding: 10, borderRadius: 6, border: 0, margin: "6px 0 12px" }} />
            <label>Username</label>
            <input name="username" value={user.username} onChange={onChangeUser} style={{ width: "100%", padding: 10, borderRadius: 6, border: 0, margin: "6px 0 12px" }} />
            <label>Email</label>
            <input name="email" type="email" value={user.email} onChange={onChangeUser} style={{ width: "100%", padding: 10, borderRadius: 6, border: 0, margin: "6px 0 12px" }} />
            <label>Password</label>
            <input name="password" type="password" value={user.password} onChange={onChangeUser} style={{ width: "100%", padding: 10, borderRadius: 6, border: 0, margin: "6px 0 12px" }} />
            <label>Date of Birth</label>
            <input name="dob" type="date" value={user.dob} onChange={onChangeUser} style={{ width: "100%", padding: 10, borderRadius: 6, border: 0, margin: "6px 0 16px" }} />
            <button type="button" onClick={next} style={{ width: "100%", padding: 10, borderRadius: 6, border: 0, background: "#1e4fa1", color: "#fff" }}>Next</button>
          </>
        )}

        {step === 2 && (
          <>
            <label>House Name</label>
            <input name="name" value={house.name} onChange={onChangeHouse} style={{ width: "100%", padding: 10, borderRadius: 6, border: 0, margin: "6px 0 12px" }} />
            <label>Address</label>
            <input name="address" value={house.address} onChange={onChangeHouse} style={{ width: "100%", padding: 10, borderRadius: 6, border: 0, margin: "6px 0 12px" }} />
            <label>Type</label>
            <select name="type" value={house.type} onChange={onChangeHouse} style={{ width: "100%", padding: 10, borderRadius: 6, border: 0, margin: "6px 0 16px" }}>
              <option value="">Select...</option>
              <option>Single Family</option>
              <option>Apartment</option>
              <option>Townhouse</option>
              <option>Condo</option>
            </select>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={back} style={{ flex: 1, padding: 10, borderRadius: 6, border: 0, background: "#0b1f3b", color: "#fff" }}>Back</button>
              <button type="submit" style={{ flex: 1, padding: 10, borderRadius: 6, border: 0, background: "#1e4fa1", color: "#fff" }}>Create Account</button>
            </div>
          </>
        )}

        {msg && <div style={{ marginTop: 12, background: "#0b1f3b", padding: 8, borderRadius: 6 }}>{msg}</div>}
      </form>
    </div>
  );
}
