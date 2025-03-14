import { User } from "firebase/auth";
import { FC } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  LaptopMinimal,
  ChevronUp,
  ExternalLink,
  Banknote,
} from "lucide-react";
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@radix-ui/react-separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
}

const items = [
  { title: "Dashboard", url: "/Dashboard", icon: Home },
  { title: "Assets", url: "/Assets", icon: LaptopMinimal },
  { title: "Exchange", url: "/Exchange", icon: Banknote },
  { title: "Coming Soon", url: "/ExternalAPI", icon: ExternalLink },
];

const Sidebar: FC<SidebarProps> = ({ user, onLogout }) => {
  return (
    <UISidebar
      collapsible="icon"
      variant="floating"
      className="sidebar group flex flex-col h-screen transition-all duration-300 overflow-hidden"
    >
      <SidebarContent className="flex-grow rounded-xl flex-shrink-0 backdrop-blur-md backdrop-opacity-70">
        <SidebarGroup>
          {/* Sidebar Logo */}
          <SidebarGroupLabel className="transition-opacity group-[.collapsed]:opacity-0 text-2xl font-bold gap-2 bg-gradient-to-r from-primary to-muted bg-clip-text text-transparent mt-2 ">
            Techtrack
          </SidebarGroupLabel>
          <Separator className="my-4 h-[1px] w-full bg-teal-300/60" />

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className=" py-2 text-[1.1em] font-medium "
                >
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      `flex items-center gap-2 p-1 w-full 
                        transition-colors duration-200 ease-in-out bg-gradient-to-r before:from-transparent before:via-teal-500 before:to-transparent 
                        ${
                          isActive
                            ? "text-[hsl(177,70%,70%)] bg-gradient-to-r before:from-transparent before:via-teal-500 before:to-transparent "
                            : "text-[hsl(177,70%,90%)] hover:text-teal-500"
                        }
                        before:absolute before:bottom-[-2px] before:left-0 before:w-0 before:h-[2px] before:bg-gradient-to-r before:from-teal-500  before:via-teal-500 before:to-transparent before:transition-all before:duration-300 hover:before:w-full before:rounded-full `
                    }
                  >
                    <item.icon
                      strokeWidth={2}
                      className="min-w-4 transition-colors"
                    />
                    <span className="transition-all  overflow-hidden whitespace-nowrap max-w-[200px] group-[.collapsed]:max-w-0 group-[.collapsed]:opacity-0">
                      {item.title}
                    </span>
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="rounded-b-md flex-shrink-0 bg-transparent backdrop-blur-md backdrop-opacity-75 hover:bg-accent">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2  w-full text-left">
                  <Avatar className="w-8 h-8 border-2 -translate-x-1 ">
                    <AvatarImage src={user?.photoURL || ""} alt="User Avatar" />
                    <AvatarFallback>
                      {user?.displayName?.charAt(0) || "User"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="transition-opacity group-[.collapsed]:opacity-0 whitespace-nowrap justify-start text-sm  flex  font-medium">
                    {user?.displayName || "User"}
                  </span>
                  <ChevronUp className="ml-auto transition-opacity group-[.collapsed]:opacity-0 text-[hsl(177,70%,90%)]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </UISidebar>
  );
};

export default Sidebar;
