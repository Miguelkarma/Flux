import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/login-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import logo from "@/assets/logo1.png";
import placeholder from "@/Landing/Carousel/slider1.jpg";
import "../styles/LoginReg.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User Logged In:", userCredential.user);
      navigate("/Dashboard"); // Redirect to Dashboard on success
    } catch (error) {
      console.error("Login Error:", error);
      alert("Invalid email or password.");
    }
  };

  return (
    <div className="bg grid min-h-svh lg:grid-cols-2 text-white">
      <div className="flex flex-col gap-4 p-6 md:p-10 text-gray-100">
        <div className="flex justify-center gap-2 md:justify-start text-white">
          <a
            href="#"
            className="flex items-center gap-2 font-medium text-xl"
            onClick={(e) => {
              e.preventDefault();
              navigate("/Home");
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md ">
              <img className="size-10" src={logo} />
            </div>
            TechTrack
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm onLogin={handleLogin} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={placeholder}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
export default Login;
