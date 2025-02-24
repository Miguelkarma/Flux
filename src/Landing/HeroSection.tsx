import * as React from "react";
import "../styles/Hero.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import AnimatedWrap from "./Animation/AnimatedWrap";

const HeroSection: React.FC = () => {
  return (
    <>
      <AnimatedWrap transition={{ duration: 1.5, delay: 1 }}>
        <section className="bg-transparent dark:bg-gray-50 mt-[18em] flex justify-center items-center  ">
          <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="grid place-items-center lg:col-span-12">
              <h1 className=" max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-gray-50 text-center">
                TechTrack
              </h1>
              <p className="max-w-2xl mb-6 font-light text-gray-50 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400 text-center">
                From checkout to global sales tax compliance, companies around
                the world use Flowbite to simplify their payment stack.
              </p>
              <div className="flex text-center justify-center space-x-3">
                <button className="get relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-lg font-medium text-gray-900 rounded-full border-gray-800 group bg-gradient-to-br from-gray-700 to-cyan-300/30  hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-200 ">
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-transparent dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-white font-medium">
                    Get Started
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
        <span className="font-semibold uppercase text-neutral-500 flex justify-center items-center h-12 mt-40">
          <FontAwesomeIcon
            className="size-6 animate-bounce"
            icon={faCaretDown}
          />
        </span>
      </AnimatedWrap>
    </>
  );
};

export default HeroSection;
