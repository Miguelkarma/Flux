import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/login-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";

import back from "@/assets/log.jpg";
import { Toaster } from "sonner";
import "../styles/LoginReg.css";
import { useEffect } from "react";
import { toast } from "sonner";
import { Waypoints } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    const toastMessage = sessionStorage.getItem("toastMessage");
    if (toastMessage) {
      toast.success(toastMessage);
      sessionStorage.removeItem("toastMessage");
    }
  }, []);

  useEffect(() => {
    const toastMessage = sessionStorage.getItem("toastMessage");
    if (toastMessage) {
      toast.success(toastMessage);
      sessionStorage.removeItem("toastMessage");
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User Logged In:", userCredential.user);
      sessionStorage.setItem("toastMessage", "Login successful! Welcome back.");

      navigate("/Dashboard"); // Redirect to Dashboard on success
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Login failed! Please check your email and password.");
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

      <div className="bg-gradient-to-r from-gray-900 via-teal-950 to-teal-900 shadow-xl rounded-lg overflow-hidden w-screen h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Login Form */}
        <div className="p-10 flex flex-col justify-center ">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 mb-6 ">
            <Waypoints className="h-8 w-8 text-teal-300" />
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-300 to-teal-400 bg-clip-text text-transparent">
              Flux
            </span>
          </div>

          <h2 className="text-2xl font-semibold text-white">Welcome back!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Enter your details below.
          </p>

          {/* Login Form */}
          <LoginForm onLogin={handleLogin} />
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block relative bg-mask opacity-100">
          <img
            src={back}
            alt="Login Illustration"
            className="absolute w-full h-full object-cover "
            style={{ backgroundPosition: "left bottom" }}
          />
        </div>
      </div>
    </>
  );
}

export default Login;
