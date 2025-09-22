package com.smarthome.app;

import com.smarthome.devices.Device;
import com.smarthome.devices.Light;
import com.smarthome.devices.SecurityCamera;
import com.smarthome.devices.SwitchableDevice;
import com.smarthome.devices.Thermostat;
import com.smarthome.exceptions.InvalidCommandException;
import java.util.HashMap;
import java.util.Map;
import java.util.function.BiConsumer;

/**
 * Executes commands on devices using a functional approach. Replaces reflection-based command
 * execution with type-safe lambda functions.
 */
public class CommandExecutor {

  private static final Map<String, BiConsumer<Device, Object[]>> COMMANDS = new HashMap<>();

  static {
    // Register all supported commands
    registerSwitchableDeviceCommands();
    registerLightCommands();
    registerThermostatCommands();
    registerSecurityCameraCommands();
  }

  private static void registerSwitchableDeviceCommands() {
    COMMANDS.put(
        "turnOn",
        (device, args) -> {
          if (device instanceof SwitchableDevice) {
            ((SwitchableDevice) device).turnOn();
          } else {
            throw new RuntimeException(
                "Device does not support turnOn: " + device.getClass().getSimpleName());
          }
        });

    COMMANDS.put(
        "turnOff",
        (device, args) -> {
          if (device instanceof SwitchableDevice) {
            ((SwitchableDevice) device).turnOff();
          } else {
            throw new RuntimeException(
                "Device does not support turnOff: " + device.getClass().getSimpleName());
          }
        });
  }

  private static void registerLightCommands() {
    COMMANDS.put(
        "setBrightness",
        (device, args) -> {
          if (!(device instanceof Light)) {
            throw new RuntimeException(
                "Device is not a Light: " + device.getClass().getSimpleName());
          }
          if (args.length == 0) {
            throw new RuntimeException("setBrightness requires brightness value");
          }


          int brightness;
          if (args[0] instanceof String) {
            brightness = Integer.parseInt((String) args[0]);
          } else if (args[0] instanceof Integer) {
            brightness = (Integer) args[0];
          } else {
            throw new RuntimeException("setBrightness requires integer brightness value");
          }

          ((Light) device).setBrightness(brightness);
        });
  }

  private static void registerThermostatCommands() {
    COMMANDS.put(
        "setTemp",
        (device, args) -> {
          if (!(device instanceof Thermostat)) {
            throw new RuntimeException(
                "Device is not a Thermostat: " + device.getClass().getSimpleName());
          }
          if (args.length == 0) {
            throw new RuntimeException("setTemp requires temperature value");
          }


          double temperature;
          if (args[0] instanceof String) {
            temperature = Double.parseDouble((String) args[0]);
          } else if (args[0] instanceof Number) {
            temperature = ((Number) args[0]).doubleValue();
          } else {
            throw new RuntimeException("setTemp requires numeric temperature value");
          }

          ((Thermostat) device).setTemp(temperature);
        });

    COMMANDS.put(
        "getTemp",
        (device, args) -> {
          if (!(device instanceof Thermostat)) {
            throw new RuntimeException(
                "Device is not a Thermostat: " + device.getClass().getSimpleName());
          }
          // For read operations, we just call the method
          // The return value would need to be handled by the caller
          ((Thermostat) device).getTemp();
        });
  }

  private static void registerSecurityCameraCommands() {
    COMMANDS.put(
        "startRecording",
        (device, args) -> {
          if (!(device instanceof SecurityCamera)) {
            throw new RuntimeException(
                "Device is not a SecurityCamera: " + device.getClass().getSimpleName());
          }
          ((SecurityCamera) device).startRecording();
        });

    COMMANDS.put(
        "stopRecording",
        (device, args) -> {
          if (!(device instanceof SecurityCamera)) {
            throw new RuntimeException(
                "Device is not a SecurityCamera: " + device.getClass().getSimpleName());
          }
          ((SecurityCamera) device).stopRecording();
        });

    COMMANDS.put(
        "isRecording",
        (device, args) -> {
          if (!(device instanceof SecurityCamera)) {
            throw new RuntimeException(
                "Device is not a SecurityCamera: " + device.getClass().getSimpleName());
          }
          // For read operations, the return value would need to be handled by the caller
          ((SecurityCamera) device).isRecording();
        });
  }

  /**
   * Executes a command on a device.
   *
   * @param device The device to execute the command on
   * @param command The command name (e.g., "turnOn", "setBrightness")
   * @param args Arguments for the command
   * @throws InvalidCommandException if the command is unknown or execution fails
   */
  public void execute(Device device, String command, Object... args)
      throws InvalidCommandException {
    if (device == null) {
      throw new InvalidCommandException("Device", new Throwable("Device cannot be null"));
    }

    BiConsumer<Device, Object[]> cmd = COMMANDS.get(command);
    if (cmd == null) {
      throw new InvalidCommandException(
          device.getClass().getSimpleName(), new Throwable("Unknown command: " + command));
    }

    try {
      cmd.accept(device, args);
    } catch (Exception e) {
      throw new InvalidCommandException(device.getClass().getSimpleName(), e);
    }
  }

  /** Checks if a command is supported. */
  public boolean isCommandSupported(String command) {
    return COMMANDS.containsKey(command);
  }

  /** Gets all supported command names. */
  public java.util.Set<String> getSupportedCommands() {
    return COMMANDS.keySet();
  }
}
