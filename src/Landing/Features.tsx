import React from "react";
import featureimg from "@/assets/feature.png";
import phoneimg from "@/assets/featurePhone.png";
import { motion } from "framer-motion";
import {
  fadeIn,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  lazyLoad,
} from "@/Animation/motionVariants";
import { featureData } from "./constants/constants";

const Features: React.FC = () => {
  // Array of animation variants to cycle through for each card
  const animationVariants = [fadeInLeft, fadeInUp, fadeInRight];

  return (
    <div
      id="features"
      className="max-w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto mt-16 relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Feature Cards Container with Stagger Effect */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Map through the first 3 features */}
          {featureData.features.slice(0, 3).map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex flex-col p-6 bg-slate-800/80 rounded-lg backdrop-blur-3xl before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-1px] before:w-[66%] before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-sky-300 before:to-transparent before:rounded-full"
              variants={animationVariants[index % animationVariants.length]}
              initial="start"
              whileInView="end"
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                {React.cloneElement(feature.icon, {
                  className: "w-6 h-6 text-sky-600",
                })}
                <h3 className="ml-3 font-semibold text-lg text-gray-50">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Content */}
        {/* Devices Display Section */}
        <div className="relative flex justify-center items-center mt-16 pb-28">
          {/* Browser Mockup */}
          <motion.div
            className="relative w-auto max-w-full shadow-lg rounded-lg overflow-hidden"
            variants={fadeIn}
            initial="start"
            whileInView="end"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Browser Header */}
            <div className="relative flex items-center bg-gray-800 border-b border-gray-800 rounded-t-xl py-2 px-4">
              <div className="flex gap-x-1 absolute top-1/2 left-4 -translate-y-1/2">
                <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              </div>
              <div className="mx-auto text-sm text-gray-300">www.flux.com</div>
            </div>

            {/* Browser Content */}
            <div className="bg-white">
              <img
                src={featureimg}
                alt="Dashboard Interface"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Realistic Phone Mockup */}
          <motion.div
            className="absolute bottom-0 left-0 z-20 w-64 hidden lg:block"
            variants={lazyLoad}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="relative top-2">
              {/* Phone frame */}
              <div className="relative w-full bg-gray-800 rounded-[3rem] p-2 shadow-xl">
                {/* Notch area */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-xl z-20"></div>

                {/* Speaker */}
                <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-400 rounded-full z-30"></div>

                {/* Front camera */}
                <div className="absolute top-1.5 right-1/3 w-1.5 h-1.5 bg-gray-500 rounded-full z-30"></div>

                {/* Screen with content */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 aspect-[9/19.5] w-full">
                  <img
                    src={phoneimg}
                    alt="Mobile Interface"
                    className="absolute top-0 left-0 w-full h-full object-cover "
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Features;
