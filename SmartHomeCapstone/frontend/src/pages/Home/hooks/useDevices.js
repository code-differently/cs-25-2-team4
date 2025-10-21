import { useState } from "react";

export function useDevices() {
  const [devices, setDevices] = useState([]);

  // status maps live inside the hook
  const statusByType = {
    Light: "On",
    Thermostat: "Set to 72°F",
    Camera: "Online",
  };

  const offStatusByType = {
    Light: "Off",
    Thermostat: "Idle",
    Camera: "Offline",
  };

  const addDevice = (newDevice) => {
    setDevices((prev) => [...prev, newDevice]);
  };

  const toggleDevice = (deviceName) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.name !== deviceName) return d;
        const nextOn = !d.isOn;
        return {
          ...d,
          isOn: nextOn,
          status: nextOn ? statusByType[d.type] : offStatusByType[d.type],
        };
      }),
    );
  };

  const deleteDevice = (nameToRemove) => {
    setDevices((prev) => prev.filter((d) => d.name !== nameToRemove));
  };

  return {
    devices,
    addDevice,
    toggleDevice,
    deleteDevice,
  };
}
