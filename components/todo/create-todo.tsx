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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronsUpDown, icons, Plus } from "lucide-react";

import Icon from "../shared/icon";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import { useAuth } from "@/context/authContext";

import useCategories from "@/stores/categories";
import { CategoryData } from "@/types/category";
import { DateTimePicker24h } from "../ui/date-time-picker-24";
import useTodos from "@/stores/todos";

export default function CreateTodo() {
  const { todos, setTodos } = useTodos();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<CategoryData>();

  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>(
    undefined
  );

  const { toast } = useToast();
  const { token } = useAuth();

  const handleCreateTodo = async () => {
    if (!title || !description || !selectedCategory || !selectedDateTime) {
      toast({
        title: "Failed create todo",
        description: "Please fill all fields first.",
      });

      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/todo`,
        {
          name: title,
          description: description,
          category: selectedCategory?._id,
          status: "not-started",
          due_date: selectedDateTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Todo created successfully",
        description: response.data.message || "An error occurred.",
      });

      setTodos([...todos, response.data.data]);

      setTitle("");
      setDescription("");
      setSelectedCategory(undefined);
      setSelectedDateTime(undefined);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Failed create todo",
          description: error.response?.data.detail || "An error occurred.",
        });
      } else {
        toast({
          title: "Failed create todo",
          description: "Network error. Please try again.",
        });
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-8">
          <Plus /> Create todo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create todo</DialogTitle>
          <DialogDescription>
            Add a new task to your todo list to keep track of your tasks
            effectively.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              placeholder=""
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder=""
              className="col-span-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
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
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Due date
            </Label>
            <div className="col-span-3">
              <DateTimePicker24h
                value={selectedDateTime}
                onChange={(date) => setSelectedDateTime(date)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateTodo}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
