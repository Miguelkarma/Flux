import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { navMenu } from "./constants/constants";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <header className="border h-16 md:h-20 lg:h-22 relative">
      <div className="container mx-auto h-full flex items-center justify-between">
        {/* Logo */}
        <span className="text-2xl font-bold bg-gradient-to-t from-teal-200 via-teal-400 to-cyan-800 bg-clip-text text-transparent">
          Flux
        </span>

        {/* Desktop Navigation */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
          <NavigationMenu className="text-sm">
            <NavigationMenuList>
              {navMenu.map(({ href, label }, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    href={href || "#"}
                    onClick={(e) => handleScroll(e, href || "#")}
                    className={navigationMenuTriggerStyle()}
                  >
                    {label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* Auth Buttons */}
        <div className="hidden lg:flex gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              navigate("/registration");
            }}
          >
            Sign In
          </Button>
          <Button
            className="relative w-auto px-6 py-2 p-4 text-white bg-black border border-white/30 rounded-full transition-all hover:bg-black 
                before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-2px] before:w-[66%] before:h-[4px] before:bg-gradient-to-r before:from-transparent before:via-teal-500 before:to-transparent hover:border-teal-200 before:rounded-full"
            onClick={() => {
              navigate("/login");
            }}
          >
            Log In
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden absolute right-4 top-1/2 transform -translate-y-1/2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <span>
                  <Menu />
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="bg-background/70 backdrop-blur-md 
                  border-foreground/5 border rounded-lg shadow-lg overflow-hidden"
            >
              <MobileMenu navMenu={navMenu} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Header;
