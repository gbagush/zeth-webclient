"use client";
import axios from "axios";

import { useState } from "react";

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
import { icons, Plus } from "lucide-react";

import categoryIcons from "@/config/category-icons";
import Icon from "../shared/icon";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import { ColorPicker } from "../ui/color-picker";
import { isColorDark } from "@/lib/utils";
import { useAuth } from "@/context/authContext";

import useCategories from "@/stores/categories";
import { CategoryData } from "@/types/category";

export function AddCategory() {
  const [isOpen, setIsOpen] = useState(false);

  const [categoryData, setCategoryData] = useState<CategoryData>({
    name: "",
    description: "",
    icon: "Pencil",
    color: "#C5C6C7",
  });
  const { categories, setCategories } = useCategories();
  const { toast } = useToast();
  const { token } = useAuth();

  const handleAddCategory = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/category`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Category created successfully",
        description: response.data.message,
      });

      setIsOpen(false);
      setCategories([...categories, response.data.data]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Failed create category",
          description: error.response?.data.message || "An error occurred.",
        });
      } else {
        toast({
          title: "Failed create category",
          description: "Network error. Please try again.",
        });
      }
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Plus size={16} className="cursor-pointer hover:text-foreground" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
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
                    color={isColorDark(categoryData.color) ? "white" : "black"}
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
        <DialogFooter>
          <Button type="submit" onClick={handleAddCategory}>
            Add category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
