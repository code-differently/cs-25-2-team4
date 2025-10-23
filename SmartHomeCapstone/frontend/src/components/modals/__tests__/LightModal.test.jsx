import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LightModal from "../LightModal";

test("LightModal renders and Save/Delete work", () => {
  const onClose = jest.fn();
  const onSave = jest.fn();
  const onDelete = jest.fn();
  const device = { id: "1", name: "Desk Lamp", power: true, brightness: 50, colorTemp: 3000 };

  render(<LightModal open={true} onClose={onClose} onSave={onSave} onDelete={onDelete} device={device} />);

  // Renders header
  expect(screen.getByText(/Edit Light/i)).toBeInTheDocument();

  // Save calls onSave (and then onClose)
  fireEvent.click(screen.getByRole("button", { name: /save/i }));
  expect(onSave).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledTimes(1);

  // Open Delete confirm
  fireEvent.click(screen.getByRole("button", { name: /delete/i }));
  // Confirm delete
  fireEvent.click(screen.getAllByRole("button", { name: /delete/i })[1]);
  expect(onDelete).toHaveBeenCalledTimes(1);
});
