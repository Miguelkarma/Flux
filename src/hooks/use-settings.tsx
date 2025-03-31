import { useState, useEffect, useCallback } from "react";
import {
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";

interface UserData {
  displayName: string;
  email: string;
}

interface UserSettingsState {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  newEmail: string;
  newUsername: string;
}

interface UserSettingsActions {
  setCurrentPassword: (password: string) => void;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setNewEmail: (email: string) => void;
  setNewUsername: (username: string) => void;
  updateUsername: () => Promise<void>;
  updateUserEmail: () => Promise<void>;
  updateUserPassword: () => Promise<void>;
  clearSuccess: () => void;
  clearError: () => void;
  refreshUserData: () => void;
}

export function useUserSettings(): [UserSettingsState, UserSettingsActions] {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const refreshUserData = useCallback(() => {
    const user = auth.currentUser;
    if (user) {
      setUserData({
        displayName: user.displayName || "",
        email: user.email || "",
      });
      setNewEmail(user.email || "");
      setNewUsername(user.displayName || "");
    } else {
      setUserData(null); // Explicitly set to null if no user
    }
  }, []);

  // Add this useEffect to handle initial load:
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        refreshUserData();
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, [refreshUserData]);

  const clearSuccess = () => setSuccess(null);
  const clearError = () => setError(null);

  const updateUsername = async () => {
    if (!auth.currentUser) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await updateProfile(auth.currentUser, {
        displayName: newUsername,
      });

      // Force a refresh to get the latest user data
      refreshUserData();

      setSuccess("Username updated successfully!");
    } catch (err) {
      setError("Failed to update username. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserEmail = async () => {
    if (!auth.currentUser || !currentPassword) {
      setError("Current password is required to update email");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email || "",
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update email in Firebase Authentication
      await updateEmail(auth.currentUser, newEmail);

      // Force a refresh to get the latest user data
      refreshUserData();

      setSuccess("Email updated successfully!");
      setCurrentPassword("");
    } catch (err) {
      setError(
        "Failed to update email. Please check your password and try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserPassword = async () => {
    if (!auth.currentUser || !currentPassword) {
      setError("Current password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email || "",
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password in Firebase Authentication
      await updatePassword(auth.currentUser, newPassword);

      setSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        "Failed to update password. Please check your current password and try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return [
    {
      userData,
      loading,
      error,
      success,
      currentPassword,
      newPassword,
      confirmPassword,
      newEmail,
      newUsername,
    },
    {
      setCurrentPassword,
      setNewPassword,
      setConfirmPassword,
      setNewEmail,
      setNewUsername,
      updateUsername,
      updateUserEmail,
      updateUserPassword,
      clearSuccess,
      clearError,
      refreshUserData,
    },
  ];
}
