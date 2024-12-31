"use client";
import axios from "axios";

import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { icons, Plus, Trash } from "lucide-react";

import categoryIcons from "@/config/category-icons";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import { ColorPicker } from "../ui/color-picker";
import { isColorDark } from "@/lib/utils";
import { useAuth } from "@/context/authContext";

import useCategories from "@/stores/categories";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import Icon from "../shared/icon";
import { CategoryData } from "@/types/category";

interface CategoryMenuProps {
  item: CategoryData;
}

export function CategoryMenu({ item }: CategoryMenuProps) {
  const [categoryData, setCategoryData] = useState<CategoryData>({
    name: "",
    description: "",
    icon: "Pencil",
    color: "#C5C6C7",
  });

  const [confirm, setConfirm] = useState("");

  const { categories, setCategories } = useCategories();
  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    setCategoryData(item);
  }, [item]);

  const handleEditCategory = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/category/${item._id}`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Category updated successfully",
        description: response.data.message,
      });

      const updatedCategories = categories.map((category) =>
        category._id === item._id
          ? {
              ...category,
              name: categoryData.name,
              description: categoryData.description,
              icon: categoryData.icon,
              color: categoryData.color,
            }
          : category
      );

      setCategories(updatedCategories);

      setCategoryData({
        name: "",
        description: "",
        icon: "Pencil",
        color: "#C5C6C7",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Failed update category",
          description: error.response?.data.message || "An error occurred.",
        });
      } else {
        toast({
          title: "Failed update category",
          description: "Network error. Please try again.",
        });
      }
    }
  };

  const handleDeletecategory = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/category/${item._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Category deleted successfully",
        description: response.data.message,
      });

      const updatedCategories = categories.filter(
        (category) => category._id !== item._id
      );

      setCategories(updatedCategories);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Failed delete category",
          description: error.response?.data.message || "An error occurred.",
        });
      } else {
        toast({
          title: "Failed delete category",
          description: "Network error. Please try again.",
        });
      }
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <SidebarMenuItem key={item._id}>
            <SidebarMenuButton asChild>
              <div>
                <Icon name={item.icon} />
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span>{item.name}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Category</DialogTitle>
            <DialogDescription>
              Organize your tasks and streamline your workflow by categorizing
              your activities.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex justify-center">
              <Popover>
                <PopoverTrigger>
                  <div
                    className={`flex h-12 w-12 rounded-lg items-center justify-center`}
                    style={{ backgroundColor: categoryData.color }}
                  >
                    <Icon
                      name={categoryData.icon}
                      color={
                        isColorDark(categoryData.color) ? "white" : "black"
                      }
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="max-h-64 overflow-y-auto p-4 grid grid-cols-6 gap-2 x-100">
                  {categoryIcons.map((icon, index) => (
                    <button
                      key={index}
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        setCategoryData({ ...categoryData, icon: icon })
                      }
                    >
                      <Icon name={icon} />
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Category Name"
                className="col-span-3"
                value={categoryData.name}
                onChange={(e) =>
                  setCategoryData({ ...categoryData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Description"
                className="col-span-3"
                value={categoryData.description}
                onChange={(e) =>
                  setCategoryData({
                    ...categoryData,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Color
              </Label>
              <ColorPicker
                onChange={(v) => {
                  setCategoryData({
                    ...categoryData,
                    color: v,
                  });
                }}
                value={categoryData.color}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Delete
            </Label>
            <div className="w-full">
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button size="sm" variant="destructive">
                    <Trash /> Delete category
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action is irreversible. Deleting this category will
                      permanently remove all associated data from our servers.
                      <br />
                      Please write{" "}
                      <span className="font-semibold text-foreground">
                        &quot;{item.name}&quot;
                      </span>{" "}
                      to continue.
                    </AlertDialogDescription>
                    <div>
                      <Input
                        className="mt-4"
                        placeholder="Confirm"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                      />
                    </div>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={confirm !== item.name}
                      onClick={handleDeletecategory}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={handleEditCategory}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
