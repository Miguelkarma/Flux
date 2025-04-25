import { Button } from "@/components/ui/button";
import { footerData } from "./constants/constants";

export default function Footer() {
  return (
    <>
      <footer className="section !pb-0">
        <div className="landing-container">
          {/* Top Border */}
          <p className="border-t border-gray-600/50"></p>

          {/* Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center py-6 gap-4">
            {/* Flux Logo */}
            <Button className="text-2xl font-bold bg-gradient-to-t from-sky-100 via-sky-300 to-cyan-900 bg-clip-text text-transparent rounded-lg transition-all duration-300 hover:shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-teal-200 hover:border hover:border-slate-600">
              Flux
            </Button>

            {/* Copyright - Responsive */}
            <div className="flex flex-col px-3 md:px-5 py-2 bg-slate-800/80 rounded-full backdrop-blur-3xl relative text-center md:text-left text-sm md:text-base before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-1px] before:w-[66%] before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-sky-300 before:to-transparent before:rounded-full text-gray-50/90">
              <p>
                <strong>© 2025 Miguelkarma. All rights reserved.</strong>
              </p>
            </div>

            {/* Social Links */}
            <ul className="flex gap-5">
              {footerData.socialLinks.map(({ href, icon }, index) => (
                <li key={index}>
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Border */}
          <p className="border-t border-gray-600/10"></p>
        </div>
      </footer>
    </>
  );
}
