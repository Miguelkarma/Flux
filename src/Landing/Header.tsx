"use client";

import React, { useState, useEffect } from "react";

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
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 1.5,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
};

const sharedTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

const Header = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeHoverItem, setActiveHoverItem] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    // Reset hover state
    setActiveHoverItem(null);

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

  return (
    <motion.header
      id="header"
      className="border-b shadow-3xl border-teal-900 h-16 md:h-20 lg:h-22 fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur"
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto h-full flex items-center justify-between">
        {/* Logo */}
        <Button
          className="text-2xl font-bold bg-gradient-to-t from-teal-200 via-teal-400 to-cyan-800 bg-clip-text text-transparent rounded-lg transition-all duration-300 hover:shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-teal-200 hover:border hover:border-slate-600"
          onClick={() => {
            navigate("/");
          }}
        >
          Flux
        </Button>

        {/* Desktop Navigation */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
          <NavigationMenu className="text-sm">
            <NavigationMenuList className="flex items-center gap-1 relative z-10">
              {navMenu.map(({ href, label, icon }, index) => {
                const gradients = [
                  "radial-gradient(circle, rgba(153, 233, 242, 0.5) 0%, rgba(102, 204, 214, 0.06) 70%, rgba(77, 182, 194, 0) 80%)",
                ];
                const iconColors = ["text-teal-500"];
                const gradient = gradients[index % gradients.length];
                const iconColor = iconColors[index % iconColors.length];

                const isHovering = activeHoverItem === index;

                return (
                  <NavigationMenuItem key={index} className="relative">
                    <motion.div
                      className="block rounded-xl overflow-visible relative"
                      style={{ perspective: "600px" }}
                      initial="initial"
                      animate={isHovering ? "hover" : "initial"}
                      onHoverStart={() => setActiveHoverItem(index)}
                      onHoverEnd={() => setActiveHoverItem(null)}
                      onClick={() => setActiveHoverItem(null)}
                    >
                      {/* Glow effect */}
                      <motion.div
                        className="absolute inset-0 z-0 pointer-events-none"
                        variants={glowVariants}
                        style={{
                          background: gradient,
                          opacity: 0,
                          borderRadius: "16px",
                        }}
                      />

                      {/* Front face */}
                      <motion.a
                        href={href || "#"}
                        onClick={(e) => handleNavigation(e, href || "#")}
                        className="flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent text-foreground transition-colors rounded-xl font-normal"
                        variants={itemVariants}
                        transition={sharedTransition}
                        style={{
                          transformStyle: "preserve-3d",
                          transformOrigin: "center bottom",
                        }}
                      >
                        {icon && (
                          <motion.span
                            className={`transition-colors duration-300 ${iconColor} text-teal-400`}
                          >
                            {icon}
                          </motion.span>
                        )}
                        <span>{label}</span>
                      </motion.a>

                      {/* Back face */}
                      <motion.a
                        href={href || "#"}
                        onClick={(e) => handleNavigation(e, href || "#")}
                        className="flex items-center gap-2 px-4 py-2 absolute inset-0 z-10 bg-transparent text-muted-foreground text-teal-500 transition-colors rounded-xl"
                        variants={backVariants}
                        transition={sharedTransition}
                        style={{
                          transformStyle: "preserve-3d",
                          transformOrigin: "center top",
                          rotateX: 90,
                        }}
                      >
                        {icon && (
                          <span
                            className={`transition-colors duration-300 text-teal-400`}
                          >
                            {icon}
                          </span>
                        )}
                        <span>{label}</span>
                      </motion.a>
                    </motion.div>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex gap-2 !rounded-none hover:!rounded-full">
          <Button
            variant="ghost"
            onClick={() => {
              navigate("/registration");
            }}
            className="!rounded-full hover:!rounded-full"
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
    </motion.header>
  );
};

export default Header;
