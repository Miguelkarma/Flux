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

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  className?: string;
}

export function LoginForm({ onLogin, className, ...props }: LoginFormProps) {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
          <SmallLoader />
        </div>
      )}

      <div className="mb-8  ">
        <div className="text-xs uppercase tracking-wider  text-cyan-400">
          START FOR FREE
        </div>
        <h1 className="text-3xl text-gray-50 font-bold mt-2">
          Login to your account<span className="text-cyan-400">.</span>
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm text-gray-300">
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-gray-800/50 border-gray-700 text-white  focus:ring-none focus:border-none"
                icon={Mail}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="text-sm text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-gray-800/50 border-gray-700 text-white  focus:ring-none focus:border-none"
                icon={KeyRound}
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 gap-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="rounded bg-gray-800 border-gray-700 text-cyan-700 focus:ring-teal-400/20 mr-2"
              />
              <label htmlFor="remember" className="text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <div className="flex flex-wrap gap-1 text-sm text-white">
              <span className="text-gray-50 pointer-events-none">
                Don’t have an account?
              </span>
              <a
                href="#"
                className="text-sky-300 font-bold"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/Registration");
                }}
              >
                Sign up
              </a>
            </div>
          </div>

          <div className="flex mt-1 justify-self-end ">
            <Button
              type="submit"
              disabled={loading}
              className="flex-2 bg-custom-background shadow-md shadow-gray-900 hover:bg-cyan-300/20 text-white border-none"
            >
              Login
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
