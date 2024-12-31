"use client";
import axios from "axios";

import { useEffect, useState } from "react";

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
import { ChevronsUpDown, icons, Pencil, Plus } from "lucide-react";

import Icon from "../shared/icon";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import { useAuth } from "@/context/authContext";

import useCategories from "@/stores/categories";
import { CategoryData } from "@/types/category";
import { DateTimePicker24h } from "../ui/date-time-picker-24";
import useTodos from "@/stores/todos";
import { TodoData } from "@/types/todo";

export default function EditTodo({ todo }: { todo: TodoData }) {
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
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/todo/${todo._id}`,
        {
          name: title,
          description: description,
          category: selectedCategory._id,
          due_date: selectedDateTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Todo edited successfully",
        description: response.data.message || "An error occurred.",
      });

      const updatedTodos = todos.map((todoData) =>
        todoData._id === todo._id
          ? {
              ...todoData,
              name: title,
              description: description,
              category: selectedCategory._id!,
              due_date: selectedDateTime.toISOString(),
            }
          : todoData
      );

      setTodos(updatedTodos);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Failed update todo",
          description: error.response?.data.detail || "An error occurred.",
        });
      } else {
        toast({
          title: "Failed update todo",
          description: "Network error. Please try again.",
        });
      }
    }
  };

  useEffect(() => {
    setTitle(todo.name),
      setDescription(todo.description),
      setSelectedDateTime(new Date(todo.due_date));
  }, [todo]);

  useEffect(() => {
    const category = categories.find(
      (category) => category._id == todo.category
    );

    setSelectedCategory(category);
  }, [categories]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit todo</DialogTitle>
          <DialogDescription>
            Keep track of your tasks effectively using Todo
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
