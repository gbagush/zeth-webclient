"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "../ui/textarea";

import useCategories from "@/stores/categories";
import { TodoData } from "@/types/todo";
import dayjs from "dayjs";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { CheckCheck, Eye, TimerOff, TimerReset } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { CategoryData } from "@/types/category";
import Icon from "../shared/icon";
import CategoryBadge from "../shared/category-badge";

export default function TodoDetails({ todo }: { todo: TodoData }) {
  const { categories } = useCategories();

  const [category, setCategory] = useState<CategoryData>();

  useEffect(() => {
    const category = categories.find(
      (category) => category._id == todo.category
    );

    setCategory(category);
  }, [categories]);

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="icon">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Todo details</DialogTitle>
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
              value={todo.name}
              readOnly
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
              value={todo.description}
              readOnly
            />
          </div>
          {category !== undefined && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <div className="flex items-center gap-2 text-sm border py-2 px-3 rounded-md">
                  <CategoryBadge category={category} />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <div className="col-span-3">
              <div className="flex items-center gap-2 text-sm border py-2 px-3 rounded-md">
                {todo.status === "not-started" && (
                  <span className="flex gap-2 items-center text-sm">
                    <TimerOff size={16} /> Not started
                  </span>
                )}
                {todo.status === "ongoing" && (
                  <span className="flex gap-2 items-center text-sm">
                    <TimerReset size={16} /> On going
                  </span>
                )}
                {todo.status === "done" && (
                  <span className="flex gap-2 items-center text-sm">
                    <CheckCheck size={16} /> Done
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="due-date" className="text-right">
              Due date
            </Label>
            <div className="col-span-3">
              <Input
                id="due-date"
                placeholder=""
                className="col-span-3"
                value={dayjs(todo.due_date).format("MMM D, YYYY [at] HH:mm")}
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="created-at" className="text-right">
              Created at
            </Label>
            <div className="col-span-3">
              <Input
                id="created-at"
                placeholder=""
                className="col-span-3"
                value={dayjs(todo.created_at).format("MMM D, YYYY [at] HH:mm")}
                readOnly
              />
            </div>
          </div>
          {todo.updated_at !== undefined && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="updated-at" className="text-right">
                Updated at
              </Label>
              <div className="col-span-3">
                <Input
                  id="updated-at"
                  placeholder=""
                  className="col-span-3"
                  value={dayjs(todo.updated_at).format(
                    "MMM D, YYYY [at] HH:mm"
                  )}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
