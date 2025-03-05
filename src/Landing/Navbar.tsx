import { Button } from "@/components/ui/button";
import { Github, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const navigation = [
  { name: "Pricing", href: "/pricing" },
  { name: "Resources", href: "/resources" },
  { name: "Community", href: "/community" },
  { name: "Download", href: "/download" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const prevScrollPos = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos < prevScrollPos.current || currentScrollPos < 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      prevScrollPos.current = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl  mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div
                onClick={() => navigate("/")}
                className="text-2xl font-bold bg-gradient-to-t from-teal-200 via-teal-400 to-cyan-800 bg-clip-text text-transparent cursor-pointer"
              >
                Flux
              </div>
              <div className="hidden md:block ml-10 mt-1">
                <div className="flex-col items-center space-x-8 ">
                  {navigation.map((item) => (
                    <span
                      key={item.name}
                      onClick={() => navigate(item.href)}
                      className="text-sm text-gray-300 hover:text-white cursor-pointer font-medium"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/miguelkarma"
                target="_blank"
                rel="noreferrer"
                className="hidden md:block"
              >
                <Button variant="ghost">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </a>
              <div className="hidden md:block space-x-4">
                <Button
                  variant="ghost"
                  className="relative w-auto px-6 py-2 p-4 text-white bg-black border border-white/50 rounded-full transition-all hover:bg-black 
                before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-2px] before:w-[66%] before:h-[4px] before:bg-gradient-to-r before:from-transparent before:via-teal-500 before:to-transparent hover:border-teal-200 before:rounded-full"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  className="relative w-auto px-6 py-2 p-4 text-white bg-black border border-white/50 rounded-full transition-all hover:bg-black 
                before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-2px] before:w-[66%] before:h-[4px] before:bg-gradient-to-r before:from-transparent before:via-teal-500 before:to-transparent hover:border-teal-200 before:rounded-full"
                  onClick={() => navigate("/registration")}
                >
                  Register
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                  className="focus:bg-transparent"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6 text-white" />
                  ) : (
                    <Menu className="h-6 w-6 text-white " />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-4 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <span
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm py-2 text-gray-300 hover:text-white cursor-pointer"
                >
                  {item.name}
                </span>
              ))}

              <a
                href="https://github.com/miguelkarma"
                target="_blank"
                rel="noreferrer"
                className="flex items-center py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Github className="h-5 w-5 mr-2" />
                <span>GitHub</span>
              </a>

              <Button
                variant="ghost"
                className="w-full justify-center relative px-4 py-2 text-white bg-black border border-white/50 rounded-full transition-all hover:bg-black 
              before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-2px] before:w-[66%] before:h-[4px] before:bg-gradient-to-r before:from-transparent before:via-teal-500 before:to-transparent hover:border-teal-500/30 before:rounded-full"
                onClick={() => {
                  navigate("/registration");
                  setMobileMenuOpen(false);
                }}
              >
                Sign In
              </Button>

              <Button
                className="w-full justify-center relative px-4 py-2 text-white bg-black border border-white/50 rounded-full transition-all hover:bg-black 
              before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-2px] before:w-[66%] before:h-[4px] before:bg-gradient-to-r before:from-transparent before:via-teal-500 before:to-transparent hover:border-teal-500/30 before:rounded-full"
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
              >
                Log In
              </Button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
