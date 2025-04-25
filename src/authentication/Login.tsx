import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/login-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { Toaster, toast } from "sonner";
import { ArrowLeftCircle, Waypoints } from "lucide-react";

import back from "@/assets/log.jpg";
import { useAuth } from "@/hooks/use-auth";

function Login() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/Dashboard");
    }
  }, [user, loading, navigate]);

  // Show toast from sessionStorage
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
      navigate("/Dashboard");
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
        richColors
        theme="system"
        closeButton
        expand
        visibleToasts={3}
      />
      <div className="bg-gradient-to-r from-gray-900 via-cyan-950 to-cyan-900 flex items-center justify-center min-h-screen">
        <div className="bg-gradient-to-r from-gray-800 via-cyan-900 to-cyan-700 rounded-lg shadow-md shadow-sky-300 overflow-hidden w-full max-w-7xl h-[50em] grid grid-cols-1 lg:grid-cols-2 max-sm:h-[40em]">
          <div className="p-10 flex flex-col items-center justify-center relative text-start">
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

            <div className="flex items-center gap-2 mb-6">
              <Waypoints className="h-8 w-8 text-sky-300" />
              <span className="text-2xl font-bold bg-gradient-to-t from-sky-100 via-sky-300 to-cyan-900 bg-clip-text text-transparent">
                Flux
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-white">Welcome back!</h2>
            <p className="text-gray-400 text-sm mb-6">
              Enter your details below.
            </p>

            <LoginForm onLogin={handleLogin} />
          </div>

          <div className="hidden lg:block relative bg-mask opacity-100">
            <img
              src={back}
              alt="Login Illustration"
              className="absolute w-full h-full object-cover"
              style={{ backgroundPosition: "left bottom" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
