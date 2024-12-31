"use client";

import { useAuth } from "@/context/authContext";
import { useToast } from "@/hooks/use-toast";
import useTodos from "@/stores/todos";
import axios from "axios";
import { useEffect, useState } from "react";
import TodoCard from "../todo/todo-card";
import { TodoData } from "@/types/todo";

export default function TodoHomepage() {
  const { toast } = useToast();
  const { token } = useAuth();

  const { todos, setTodos } = useTodos();
  const [todayTodos, setTodayTodos] = useState<TodoData[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/todo`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today

        const todaysTodos = response.data.data.filter((todo: TodoData) => {
          const todoDate = new Date(todo.due_date);
          return todoDate >= startOfDay && todoDate <= endOfDay;
        });

        setTodos(todaysTodos);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            title: "Failed getting todos",
            description: error.response?.data.detail || "An error occurred.",
          });
        } else {
          toast({
            title: "Failed getting todos",
            description: "Network error. Please try again.",
          });
        }
      }
    };

    fetchTodos();
  }, [token]);

  useEffect(() => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todaysTodos = todos.filter((todo: TodoData) => {
      const todoDate = new Date(todo.due_date);
      return todoDate >= startOfDay && todoDate <= endOfDay;
    });

    todaysTodos.sort(
      (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    );

    setTodayTodos(todaysTodos);
  }, [todos]);

  if (Array.isArray(todos) && todos.length > 0) {
    return (
      <div>
        <h3 className="text-lg font-medium mb-4">Today&apos;s Todos</h3>
        <div className="space-y-2">
          {todayTodos.map((todo) => (
            <TodoCard key={todo._id} todo={todo} />
          ))}
        </div>
      </div>
    );
  } else {
    return null;
  }
}
