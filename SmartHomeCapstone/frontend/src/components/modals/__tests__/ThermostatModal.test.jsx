import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ThermostatModal from "../ThermostatModal";

test("ThermostatModal renders and Save/Delete work", () => {
  const onClose = jest.fn();
  const onSave = jest.fn();
  const onDelete = jest.fn();
  const device = { id: "2", name: "Hallway Thermostat", targetTemp: 72, mode: "auto", fan: "auto" };

  render(<ThermostatModal open={true} onClose={onClose} onSave={onSave} onDelete={onDelete} device={device} />);

  expect(screen.getByText(/Edit Thermostat/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /save/i }));
  expect(onSave).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledTimes(1);

  fireEvent.click(screen.getByRole("button", { name: /delete/i }));
  fireEvent.click(screen.getAllByRole("button", { name: /delete/i })[1]);
  expect(onDelete).toHaveBeenCalledTimes(1);
});
