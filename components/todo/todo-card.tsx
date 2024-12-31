"use client";

import dayjs from "dayjs";

import { TodoData } from "@/types/todo";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCategories from "@/stores/categories";
import { useEffect, useState } from "react";
import { CategoryData } from "@/types/category";
import CategoryBadge from "../shared/category-badge";
import {
  CheckCheck,
  ChevronsUpDown,
  Clock,
  EllipsisVertical,
  Eye,
  Pencil,
  TimerOff,
  TimerReset,
  Trash,
} from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/authContext";
import useTodos from "@/stores/todos";
import TodoDetails from "./todo-details";
import EditTodo from "./edit-todo";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../ui/alert-dialog";

export default function TodoCard({ todo }: { todo: TodoData }) {
  const { categories } = useCategories();
  const { todos, setTodos } = useTodos();

  const [category, setCategory] = useState<CategoryData>();

  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    const category = categories.find(
      (category) => category._id == todo.category
    );

    setCategory(category);
  }, [categories, todos]);

  const handleUpdateTodoStatus = async (status: TodoData["status"]) => {
    if (!token) return;
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/todo/${todo._id}`,
        {
          name: todo.name,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Todo updated successfully",
        description: response.data.message,
      });

      const updatedTodos = todos.map((todoData) =>
        todoData._id === todo._id ? { ...todoData, status } : todoData
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

  const handleDeleteTodo = async () => {
    if (!token) return;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/todo/${todo._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Todo deleted successfully",
        description: response.data.message,
      });

      const updatedTodos = todos.filter(
        (todoData) => todoData._id !== todo._id
      );
      setTodos(updatedTodos);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Failed delete todo",
          description: error.response?.data.detail || "An error occurred.",
        });
      } else {
        toast({
          title: "Failed delete todo",
          description: "Network error. Please try again.",
        });
      }
    }
  };

  useEffect(() => {
    console.log(todos);
  }, [todos]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <CardTitle>{todo.name}</CardTitle>
            <CardDescription>
              {category !== undefined && <CategoryBadge category={category} />}
            </CardDescription>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <div className="text-sm">
                {dayjs(todo.due_date).format("MMM D, YYYY [at] HH:mm")}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" size="sm">
                    {todo.status === "not-started" && <TimerOff />}
                    {todo.status === "ongoing" && <TimerReset />}
                    {todo.status === "done" && <CheckCheck />}

                    <ChevronsUpDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleUpdateTodoStatus("not-started")}
                  >
                    <TimerOff /> Not Started
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleUpdateTodoStatus("ongoing")}
                  >
                    <TimerReset /> On Going
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleUpdateTodoStatus("done")}
                  >
                    <CheckCheck /> Done
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <TodoDetails todo={todo} />
              <EditTodo todo={todo} />
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="destructive" size="icon">
                    <Trash />
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
                    <AlertDialogAction onClick={handleDeleteTodo}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
