"use client";

import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import SmallLoader from "@/Animation/SmallLoader";
import { useGoogleSignIn } from "@/hooks/use-googleSignIn";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  className?: string;
}

export function LoginForm({ onLogin, className, ...props }: LoginFormProps) {
  const { signInWithGoogle } = useGoogleSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto px-4 sm:px-6 md:px-8">
      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <SmallLoader />
        </div>
      )}

      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="text-xs uppercase tracking-wider text-cyan-400">
          START FOR FREE
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl text-gray-50 font-bold mt-2">
          Login to your account<span className="text-cyan-400">.</span>
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className={cn("flex flex-col gap-3 sm:gap-4 md:gap-6", className)}
        {...props}
      >
        <div className="grid gap-3 sm:gap-4 md:gap-5">
          <div className="grid gap-1 sm:gap-2">
            <Label htmlFor="email" className="text-sm text-gray-300">
              Email
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Mail size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-gray-800/50 border-gray-700 text-white pl-10 focus:ring-cyan-400/20 focus:border-cyan-400 h-9 sm:h-10 md:h-12 w-full text-sm sm:text-base rounded-md"
                required
              />
            </div>
          </div>

          <div className="grid gap-1 sm:gap-2">
            <Label htmlFor="password" className="text-sm text-gray-300">
              Password
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <KeyRound size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-gray-800/50 border-gray-700 text-white pl-10 focus:ring-cyan-400/20 focus:border-cyan-400 h-9 sm:h-10 md:h-12 w-full text-sm sm:text-base rounded-md"
                required
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                ) : (
                  <Eye size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-1">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="rounded bg-gray-800 border-gray-700 text-cyan-700 focus:ring-cyan-400/20 mr-2 h-4 w-4"
              />
              <label
                htmlFor="remember"
                className="text-xs sm:text-sm text-gray-300"
              >
                Remember me
              </label>
            </div>

            <div className="flex items-center text-xs sm:text-sm text-white">
              <span className="text-gray-50 mr-1">Don't have an account?</span>
              <button
                type="button"
                className="text-sky-300 font-bold"
                onClick={() => navigate("/Registration")}
              >
                Sign up
              </button>
            </div>
          </div>

          <div className="flex w-full mt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-sky-950 via-sky-900 to-sky-800 shadow-md shadow-gray-900 hover:-translate-y-0.5 transition text-white border-none w-full h-9 sm:h-10 md:h-10 text-sm sm:text-base rounded-md"
            >
              Login
            </Button>
          </div>
        </div>
      </form>

      <div className="relative flex items-center justify-center my-4 sm:my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-[linear-gradient(to_right,theme(colors.white)_29%,transparent_0%,transparent_71%,theme(colors.white)_37%)]" />
        </div>
        <span className="relative px-4 text-xs sm:text-sm text-gray-100">
          Or continue with
        </span>
      </div>

      <div className="flex ">
        <Button
          className="flex w-full items-center bg-transparent border border-gray-400 text-white hover:bg-gray-50 h-9 sm:h-10 md:h-9 text-sm sm:text-base rounded-md px-4"
          type="button"
          onClick={signInWithGoogle}
        >
          <svg
            className=" h-4 w-4 sm:h-5 sm:w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 533.5 544.3"
          >
            <path
              fill="#4285f4"
              d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95.1h146.9c-6.4 34.6-25.4 63.9-54.2 83.5v69.5h87.5c51.2-47.1 81.3-116.4 81.3-197.8z"
            />
            <path
              fill="#34a853"
              d="M272 544.3c73.6 0 135.3-24.4 180.4-66.3l-87.5-69.5c-24.3 16.3-55.5 25.8-92.9 25.8-71.5 0-132-48.2-153.7-112.9H28.5v70.9c45.3 89.9 137.8 152 243.5 152z"
            />
            <path
              fill="#fbbc04"
              d="M118.3 321.4c-10.5-31.1-10.5-64.9 0-96l-70-70.9C8.3 204.4 0 239.8 0 278.4s8.3 74 48.3 124.1l70-70.9z"
            />
            <path
              fill="#ea4335"
              d="M272 107.2c39.9 0 75.7 13.8 104 40.7l77.8-77.8C407.2 26.2 345.6 0 272 0 166.3 0 73.8 62.1 28.5 152l89.8 70.9C140 155.4 200.5 107.2 272 107.2z"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
