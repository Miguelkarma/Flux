import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";
import "../styles/Navbar.css";
import AnimatedWrap from "./Animation/AnimatedWrap";

function Navbar() {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const shouldBeVisible =
        currentScrollPos < prevScrollPos || currentScrollPos < 50;

      setIsVisible(shouldBeVisible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <>
      <nav
        className={`nav backdrop-opacity-2 backdrop-blur bg-gray/40  dark:bg-transparent transition-transform duration-300  ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } fixed w-full z-20 top-0 start-0  dark:border-transparent `}
      >
        <AnimatedWrap>
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-1    ">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/Home");
              }}
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <img
                src={logo}
                className="h-10 w-full  rounded-3xl"
                alt="Flowbite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-50 max-sm:text-xl">
                TechTrack
              </span>
            </a>
            <div className="flex md:order-2 md:space-x-0 rtl:space-x-reverse justify-center mt-2">
              <button
                type="button"
                className="auth text-white bg-gradient-to-br from-gray-700 to-cyan-300/30 max-sm:text-sm max-sm:p-1  border-gray-3 focus:outline-none hover:bg-gray-800 
            hover:text-gray-50 focus:ring-4 focus:ring-gray-400 font-semibold rounded-full text-sm p-2 w-15  me-3 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 transition"
                onClick={() => navigate("/Login")}
              >
                Login
              </button>

              <button
                type="button"
                className="auth text-white bg-gradient-to-br from-gray-700 to-cyan-300/30  max-sm:text-md max-sm:p-1  border-gray-3 focus:outline-none hover:bg-gray-800 
            hover:text-gray-50 focus:ring-4 focus:ring-gray-400 font-semibold rounded-full text-sm px-4 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 transition"
                onClick={() => navigate("/Registration")}
              >
                Register
              </button>

              <button
                data-collapse-toggle="navbar-sticky"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-sticky"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            </div>
            <div
              className="  items-center justify-between hidden w-full md:flex md:w-auto md:order-1  p-3 "
              id="navbar-sticky"
            >
              <ul className=" flex flex-col p-4 md:p-0 mt-4  font-bold border border-gray-100 rounded-lg bg-gray-800 md:space-x-20 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 text-lg ">
                <li className="list">
                  <a
                    href="#"
                    className="block py-2 px-3 text-gray-50 hover:text-gray-50  md:bg-transparent md:p-0 max-sm:text-white"
                    aria-current="page"
                    onClick={() => navigate("/Home")}
                  >
                    Home
                  </a>
                </li>
                <li className="list">
                  <a
                    href="#"
                    className="block py-2 px-3 text-gray-50 rounded-sm hover:bg-gray-800 md:hover:bg-transparent md:hover:text-gray-50 md:p-0  dark:text-white dark:hover:bg-gray-700 dark:hover:text-gray-700 md:dark:hover:bg-transparent dark:border-gray-700 max-sm:text-white"
                  >
                    About
                  </a>
                </li>
                <li className="list">
                  <a
                    href="#"
                    className="block py-2 px-3 text-gray-50 rounded-sm hover:bg-gray-50 md:hover:bg-transparent md:hover:text-gray-50 md:p-0 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 max-sm:text-white"
                  >
                    Services
                  </a>
                </li>
                <li className="list transition">
                  <a
                    href="#"
                    className="block py-2 px-3 text-gray-50 rounded-sm hover:bg-gray-50 md:hover:bg-transparent md:hover:text-gray-50 md:p-0 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 max-sm:text-white"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </AnimatedWrap>
      </nav>
    </>
  );
}

export default Navbar;
