"use client";

import dayjs from "dayjs";

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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Calendar1, CalendarDays, CalendarRange } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CreateTodo from "@/components/todo/create-todo";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/authContext";
import useTodos from "@/stores/todos";
import TodoCard from "@/components/todo/todo-card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { endOfDay, endOfWeek, startOfDay, startOfWeek } from "date-fns";
import { TodoData } from "@/types/todo";

export default function ToDoPage() {
  const { todos, setTodos } = useTodos();

  const [date, setDate] = useState<DateRange | undefined>(() => ({
    from: startOfWeek(new Date()),
    to: endOfWeek(new Date()),
  }));

  const { toast } = useToast();
  const { token } = useAuth();

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

        setTodos(response.data.data);
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

  const filteredTodos = useMemo(() => {
    if (!date?.from || !date?.to || !Array.isArray(todos)) return [];

    return todos.filter((todo) => {
      const dueDate = new Date(todo.due_date);
      return dueDate >= startOfDay(date.from!) && dueDate <= endOfDay(date.to!);
    });
  }, [todos, date]);

  const groupedTodos = useMemo(() => {
    if (!filteredTodos.length) return [];

    const completedTodos: TodoData[] = [];
    const activeTodos: TodoData[] = [];

    // Separate completed and active todos
    filteredTodos.forEach((todo) => {
      if (todo.status === "done") {
        completedTodos.push(todo);
      } else {
        activeTodos.push(todo);
      }
    });

    // Group active todos by date
    const activeGroups = activeTodos.reduce((acc: any[], todo) => {
      const date = new Date(todo.due_date);
      const dateStr = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const existingGroup = acc.find((group) => group.date === dateStr);
      if (existingGroup) {
        existingGroup.todos.push(todo);
      } else {
        acc.push({
          date: dateStr,
          todos: [todo],
        });
      }
      return acc;
    }, []);

    // Sort active todos groups by date
    const sortedActiveGroups = activeGroups.sort((a, b) => {
      return (
        new Date(a.todos[0].due_date).getTime() -
        new Date(b.todos[0].due_date).getTime()
      );
    });

    // Add completed todos as the last group if there are any
    if (completedTodos.length > 0) {
      sortedActiveGroups.push({
        date: "Has been done",
        todos: completedTodos.sort(
          (a, b) =>
            new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        ),
      });
    }

    return sortedActiveGroups;
  }, [filteredTodos]);

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
              <BreadcrumbItem>
                <BreadcrumbPage>ToDo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="px-4">
        <div className="flex items-center justify-end gap-2">
          <DatePickerWithRange value={date} onChange={setDate} />

          <CreateTodo />
        </div>
        <div className="flex flex-col w-full gap-4 py-4">
          {groupedTodos.map((group) => (
            <div key={group.date} className="space-y-3">
              <h2 className="text-lg font-semibold">{group.date}</h2>
              <div className="space-y-2">
                {group.todos.map((todo: TodoData) => (
                  <TodoCard key={todo._id} todo={todo} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
