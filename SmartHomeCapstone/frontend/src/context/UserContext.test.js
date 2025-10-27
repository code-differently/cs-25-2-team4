/* eslint-disable import/first */

/* 1) jest.mock FIRST — define fns inside factory */
jest.mock("../services/roomService", () => ({ setAuthToken: jest.fn() }));
jest.mock("../services/deviceService", () => ({ setAuthToken: jest.fn() }));
jest.mock("../services/userService", () => ({ setAuthToken: jest.fn() }));
jest.mock("../hooks/useHomes", () => ({ setAuthToken: jest.fn() }));

/* 2) NOW IMPORTS ARE SAFE */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UserProvider, useUser } from "./UserContext";

/* 3) IMPORT the mocked fns (AFTER mock) */
import { setAuthToken as mockSetRoomAuth } from "../services/roomService";
import { setAuthToken as mockSetDeviceAuth } from "../services/deviceService";
import { setAuthToken as mockSetUserAuth } from "../services/userService";
import { setAuthToken as mockSetHomeAuth } from "../hooks/useHomes";

/* Mock useAuth / useUserSync AFTER imports */
const mockGetToken = jest.fn();
jest.mock("@clerk/clerk-react", () => ({ useAuth: () => ({ getToken: mockGetToken }) }));

let mockUseUserSyncReturn;
jest.mock("../hooks/useUserSync", () => ({
  useUserSync: () => mockUseUserSyncReturn,
}));

/* Dummy consumer */
const DummyConsumer = () => {
  const { isAuthenticated, backendUser } = useUser();
  return <div data-testid="ctx">{isAuthenticated ? "AUTH" : "NOAUTH"}-{backendUser?.id || "none"}</div>;
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseUserSyncReturn = {
    user: { name: "Jane" },
    backendUser: { id: "u1" },
    isLoading: false,
    error: null,
    updateBackendUser: jest.fn(),
    isAuthenticated: true,
  };
});

describe("UserContext", () => {
  it("sets all auth tokens when authenticated", async () => {
    mockGetToken.mockResolvedValue("tok123");

    render(<UserProvider><DummyConsumer/></UserProvider>);
    await waitFor(() => expect(mockSetRoomAuth).toHaveBeenCalledWith("tok123"));

    expect(mockSetDeviceAuth).toHaveBeenCalledWith("tok123");
    expect(mockSetUserAuth).toHaveBeenCalledWith("tok123");
    expect(mockSetHomeAuth).toHaveBeenCalledWith("tok123");
    expect(screen.getByTestId("ctx")).toHaveTextContent("AUTH-u1");
  });

  it("clears tokens when not authenticated", async () => {
    mockUseUserSyncReturn.isAuthenticated = false;

    render(<UserProvider><DummyConsumer/></UserProvider>);
    await waitFor(() => expect(mockSetRoomAuth).toHaveBeenCalledWith(null));

    expect(mockSetDeviceAuth).toHaveBeenCalledWith(null);
    expect(mockSetUserAuth).toHaveBeenCalledWith(null);
    expect(mockSetHomeAuth).toHaveBeenCalledWith(null);
    expect(screen.getByTestId("ctx")).toHaveTextContent("NOAUTH");
  });

  it("handles getToken throwing an error", async () => {
    mockGetToken.mockRejectedValue(new Error("fail"));
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<UserProvider><DummyConsumer/></UserProvider>);
    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith("Error setting auth tokens:", expect.any(Error))
    );
    spy.mockRestore();
  });
});