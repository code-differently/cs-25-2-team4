import { useParams } from "react-router-dom";
export default function DeviceRemove(){const {deviceId}=useParams();return(<><h1>Remove Device</h1><p>Target device: <code>{deviceId}</code></p></>)}
