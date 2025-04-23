"use client";

import { useNavigate } from "react-router-dom";
import { RegistrationForm } from "@/components/registration-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/firebase";

import back from "@/assets/log.jpg";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeftCircle, Waypoints } from "lucide-react";

function Registration() {
  const navigate = useNavigate();

  useEffect(() => {
    const toastMessage = sessionStorage.getItem("toastMessage");
    if (toastMessage) {
      toast.success(toastMessage);
      sessionStorage.removeItem("toastMessage");
    }
  }, []);

  const handleRegister = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      await updateProfile(user, { displayName: username });

      console.log("User Registered:", user);
      sessionStorage.setItem(
        "toastMessage",
        "Registration successful! Please login."
      );

      navigate("/login"); // Redirect to login page on success
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error("Registration failed! Please try again.");
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
      <div className="bg-gradient-to-r from-gray-900 via-cyan-950 to-cyan-900 flex items-center justify-center min-h-screen">
        <div className="bg-gradient-to-r from-gray-800 via-cyan-900 to-cyan-700 rounded-lg shadow-md shadow-sky-300 overflow-hidden w-full max-w-7xl h-[50em] grid grid-cols-1 lg:grid-cols-2 max-sm:h-[41.7em] max-sm">
          {/* Left Side - Registration Form */}
          <div className="p-10 flex flex-col justify-center relative">
            <a
              className="absolute top-4 left-4 text-gray-300 hover:text-gray-700"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              <ArrowLeftCircle className="w-6 h-6" />
            </a>
            {/* Logo & Title */}
            <div className="flex items-center gap-2 mb-6 ">
              <Waypoints className="h-8 w-8 text-cyan-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-600 bg-clip-text text-transparent">
                Flux
              </span>
            </div>

            <h2 className="text-2xl font-semibold text-white">
              Create an account!
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Enter your details below.
            </p>

            {/* Registration Form */}
            <RegistrationForm onRegister={handleRegister} />
          </div>

          {/* Right Side - Image */}
          <div className="hidden lg:block relative bg-mask opacity-100">
            <img
              src={back}
              alt="Register Illustration"
              className="absolute w-full h-full object-cover"
              style={{ backgroundPosition: "left bottom" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Registration;
