import { useNavigate } from "react-router-dom";
import { RegistrationForm } from "@/components/registration-form";
import logo from "@/assets/logo1.png";
import back from "@/assets/log.jpg";
import "@/styles/LoginReg.css";

const Registration = () => {
  const navigate = useNavigate();
  return (
    <div className=" back bg grid min-h-svh lg:grid-cols-2 text-white">
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
            <div className="flex h-10 w-10 items-center justify-center rounded-md">
              <img className="size-10" src={logo} />
            </div>
            TechTrack
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegistrationForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={back}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Registration;
