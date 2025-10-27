import React from "react";
import { Lightbulb, Thermometer, Camera as CameraIcon } from "lucide-react";

// Registry for device icons
const DEVICE_ICON_REGISTRY = {
  LIGHT: Lightbulb,
  THERMOSTAT: Thermometer,
  CAMERA: CameraIcon,
  SECURITYCAMERA: CameraIcon,
};

// Register new device icon types without modifying existing code
export const registerDeviceIcon = (type, Icon) => {
  DEVICE_ICON_REGISTRY[type.toUpperCase()] = Icon;
};

export const DeviceIcon = ({ type }) => {
  if (!type) return null;
  const Icon = DEVICE_ICON_REGISTRY[type.toUpperCase()];
  return Icon ? (
    <span role="img" aria-label={`${type} icon`}>
      <Icon size={18} />
    </span>
  ) : null;
};
