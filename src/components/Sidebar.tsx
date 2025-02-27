import { User } from "firebase/auth";
import { FC } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Settings,
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
  { title: "Settings", url: "/Settings", icon: Settings },
  { title: "External API", url: "/ExternalAPI", icon: ExternalLink },
];

const Sidebar: FC<SidebarProps> = ({ user, onLogout }) => {
  return (
    <UISidebar
      collapsible="icon"
      variant="floating"
      className="sidebar group flex flex-col h-full "
    >
      <SidebarContent className="flex-grow  rounded-xl flex-shrink-0  backdrop-blur-md backdrop-opacity-70">
        <SidebarGroup>
          <SidebarGroupLabel className="transition group-[.collapsed]:opacity-0 text-2xl font-bold text-white gap-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent  ">
             Techtrack
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="py-2 text-[1.2em] font-medium"
                >
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      `flex items-center gap-5 px-2 py-2 rounded-md transition ${
                        isActive
                          ? "rounded-lg transition transform -translate-y-1  -translate-x-1 shadow-[4px_4px_0_0_#40E0D0] border border-teal-500"
                          : "rounded-lg transition hover:-translate-y-1 -translate-x-1 hover:shadow-[4px_4px_0_0_#40E0D0] hover:border hover:border-teal-500"
                      }`
                    }
                  >
                    <item.icon strokeWidth={2} size={17} className="min-w-4" />
                    <span className="transition-opacity group-[.collapsed]:opacity-0 whitespace-nowrap">
                      {item.title}
                    </span>
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

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
