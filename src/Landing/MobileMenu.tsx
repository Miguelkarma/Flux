import { MenuItem } from "./constants/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "firebase/auth";

type MobileMenuProps = {
  navMenu: MenuItem[];
  isLoggedIn?: boolean;
  user?: User | null;
  userEmail?: string | null;
  onLogout?: () => void;
  loading?: boolean;
};

const MobileMenu = ({
  navMenu,
  isLoggedIn = false,
  user = null,
  userEmail = null,
  onLogout,
  loading = false,
}: MobileMenuProps) => {
  const navigate = useNavigate();

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    if (href.startsWith("#")) {
      const targetId = href.substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
  };

  const getAvatarFallback = () => {
    if (!user) return "U";

    if (user.displayName) {
      const initials = user.displayName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
      return initials;
    }

    return user.email ? user.email.charAt(0).toUpperCase() : "U";
  };

  return (
    <>
      <div>
        <ul className="mb-3 text-gray-200">
          {navMenu.map(({ href, label }, index) => (
            <li key={index}>
              <Button asChild variant="ghost" className="w-full justify-start">
                <a
                  href={href || "#"}
                  onClick={(e) => handleScroll(e, href || "#")}
                >
                  {label}
                </a>
              </Button>
            </li>
          ))}
        </ul>
        <Separator className="bg-slate-100/20" />

        {loading ? (
          // Loading state
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 rounded-full border-2 border-cyan-200 border-t-transparent animate-spin"></div>
          </div>
        ) : isLoggedIn && user ? (
          // User is logged in
          <div className="mt-4 space-y-3">
            {/* User Profile Section */}
            <div className="flex items-center gap-3 p-2">
              <Avatar className="h-8 w-8 border border-cyan-200">
                <AvatarImage
                  src={user.photoURL || ""}
                  alt={user.displayName || "User"}
                />
                <AvatarFallback className="bg-gradient-to-br from-sky-400 to-cyan-800 text-white">
                  {getAvatarFallback()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-white">
                  {user.displayName || "User"}
                </span>
                <span className="text-xs text-gray-400">{userEmail}</span>
              </div>
            </div>

            {/* User Actions */}
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-gray-200"
              onClick={() => navigate("/profile")}
            >
              <UserIcon size={14} />
              <span>My Profile</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-500"
              onClick={onLogout}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-4">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/registration")}
            >
              Sign In
            </Button>
            <Button
              className="relative w-full text-white bg-black border border-white/30 rounded-full transition-all hover:bg-black 
                before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-2px] before:w-[66%] before:h-[4px] before:bg-gradient-to-r before:from-transparent before:via-teal-500 before:to-transparent hover:border-teal-200 before:rounded-full"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileMenu;
