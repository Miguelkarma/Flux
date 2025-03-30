import { useState } from "react";
import { auth } from "@/firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { Key, Mail, User } from "lucide-react";

export default function RegistrationForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let isValid = true;

    if (!username.trim()) {
      toast.error("Username is required.");
      isValid = false;
    }

    if (!email.trim()) {
      toast.error("Email is required.");
      isValid = false;
    }

    if (!password.trim()) {
      toast.error("Password is required.");
      isValid = false;
    }

    if (!isValid) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      navigate("/login");
      sessionStorage.setItem("toastMessage", "Registered Successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message); // Show error if registration fails
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        duration={3000}
        richColors={true}
        theme="system"
        closeButton={true}
        expand={true}
        visibleToasts={3}
      />
      <form onSubmit={handleRegister} className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-sm text-muted-foreground">
            Sign up with your email and password
          </p>
        </div>
        <div className="grid gap-4">
          {/* Username Field */}
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="username-input"
              icon={User}
            />
          </div>
          {/* Email Field */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="email-input"
              icon={Mail}
            />
          </div>
          {/* Password Field */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password-input"
              icon={Key}
            />
          </div>
          {error && (
            <span className="text-red-500 text-sm" data-testid="error-message">
              {error}
            </span>
          )}
          <Button
            type="submit"
            className="relative w-auto px-6 py-2 text-white bg-black border-white/50 rounded-2xl transition-all hover:bg-black 
          before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-2px] before:w-[85%] before:h-[3px] before:bg-gradient-to-r before:from-transparent before:via-teal-500 before:to-transparent 
          hover:border-teal-400 before:rounded-xl hover:border-teal-300 hover:border"
            data-testid="submit-button"
          >
            Sign Up
          </Button>
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <a
            href="#"
            className="text-cyan-300"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            data-testid="login-link"
          >
            Log in
          </a>
        </div>
      </form>
    </>
  );
}
