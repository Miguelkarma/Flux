import { MenuItem } from "./constants/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type MobileMenuProps = {
  navMenu: MenuItem[];
};

const MobileMenu = ({ navMenu }: MobileMenuProps) => {
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <div>
        <ul className="mb-3">
          {navMenu.map(({ href, label }, index) => (
            <li key={index}>
              <Button asChild variant="ghost" className="w-full justify-start">
                <a
                  href={href || "#"}
                  onClick={(e) => handleScroll(e, href || "#")}
                >
                  {label}
                </a>
              </Button>
            </li>
          ))}
        </ul>
        <Separator className="bg-slate-100/20" />

        <div className="flex items-center gap-2 mt-4">
          <Button variant="ghost" className="w-full">
            Sign In
          </Button>
          <Button
            className="relative w-full  text-white bg-black border border-white/30 rounded-full transition-all hover:bg-black 
                before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-2px] before:w-[66%] before:h-[4px] before:bg-gradient-to-r before:from-transparent before:via-teal-500 before:to-transparent hover:border-teal-200 before:rounded-full"
          >
            Log In
          </Button>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
