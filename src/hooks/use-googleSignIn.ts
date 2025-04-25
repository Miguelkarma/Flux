// src/hooks/useGoogleSignIn.ts
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase/firebase";
import { toast } from "sonner";

export const useGoogleSignIn = () => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      toast.success(`Welcome ${user.displayName}`);
    } catch (error) {
      toast.error("Sign in failed!");
      console.error(error);
    }
  };

  return { signInWithGoogle };
};
