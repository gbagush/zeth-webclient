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
import { ChevronsUpDown, Plus } from "lucide-react";

import Icon from "../shared/icon";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import { useAuth } from "@/context/authContext";

import useCategories from "@/stores/categories";
import { CategoryData } from "@/types/category";

import useAgenda from "@/stores/agenda";
import useSchedule from "@/stores/schedule";

const days = [
  { key: "sunday", day: "Sunday" },
  { key: "monday", day: "Monday" },
  { key: "tuesday", day: "Tuesday" },
  { key: "wednesday", day: "Wednesday" },
  { key: "thursday", day: "Thursday" },
  { key: "friday", day: "Friday" },
  { key: "saturday", day: "Saturday" },
];

export default function CreateSchedule() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<CategoryData>();

  const [selectedDay, setSelectedDay] = useState("");

  const [time, setTime] = useState({
    startHours: 0,
    startMinutes: 0,
    endHours: 0,
    endMinutes: 0,
  });

  const { schedules, setSchedules } = useSchedule();

  const { toast } = useToast();
  const { token } = useAuth();

  const handleCreateSchedule = async () => {
    if (
      !title ||
      !description ||
      !location ||
      !selectedCategory ||
      !selectedDay
    ) {
      toast({
        title: "Failed create schedule",
        description: "Fill all field first.",
      });
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/schedule`,
        {
          name: title,
          description: description,
          location: location,
          category: selectedCategory?._id,
          day: selectedDay,
          start_time: `${time.startHours}:${time.startMinutes}`,
          end_time: `${time.endHours}:${time.endMinutes}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Agenda created successfully",
        description: response.data.message || "An error occurred.",
      });

      setSchedules([...schedules, response.data.data]);

      setTitle("");
      setDescription("");
      setLocation("");
      setSelectedDay("");
      setSelectedCategory(undefined);
      setTime({
        startHours: 0,
        startMinutes: 0,
        endHours: 0,
        endMinutes: 0,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Failed create schedule",
          description: error.response?.data.detail || "An error occurred.",
        });
      } else {
        toast({
          title: "Failed create schedule",
          description: "Network error. Please try again.",
        });
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus /> Create schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create schedule</DialogTitle>
          <DialogDescription>
            Create a structured plan for your upcoming meeting.
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
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              placeholder=""
              className="col-span-3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
              Day
            </Label>
            <div className="col-span-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {selectedDay === ""
                      ? "Select day"
                      : days.find((day) => day.key === selectedDay)?.day ||
                        "Select day"}
                    <ChevronsUpDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {days.map((day) => (
                    <DropdownMenuItem
                      key={day.key}
                      onClick={() => setSelectedDay(day.key)}
                    >
                      {day.day}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Start time
            </Label>
            <div className="col-span-3 flex gap-2 w-1/2">
              <Input
                type="number"
                value={time.startHours}
                onChange={(e) =>
                  setTime({ ...time, startHours: parseInt(e.target.value) })
                }
                max={23}
                min={0}
              />
              :
              <Input
                type="number"
                value={time.startMinutes}
                onChange={(e) =>
                  setTime({ ...time, startMinutes: parseInt(e.target.value) })
                }
                max={59}
                min={0}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              End time
            </Label>
            <div className="col-span-3 flex gap-2 w-1/2">
              <Input
                type="number"
                value={time.endHours}
                onChange={(e) =>
                  setTime({ ...time, endHours: parseInt(e.target.value) })
                }
                max={23}
                min={0}
              />
              :
              <Input
                type="number"
                value={time.endMinutes}
                onChange={(e) =>
                  setTime({ ...time, endMinutes: parseInt(e.target.value) })
                }
                max={59}
                min={0}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateSchedule}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
