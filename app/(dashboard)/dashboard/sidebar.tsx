"use client";

import * as React from "react";
import {
  AudioWaveform,
  CalendarDays,
  CalendarRange,
  Command,
  GalleryVerticalEnd,
  Home,
  icons,
  ListCheck,
  NotebookPen,
} from "lucide-react";
import { NavUser } from "@/components/navigations/sidebar-profile";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { SidebarItemSingle } from "@/components/navigations/sidebar-item-single";
import { AddCategory } from "@/components/sidebar/add-category";
import axios from "axios";
import { CategoryMenu } from "@/components/sidebar/category-menu";
import useCategories from "@/stores/categories";
import { SidebarBrand } from "@/components/navigations/sidebar-brand";

interface CategoryData {
  _id?: string;
  name: string;
  description: string;
  icon: keyof typeof icons;
  color: string;
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  projects: [
    {
      name: "Home",
      url: "#",
      icon: Home,
    },
    {
      name: "ToDo",
      url: "#",
      icon: ListCheck,
    },
    {
      name: "Agenda",
      url: "#",
      icon: CalendarDays,
    },
    {
      name: "Schedule",
      url: "#",
      icon: CalendarRange,
    },
    {
      name: "Notes",
      url: "#",
      icon: NotebookPen,
    },
  ],
};

const sidebarItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "ToDo",
    url: "/dashboard/todo",
    icon: ListCheck,
  },
  {
    title: "Agenda",
    url: "/dashboard/agenda",
    icon: CalendarDays,
  },
  {
    title: "Schedule",
    url: "/dashboard/schedule",
    icon: CalendarRange,
  },
  {
    title: "Notes",
    url: "/dashboard/notes",
    icon: NotebookPen,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { categories, setCategories } = useCategories();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] =
    React.useState<CategoryData>();

  const { status, token, user, logout } = useAuth();

  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out",
    });

    router.push("/");
  };

  React.useEffect(() => {
    const fetchCategories = async () => {
      if (status == "logout" || !token) {
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/category`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCategories(response.data.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            title: "Login failed",
            description: error.response?.data.message || "An error occurred.",
          });
        } else {
          toast({
            title: "Login failed",
            description: "Network error. Please try again.",
          });
        }
      }
    };

    fetchCategories();
  }, [status]);

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarBrand />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {sidebarItems.map((item, index) => (
                <SidebarItemSingle key={index} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>
              <div className="flex justify-between items-center w-full">
                <div className="text-left">Categories</div>
                <div className="text-right">
                  <AddCategory />
                </div>
              </div>
            </SidebarGroupLabel>
            <SidebarMenu>
              {categories.map((category) => (
                <CategoryMenu
                  key={category._id}
                  item={category}
                  // setSelectedCategory={setSelectedCategory}
                  // setIsEditDialogOpen={setIsEditDialogOpen}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {user !== null && <NavUser user={user} logout={handleLogout} />}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* {selectedCategory && (
        <EditCategoryDialog
          category={selectedCategory}
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
        />
      )} */}
    </>
  );
}
