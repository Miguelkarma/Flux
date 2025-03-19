import { footerData } from "./constants/constants";

export default function Footer() {
  return (
    <footer className="section !pb-0">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-2 gap-y-10 lg:grid-cols-4">
          <span className="text-2xl font-bold bg-gradient-to-t from-teal-200 via-teal-400 to-cyan-800 bg-clip-text text-transparent">
            Flux
          </span>

          <div className="grid grid-cols-2 gap-x-2 gap-y-8 text-sm sm:grid-cols-4 lg:col-span-3">
            {footerData.links.map(({ title, items }, index) => (
              <ul key={index}>
                <p className="mb-4">{title}</p>
                {items.map(({ href, label }, index) => (
                  <li key={index} className="text-muted-foreground">
                    <a
                      href={href}
                      className="inline-block py-1 transition-colors hover:text-primary"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <p className="flex justify-between mt-12 border-t border-gray-600/10 py-6">
          {footerData.copyright}
        </p>

        <div>
          <ul className="flex gap-5">
            {footerData.socialLinks.map(({ href, icon }, index) => (
              <li key={index}>
                <a href={href} target="_blank">
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
