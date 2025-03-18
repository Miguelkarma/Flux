import { MenuItem } from "./constants/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type MobileMenuProps = {
  navMenu: MenuItem[];
};

const MobileMenu = ({ navMenu }: MobileMenuProps) => {
  return (
    <>
      <div>
        <ul className="mb-3">
          {navMenu.map(({ href, label }, index) => (
            <li key={index}>
              <Button asChild variant="ghost" className="w-full justify-start">
                <a href={href || "#"}>{label}</a>
              </Button>
            </li>
          ))}
        </ul>
        <Separator className="bg-muted-foreground/20" />

        <div className="flex items-center gap-2 mt-4">
          <Button variant="ghost" className="w-full">
            Sign In
          </Button>
          <Button className="w-full">Log In</Button>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
