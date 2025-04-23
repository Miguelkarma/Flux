import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export function useAuth(requireAuth = false) {
  const navigate = useNavigate();
  const location = useLocation();
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
        
    
        if (requireAuth) {
          navigate("/login", { state: { from: location.pathname } });
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, location, requireAuth]);

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
      isAuthenticated: !!user,
    }),
    [user, userId, userEmail, loading]
  );
}