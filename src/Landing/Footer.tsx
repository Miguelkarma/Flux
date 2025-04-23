import { Button } from "@/components/ui/button";
import { footerData } from "./constants/constants";

export default function Footer() {
  return (
    <footer className="section !pb-0">
      <div className="landing-container">
        {/* Top Border */}
        <p className="border-t border-gray-600/50"></p>

        {/* Footer Content */}
        <div className="flex justify-between items-center py-6">
          {/* Flux Logo */}
          <Button className="text-2xl font-bold bg-gradient-to-t from-sky-100 via-sky-300 to-cyan-900 bg-clip-text text-transparent rounded-lg transition-all duration-300 hover:shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-teal-200 hover:border hover:border-slate-600">
            Flux
          </Button>

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
  );
}
