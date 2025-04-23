import { renderHook, act } from "@testing-library/react";
import { useUserSettings } from "@/hooks/use-settings";
import { auth } from "@/firebase/firebase";
import {
  updateEmail,
  updatePassword,
  updateProfile,
  reauthenticateWithCredential,
} from "firebase/auth";

jest.mock("@/firebase/firebase", () => ({
  auth: {
    currentUser: {
      displayName: "Test User",
      email: "test@example.com",
    },
    onAuthStateChanged: jest.fn((callback) => {
      callback({
        displayName: "Test User",
        email: "test@example.com",
      });
      return jest.fn();
    }),
  },
}));

jest.mock("firebase/auth", () => ({
  updateEmail: jest.fn(() => Promise.resolve()),
  updatePassword: jest.fn(() => Promise.resolve()),
  updateProfile: jest.fn(() => Promise.resolve()),
  EmailAuthProvider: {
    credential: jest.fn(() => ({})),
  },
  reauthenticateWithCredential: jest.fn(() => Promise.resolve()),
}));

describe("useUserSettings Hook", () => {
  it("should update username successfully", async () => {
    const { result } = renderHook(() => useUserSettings());

    act(() => {
      result.current[1].setNewUsername("New Username");
    });

    await act(async () => {
      await result.current[1].updateUsername();
    });

    expect(updateProfile).toHaveBeenCalledWith(auth.currentUser, {
      displayName: "New Username",
    });
    expect(result.current[0].success).toBe("Username updated successfully!");
  });

  it("should update email successfully after re-authentication", async () => {
    const { result } = renderHook(() => useUserSettings());

    act(() => {
      result.current[1].setNewEmail("new@example.com");
      result.current[1].setCurrentPassword("password123");
    });

    await act(async () => {
      await result.current[1].updateUserEmail();
    });

    expect(reauthenticateWithCredential).toHaveBeenCalled();
    expect(updateEmail).toHaveBeenCalledWith(
      auth.currentUser,
      "new@example.com"
    );
    expect(result.current[0].success).toBe("Email updated successfully!");
  });

  it("should update password successfully after re-authentication", async () => {
    const { result } = renderHook(() => useUserSettings());

    act(() => {
      result.current[1].setCurrentPassword("password123");
      result.current[1].setNewPassword("newpassword");
      result.current[1].setConfirmPassword("newpassword");
    });

    await act(async () => {
      await result.current[1].updateUserPassword();
    });

    expect(reauthenticateWithCredential).toHaveBeenCalled();
    expect(updatePassword).toHaveBeenCalledWith(
      auth.currentUser,
      "newpassword"
    );
    expect(result.current[0].success).toBe("Password updated successfully!");
  });
});
