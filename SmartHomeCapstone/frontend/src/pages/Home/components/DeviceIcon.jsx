import React from "react";
import { Lightbulb, Thermometer, Camera as CameraIcon } from "lucide-react";

export const DeviceIcon = ({ type }) => {
  switch (type) {
    case "LIGHT":
    case "Light":
      return (
        <span role="img" aria-label="Light icon">
          <Lightbulb size={18} />
        </span>
      );
    case "THERMOSTAT":
    case "Thermostat":
      return (
        <span role="img" aria-label="Thermostat icon">
          <Thermometer size={18} />
        </span>
      );
    case "CAMERA":
    case "Camera":
    case "SECURITYCAMERA":
    case "SecurityCamera":
      return (
        <span role="img" aria-label="Camera icon">
          <CameraIcon size={18} />
        </span>
      );
    default:
      return null;
  }
};
