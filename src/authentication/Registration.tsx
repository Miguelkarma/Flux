import { useNavigate } from "react-router-dom";
import RegistrationForm from "@/components/registration-form";

import back from "@/assets/log.jpg";
import "@/styles/LoginReg.css";
import { Waypoints } from "lucide-react";

const Registration = () => {
  const navigate = useNavigate();
  return (
    <div className=" back grid min-h-svh lg:grid-cols-2 text-white">
      <div className="flex flex-col gap-4 p-6 md:p-10 text-gray-100">
        <div className="flex justify-center gap-2 md:justify-start text-white">
          <a
            href="#"
            className="flex items-center gap-2 font-medium text-xl"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <Waypoints className="h-8 w-8 text-teal-300" />
            <div className="text-2xl font-bold bg-gradient-to-t from-teal-200 via-teal-400 to-cyan-800 bg-clip-text text-transparent ">
              Flux
            </div>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md relative">
            <div className="absolute -inset-2 bg-teal-500 opacity-30 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <RegistrationForm />
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={back}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover "
        />
      </div>
    </div>
  );
};

export default Registration;
