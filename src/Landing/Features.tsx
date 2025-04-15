import React from "react";
import featureimg from "@/assets/feature.png";
import phoneimg from "@/assets/featurePhone.png";
import { Layout, MousePointerClick, Sparkles } from "lucide-react";
import { GridBackground } from "./constants/grid-background";

const SimpleFeatureCard: React.FC = () => {
  return (
    <div className="max-w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto mt-16  relative">
      <GridBackground />
      <div className="max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature Block 1 */}
          <div className="flex flex-col p-6 bg-slate-800/80 rounded-lg backdrop-blur-3xl before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-1px] before:w-[66%] before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-sky-300 before:to-transparent before:rounded-full">
            <div className="flex items-center mb-4 ">
              <Layout className="w-6 h-6 text-sky-600" />
              <h3 className="ml-3 font-semibold text-lg text-gray-50">
                Unified Asset Dashboard
              </h3>
            </div>
            <p className="text-gray-400">
              Get a centralized view of all your IT equipment with real-time
              status, location, and assignment tracking.
            </p>
          </div>

          {/* Feature Block 2 */}
          <div className="flex flex-col p-6 rounded-lg bg-slate-800/80 backdrop-blur-3xl before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-1px] before:w-[66%] before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-sky-300 before:to-transparent before:rounded-full">
            <div className="flex items-center mb-4">
              <Sparkles className="w-6 h-6 text-sky-600" />
              <h3 className="ml-3 font-semibold text-lg text-gray-50">
                Smart QR Scanning
              </h3>
            </div>
            <p className="text-gray-400">
              Register and identify assets instantly using QR codes — no
              paperwork, no hassle.
            </p>
          </div>

          {/* Feature Block 3 */}
          <div className="flex flex-col p-6 bg-slate-800/80 rounded-lg backdrop-blur-3xl before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-1px] before:w-[66%] before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-sky-300 before:to-transparent before:rounded-full">
            <div className="flex items-center mb-4">
              <MousePointerClick className="w-6 h-6 text-sky-600" />
              <h3 className="ml-3 font-semibold text-lg text-gray-50">
                Automated Lifecycle Management
              </h3>
            </div>
            <p className="text-gray-400">
              Track asset usage, maintenance, and retirement automatically with
              reminders and history logs.
            </p>
          </div>
        </div>

        {/* Feature Content */}
        {/* Devices Display Section */}
        <div className="relative flex justify-center items-center mt-16 pb-28">
          {/* Browser Mockup */}
          <div className="relative  w-auto max-w-full shadow-lg rounded-lg overflow-hidden">
            {/* Browser Header */}
            <div className="relative flex items-center bg-gray-800 border-b border-gray-800 rounded-t-xl py-2 px-4 ">
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
                className="w-full h-auto "
              />
            </div>
          </div>

          {/* Realistic Phone Mockup */}
          <div className="absolute bottom-0 left-0 z-20 w-64 hidden lg:block ">
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
                    className="absolute top-0 left-0 w-full h-full object-contain "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleFeatureCard;
