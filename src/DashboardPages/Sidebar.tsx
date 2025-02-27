import { User } from "firebase/auth";
import { FC } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  LaptopMinimal,
  User2,
  ChevronUp,
  ExternalLink,
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

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
}

const items = [
  { title: "Dashboard", url: "/Dashboard", icon: Home },
  { title: "Assets", url: "/Assets", icon: LaptopMinimal },
  { title: "API", url: "/Settings", icon: ExternalLink },
  { title: "External API", url: "/ExternalAPI", icon: ExternalLink },
];

const Sidebar: FC<SidebarProps> = ({ user, onLogout }) => {
  return (
    <UISidebar
      collapsible="icon"
      variant="floating"
      className="sidebar group flex flex-col h-screen w-[50px] md:w-[250px] transition-all duration-300 overflow-hidden"
    >
      <SidebarContent className="flex-grow rounded-xl flex-shrink-0 backdrop-blur-md backdrop-opacity-70">
        <SidebarGroup>
          {/* Sidebar Logo */}
          <SidebarGroupLabel className="transition-opacity group-[.collapsed]:opacity-0 text-2xl font-bold text-white gap-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Techtrack
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="py-2 text-[1.2em] font-medium "
                >
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      `relative flex items-center gap-2 px-4 py-2 rounded-full transition ${
                        isActive
                          ? "after:absolute after:inset-0 after:-z-10 after:w-full after:h-full after:rounded-full after:bg-gradient-to-t after:from-teal-500 after:to-transparent border border-teal-500 text-white"
                          : "w-auto py-2 px-4 text-white bg-black border border-white/50 transition-all hover:bg-black before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-2px] before:w-[85%] before:h-[3px] before:bg-gradient-to-r before:from-transparent before:via-teal-500 before:to-transparent hover:border-teal-300"
                      }`
                    }
                  >
                    <item.icon strokeWidth={2} size={17} className="min-w-4" />
                    <span className="transition-all duration-300 overflow-hidden whitespace-nowrap max-w-[200px] group-[.collapsed]:max-w-0 group-[.collapsed]:opacity-0">
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
      <SidebarFooter className="rounded-b-xl flex-shrink-0 bg-black/30 backdrop-blur-md backdrop-opacity-75">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 w-full text-left text-white">
                  <User2 className="min-w-5" size={19} />
                  <ChevronUp className="ml-auto transition-opacity group-[.collapsed]:opacity-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <span className="transition-opacity group-[.collapsed]:opacity-0 whitespace-nowrap justify-center text-sm text-white p-2 w-full bg-zinc-700/50 flex rounded-md font-bold">
                  {user?.displayName || "User"}
                </span>
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
