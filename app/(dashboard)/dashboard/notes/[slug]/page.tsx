"use client";

import Link from "next/link";
import useCategories from "@/stores/categories";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import { ChevronsUpDown, icons, Save, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Icon from "@/components/shared/icon";
import { useAuth } from "@/context/authContext";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CategoryData } from "@/types/category";

const Tiptap = dynamic(() => import("@/components/notes/editor"), {
  ssr: false,
});

export default function CreateNotesPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<CategoryData>();
  const [categoryId, setcategoryId] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { token } = useAuth();
  const { toast } = useToast();

  const router = useRouter();

  const handleContentSave = async () => {
    if (!title || !selectedCategory || !content) {
      toast({
        title: "Failed create note",
        description: "Please fill all fields first.",
      });

      return;
    }

    try {
      if (slug === "create") {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/notes`,
          {
            title: title,
            category: selectedCategory?._id,
            content: content,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast({
          title: "Notes created successfully",
          description: response.data.message,
        });

        router.push(`/dashboard/notes/${response.data.data._id}`);
      } else {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/notes/${slug}`,
          {
            title: title,
            category: selectedCategory?._id,
            content: content,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast({
          title: "Note saved successfully",
          description: response.data.message,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Failed save note",
          description: error.response?.data.message || "An error occurred.",
        });
      } else {
        toast({
          title: "Failed save note",
          description: "Network error. Please try again.",
        });
      }
    }
  };

  const handleDeleteNote = async () => {
    if (slug == "create") return;
    if (!token) return;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/notes/${slug}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Note deleted successfully",
        description: response.data.message,
      });

      router.push("/dashboard/notes");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Failed delete note",
          description: error.response?.data.message || "An error occurred.",
        });
      } else {
        toast({
          title: "Failed delete note",
          description: "Network error. Please try again.",
        });
      }
    }
  };

  useEffect(() => {
    const fetchNoteData = async () => {
      if (slug == "create") return;
      if (!token) return;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/notes/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setContent(response.data.data.content);
        setTitle(response.data.data.title);
        setcategoryId(response.data.data.category);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            title: "Failed getting notes data",
            description: error.response?.data.message || "An error occurred.",
          });
        } else {
          toast({
            title: "Failed getting notes data",
            description: "Network error. Please try again.",
          });
        }
        router.push("/dashboard/notes");
      }
    };

    fetchNoteData();
  }, [token, slug]);

  useEffect(() => {
    const category = categories.find((category) => category._id == categoryId);

    setSelectedCategory(category);
  }, [categories, categoryId]);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <Link href="/dashboard/notes">Notes</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {slug === "create" ? "Create" : title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-col gap-4 mx-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Title..."
              className="h-8 w-[150px] lg:w-[300px]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-8">
                  {selectedCategory !== undefined ? (
                    <>
                      <Icon name={selectedCategory.icon} />
                      <div
                        className="w-4 h-4 rounded-sm"
                        style={{ backgroundColor: selectedCategory.color }}
                      ></div>
                      {selectedCategory.name}
                    </>
                  ) : (
                    <span>Select category</span>
                  )}
                  <ChevronsUpDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <DropdownMenuItem
                      onClick={() => setSelectedCategory(category)}
                      key={category._id}
                    >
                      <Icon name={category.icon} />
                      <div
                        className="w-4 h-4 rounded-sm"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      {category.name}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-2">
            {slug !== "create" && (
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="destructive" className="h-8">
                    <Trash />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your note from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteNote}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Button
              variant="outline"
              className="h-8"
              onClick={handleContentSave}
            >
              <Save />
              Save
            </Button>
          </div>
        </div>

        {slug !== "create" ? (
          content !== "" && (
            <Tiptap
              content={content}
              handleContentChange={(content) => setContent(content)}
            />
          )
        ) : (
          <Tiptap
            content={content}
            handleContentChange={(content) => setContent(content)}
          />
        )}
      </div>
    </>
  );
}
