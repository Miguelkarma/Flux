import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) navigate("/login");
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.setItem("toastMessage", "Logged Out Successfully");
    navigate("/login");
  };

  return useMemo(() => ({ user, handleLogout }), [user]);
}
