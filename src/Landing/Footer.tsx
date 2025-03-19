import { footerData } from "./constants/constants";

export default function Footer() {
  return (
    <footer className="section !pb-0">
      <div className="container">
        {/* Top Border */}
        <p className="border-t border-gray-600/10"></p>

        {/* Footer Content */}
        <div className="flex justify-between items-center py-6">
          {/* Flux Logo */}
          <span className="text-2xl font-bold bg-gradient-to-t from-teal-200 via-teal-400 to-cyan-800 bg-clip-text text-transparent">
            Flux
          </span>

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
