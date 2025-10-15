import { Link } from "react-router-dom";
export default function Devices() {
  return (
    <>
      <h1>Devices</h1>
      <ul>
        <li><Link to="/devices/add">Add Device</Link></li>
        <li><Link to="/devices/example-123/remove">Remove Device (example)</Link></li>
      </ul>
    </>
  );
}
