import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        setUserId(currentUser.uid);
        setUserEmail(currentUser.email);
      } else {
        setUserId(null);
        setUserEmail(null);
        navigate("/login");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.setItem("toastMessage", "Logged Out Successfully");
    navigate("/login");
  };

  return useMemo(
    () => ({
      user,
      userId,
      userEmail,
      loading,
      handleLogout,
    }),
    [user, userId, userEmail, loading]
  );
}
