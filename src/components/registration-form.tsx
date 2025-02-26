import { useState } from "react";
import { auth } from "@/firebase/firebase"; // Ensure Firestore is imported
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function RegistrationForm() {
  const [username, setUsername] = useState(""); // New state for username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      console.log("User registered:", user);
      navigate("/login"); // Redirect after successful registration
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message); // Show error if registration fails
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
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
            required
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
            required
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
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          className="w-full bg-gradient-to-br from-cyan-200/20 to-gray-800 text-md"
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
        >
          Log in
        </a>
      </div>
    </form>
  );
}
