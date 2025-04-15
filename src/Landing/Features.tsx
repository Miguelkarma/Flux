import React from "react";
import featureimg from "@/assets/hero.png";
import { Layout, MousePointerClick, Sparkles } from "lucide-react";

const SimpleFeatureCard: React.FC = () => {
  return (
    <div className="max-w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto ">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature Block 1 */}
          <div className="flex flex-col p-6 bg-slate-800 rounded-lg">
            <div className="flex items-center mb-4">
              <Layout className="w-6 h-6 text-sky-600" />
              <h3 className="ml-3 font-semibold text-lg text-gray-50">
                All-in-one workspace
              </h3>
            </div>
            <p className="text-gray-600">
              Create a business, whether you've got a fresh idea.
            </p>
          </div>

          {/* Feature Block 2 */}
          <div className="flex flex-col p-6 bg-slate-800 rounded-lg">
            <div className="flex items-center mb-4">
              <Sparkles className="w-6 h-6 text-sky-600" />
              <h3 className="ml-3 font-semibold text-lg text-gray-50">
                Solving problems for every team
              </h3>
            </div>
            <p className="text-gray-600">
              One tool for your company to share knowledge and ship projects.
            </p>
          </div>

          {/* Feature Block 3 */}
          <div className="flex flex-col p-6 bg-slate-800 rounded-lg">
            <div className="flex items-center mb-4">
              <MousePointerClick className="w-6 h-6 text-sky-600" />
              <h3 className="ml-3 font-semibold text-lg text-gray-50">
                Automation on a whole new level
              </h3>
            </div>
            <p className="text-gray-600">
              Use automation to scale campaigns profitably and save time doing
              it.
            </p>
          </div>
        </div>

        {/* Feature Content */}
        {/* Devices Display Section */}
        <div className="relative flex justify-center items-center mt-32 pb-32">
          {/* Browser Mockup */}
          <div className="relative z-10 w-full max-w-4xl shadow-lg rounded-lg overflow-hidden">
            {/* Browser Header */}
            <div className="relative flex items-center bg-gray-100 border-b border-gray-200 rounded-t-lg py-2 px-4">
              <div className="flex gap-x-1 absolute top-1/2 left-4 -translate-y-1/2">
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
              </div>
              <div className="mx-auto text-xs text-gray-500">
                www.preline.co
              </div>
            </div>

            {/* Browser Content */}
            <div className="bg-white">
              <img
                src={featureimg}
                alt="Dashboard Interface"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Mobile Device Mockup */}
          <div className="absolute bottom-0 left-0 z-20 w-64 hidden lg:block">
            <div className="p-2 bg-gray-100 rounded-3xl shadow-lg">
              <img
                src={featureimg}
                alt="Mobile Interface"
                className="w-full h-auto rounded-2xl"
              />
            </div>

            {/* End Browser Device */}
          </div>
          {/* End Devices */}
        </div>
      </div>
    </div>
  );
};

export default SimpleFeatureCard;
