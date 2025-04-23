import { Waypoints, CirclePower } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import Switch from "@/components/ui/switch";
import { AssetSearch } from "@/components/SearchComponents/AssetSearch";

export default function Header() {
  const { user, handleLogout } = useAuth();

  return (
    <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
      <div className="flex items-center space-x-2 ">
        <Waypoints className="h-8 w-8 text-teal-300" />
        <span className="text-xl font-bold bg-gradient-to-r from-teal-200 to-teal-600 bg-clip-text text-transparent ">
          Flux
        </span>
      </div>

      <div className="flex items-center space-x-6 max-sm:space-x-2 ml-2">
        <div className="flex-shrink">
          <AssetSearch />
        </div>

        <div className="flex items-center space-x-3 ">
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

          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
            <AvatarFallback className="bg-slate-700 text-cyan-500">
              {user?.displayName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <button
            onClick={handleLogout}
            className="relative text-sm text-red-500 transition duration-300 rounded-full mr-6  
             hover:text-red hover:shadow-[0_0_20px_1px#ff0000] hover:rounded-full"
          >
            <CirclePower />
          </button>
        </div>
      </div>
    </header>
  );
}
