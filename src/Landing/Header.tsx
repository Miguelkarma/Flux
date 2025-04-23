"use client";

import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Menu, LogOut, User as UserIcon } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { navMenu } from "./constants/constants";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const sharedTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

const Header = () => {
  const navigate = useNavigate();
  const { user, userEmail, handleLogout, loading } = useAuth();
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

  // Check if user is logged in
  const isLoggedIn = !!user;

  return (
    <motion.header
      id="header"
      className=" shadow-3xl  h-16 max-sm:h-16 max-md:h-13 max-lg:h-13 fixed top-0 left-0 right-0 z-50 bg-transparent "
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -105 }}
      transition={{ duration: 0.3 }}
    >
      <div className="landing-container backdrop-blur-xl rounded-full mx-auto h-full flex items-center justify-between  mt-5 shadow-md shadow-cyan-300 max-2xl:rounded-none max-2xl:mt-0  ">
        {/* Logo */}
        <Button
          className="text-2xl font-bold bg-gradient-to-t from-sky-100 via-sky-300 to-cyan-900 bg-clip-text text-transparent rounded-lg transition-all duration-300 hover:shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-teal-200 hover:border hover:border-slate-600 shadow-none"
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
                const iconColors = ["text-sky-300"];
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
                      {/* Front face */}
                      <motion.a
                        href={href || "#"}
                        onClick={(e) => handleNavigation(e, href || "#")}
                        className="flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent text-foreground transition-colors rounded-xl font-normal text-white"
                        variants={itemVariants}
                        transition={sharedTransition}
                        style={{
                          transformStyle: "preserve-3d",
                          transformOrigin: "center bottom",
                        }}
                      >
                        {icon && (
                          <motion.a
                            href={href || "#"}
                            onClick={(e) => handleNavigation(e, href || "#")}
                            className={`transition-colors duration-300 ${iconColor} text-indigo-300`}
                          >
                            {icon}
                          </motion.a>
                        )}
                        <a
                          href={href || "#"}
                          onClick={(e) => handleNavigation(e, href || "#")}
                        >
                          {label}
                        </a>
                      </motion.a>

                      {/* Back face */}
                      <motion.a
                        href={href || "#"}
                        onClick={(e) => handleNavigation(e, href || "#")}
                        className="flex items-center gap-2 px-4 py-2 absolute inset-0 z-10 bg-transparent text-muted-foreground text-sky-300 transition-colors rounded-xl"
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
                            className={`transition-colors duration-300 text-sky-300 `}
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

        {/* Auth Buttons or User Avatar */}
        <div className="hidden lg:flex gap-2 !rounded-none hover:!rounded-full">
          {loading ? (
            // Loading state - show subtle loading indicator
            <div className="w-10 h-10 rounded-full border-2 border-cyan-200 border-t-transparent animate-spin"></div>
          ) : isLoggedIn ? (
            // User is logged in
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                  <Avatar className="h-10 w-10 border-2 border-cyan-200 cursor-pointer hover:border-sky-300 transition-all">
                    <AvatarImage
                      src={user?.photoURL || ""}
                      alt={user?.displayName || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-sky-400 to-cyan-800 text-white">
                      {getAvatarFallback()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 bg-background/70 backdrop-blur-md border-foreground/5 border rounded-lg shadow-lg p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-300">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.photoURL || ""}
                        alt={user?.displayName || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-sky-400 to-cyan-800 text-white">
                        {getAvatarFallback()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-white">
                        {user?.displayName || "User"}
                      </span>
                      <span className="text-sm text-gray-400">{userEmail}</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="flex justify-start gap-2 text-gray-300 hover:text-white"
                    onClick={() => navigate("/settings")}
                  >
                    <UserIcon size={16} />
                    <span>My Profile</span>
                  </Button>

                  <Button
                    variant="ghost"
                    className="flex justify-start gap-2 text-red-500 hover:text-red-500"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/registration");
                }}
                className="!rounded-full hover:!rounded-full text-white hover:bg-transparent hover:border hover:text-white hover:border-cyan-200"
              >
                Sign In
              </Button>
              <Button
                className="relative w-auto px-6 py-2 p-4 text-white bg-black border border-white/30 rounded-full transition-all hover:bg-black 
                    before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-1px] before:w-[66%] before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-sky-300 before:to-transparent hover:border-sky-200 before:rounded-full"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Log In
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden absolute right-4 top-1/2 transform -translate-y-1/2 mt-5 bg-transparent max max-2xl:mt-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="">
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
              <MobileMenu
                navMenu={navMenu}
                isLoggedIn={isLoggedIn}
                user={user}
                userEmail={userEmail}
                onLogout={handleLogout}
                loading={loading}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
