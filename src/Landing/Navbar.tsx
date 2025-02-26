import logo from "@/assets/logo1.png";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const prevScrollPos = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const shouldBeVisible =
        currentScrollPos < prevScrollPos.current || currentScrollPos < 50;

      setIsVisible(shouldBeVisible);
      prevScrollPos.current = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`nav fixed top-0 left-0 w-full backdrop-opacity-2 backdrop-blur bg-gray/10 dark:bg-transparent transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } backdrop-blur supports-[backdrop-filter]:bg-background/0`}
    >
      <div className="container flex h-20 max-w-screen-2xl space-x-2 items-center">
        <img src={logo} className="size-10" alt="Logo" />
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/Home");
          }}
          className="mr-6 flex items-center space-x-2"
        >
          <span className="font-bold text-2xl">TechTrack</span>
        </a>
        <header className="flex flex-1 items-center space-x-6 text-sm font-medium"></header>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/miguelkarma"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="ghost">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          </a>
          <Button
            variant="outline"
            className="text-sm w-18"
            onClick={() => navigate("/Login")}
          >
            Login
          </Button>
          <Button
            className="text-sm w-20"
            onClick={() => navigate("/Registration")}
          >
            Register
          </Button>
        </div>
      </div>
    </nav>
  );
}
