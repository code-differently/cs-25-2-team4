import { useState } from "react";
import "./Register.css";

export default function Register() {
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState({ firstName:"", lastName:"", username:"", email:"", password:"", dob:"" });
  const [house, setHouse] = useState({ name:"", address:"", type:"" });

  function onChangeUser(e){ setUser({ ...user, [e.target.name]: e.target.value }); }
  function onChangeHouse(e){ setHouse({ ...house, [e.target.name]: e.target.value }); }

  function next(){
    if(!user.firstName || !user.lastName || !user.username || !user.email || !user.password){ setMsg("Please fill all user fields."); return; }
    setMsg(""); setStep(2);
  }
  function back(){ setMsg(""); setStep(1); }

  function submit(e){
    e.preventDefault();
    if(!house.name || !house.address || !house.type){ setMsg("Please fill all house fields."); return; }
    setMsg("Account created (demo).");
  }

  return (
    <div className="auth-wrap">
      <form onSubmit={submit} className="register-card">
        <h2 className="title">Register</h2>
        <div className="step">Step {step} of 2</div>

        {step === 1 && (
          <>
            <label>First Name</label>
            <input className="input" name="firstName" value={user.firstName} onChange={onChangeUser}/>
            <label>Last Name</label>
            <input className="input" name="lastName" value={user.lastName} onChange={onChangeUser}/>
            <label>Username</label>
            <input className="input" name="username" value={user.username} onChange={onChangeUser}/>
            <label>Email</label>
            <input className="input" name="email" type="email" value={user.email} onChange={onChangeUser}/>
            <label>Password</label>
            <input className="input" name="password" type="password" value={user.password} onChange={onChangeUser}/>
            <label>Date of Birth</label>
            <input className="input mb16" name="dob" type="date" value={user.dob} onChange={onChangeUser}/>
            <button type="button" onClick={next} className="btn-primary btn-full">Next</button>
          </>
        )}

        {step === 2 && (
          <>
            <label>House Name</label>
            <input className="input" name="name" value={house.name} onChange={onChangeHouse}/>
            <label>Address</label>
            <input className="input" name="address" value={house.address} onChange={onChangeHouse}/>
            <label>Type</label>
            <select className="select mb16" name="type" value={house.type} onChange={onChangeHouse}>
              <option value="">Select...</option>
              <option>Single Family</option>
              <option>Apartment</option>
              <option>Townhouse</option>
              <option>Condo</option>
            </select>
            <div className="row">
              <button type="button" onClick={back} className="btn-secondary grow">Back</button>
              <button type="submit" className="btn-primary grow">Create Account</button>
            </div>
          </>
        )}

        {msg && <div className="msg">{msg}</div>}
      </form>
    </div>
  );
}
