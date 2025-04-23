import { Waypoints, CirclePower, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/use-auth";
import Switch from "@/components/ui/switch";
import { AssetSearch } from "@/components/SearchComponents/AssetSearch";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex flex-col md:flex-row items-center justify-between py-4 border-slate-500 mb-6 rounded-lg">
      <Button
        className=" text-3xl font-bold bg-clip-text text-transparent rounded-lg transition-all duration-300 hover:shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-teal-200  shadow-none
          logo-gradient"
        onClick={() => {
          navigate("/");
        }}
      >
        {" "}
        Flux
      </Button>

      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-x-6 md:space-y-0 ml-2">
        <div className="flex-shrink w-full md:w-auto">
          <AssetSearch />
        </div>

        <div className="p-1 rounded-full border shadow shadow-popover-foreground flex items-center space-x-3 w-full justify-between md:w-auto bg-secondary">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Switch />
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover>
            <PopoverTrigger asChild>
              <div className="cursor-pointer">
                <Avatar>
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="User"
                  />
                  <AvatarFallback className="bg-muted text-primary flex flex-row items-center justify-center gap-1 font-bold">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-4 w-64">
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-base text-foreground">
                  Username: {user?.displayName || "Unknown User"}
                </p>
                <p className="text-sm text-muted-foreground break-words">
                  Email: {user?.email || "No email available"}
                </p>
              </div>
            </PopoverContent>
          </Popover>

          <button
            onClick={handleLogout}
            className="w-8 h-8 relative text-sm text-red-500 transition duration-300 rounded-full mr-1
              hover:text-red hover:shadow-[0_0_20px_1px#ff0000] hover:rounded-full flex items-center justify-center"
          >
            <CirclePower className="w-8 h-8" />
          </button>
        </div>
      </div>
    </header>
  );
}
