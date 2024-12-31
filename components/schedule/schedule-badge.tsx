"use client";

import { AgendaData } from "@/types/agenda";
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
import { Badge } from "../ui/badge";
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

import Icon from "../shared/icon";
import { useEffect, useState } from "react";
import useCategories from "@/stores/categories";
import { CategoryData } from "@/types/category";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ChevronsUpDown, Trash } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useAuth } from "@/context/authContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import useSchedule from "@/stores/schedule";
import { ScheduleData } from "@/types/schedule";

const days = [
  { key: "sunday", day: "Sunday" },
  { key: "monday", day: "Monday" },
  { key: "tuesday", day: "Tuesday" },
  { key: "wednesday", day: "Wednesday" },
  { key: "thursday", day: "Thursday" },
  { key: "friday", day: "Friday" },
  { key: "saturday", day: "Saturday" },
];

export default function ScheduleBadge({
  schedule,
}: {
  schedule: ScheduleData;
}) {
  const [enableEdit, setEnableEdit] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  const { categories } = useCategories();

  const [category, setCategory] = useState<CategoryData>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryData>();

  const [time, setTime] = useState({
    startHours: 0,
    startMinutes: 0,
    endHours: 0,
    endMinutes: 0,
  });

  const { schedules, setSchedules } = useSchedule();

  const { toast } = useToast();
  const { token } = useAuth();

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const category = categories.find(
      (category) => category._id == schedule.category
    );

    setCategory(category);
    setSelectedCategory(category);
  }, [categories, schedule]);

  useEffect(() => {
    setTitle(schedule.name);
    setDescription(schedule.description);
    setLocation(schedule.location);
    setSelectedDay(schedule.day);

    setTime({
      startHours: parseInt(schedule.start_time.split(":")[0]),
      startMinutes: parseInt(schedule.start_time.split(":")[1]),
      endHours: parseInt(schedule.end_time.split(":")[0]),
      endMinutes: parseInt(schedule.end_time.split(":")[1]),
    });
  }, [schedule]);

  const handleUpdateSchedule = async () => {
    if (
      !title ||
      !description ||
      !location ||
      !selectedDay ||
      !selectedCategory
    ) {
      toast({
        title: "Failed update schedule",
        description: "Fill all fields first.",
      });
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/schedule/${schedule._id}`,
        {
          name: title,
          description: description,
          location: location,
          category: selectedCategory._id,
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
        title: "Schedule updated successfully",
        description: response.data.message || "An error occurred.",
      });

      const updatedSchedules = schedules.map((scheduleData) =>
        scheduleData._id === schedule._id
          ? {
              ...scheduleData,
              name: title,
              description: description,
              location: location,
              category: selectedCategory?._id!,
              day: selectedDay,
              start_time: `${time.startHours}:${time.startMinutes}`,
              end_time: `${time.endHours}:${time.endMinutes}`,
            }
          : scheduleData
      );

      setSchedules(updatedSchedules);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Failed update schedule",
          description: error.response?.data.details || "An error occurred.",
        });
      } else {
        toast({
          title: "Failed update schedule",
          description: "Network error. Please try again.",
        });
      }
    }
  };

  const handleDeleteSchedule = async () => {
    if (!token) return;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/schedule/${schedule._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Schedule deleted successfully",
        description: response.data.message,
      });

      const updatedSchedule = schedules.filter(
        (scheduleData) => scheduleData._id !== schedule._id
      );

      setSchedules(updatedSchedule);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Failed delete schedule",
          description: error.response?.data.detail || "An error occurred.",
        });
      } else {
        toast({
          title: "Failed delete schedule",
          description: "Network error. Please try again.",
        });
      }
    }
  };

  if (category !== undefined) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Badge
            key={schedule._id}
            variant="outline"
            className={`mr-2 cursor-pointer`}
            style={{
              backgroundColor: `${category.color}26`,
              color: category.color,
            }}
          >
            <Icon name={category.icon} size={12} className="mr-2" />
            {schedule.name} ({formatTime(schedule.start_time)} -{" "}
            {formatTime(schedule.end_time)})
          </Badge>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule</DialogTitle>
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
                readOnly={!enableEdit}
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
                readOnly={!enableEdit}
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
                readOnly={!enableEdit}
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
                          onClick={() => {
                            if (enableEdit) setSelectedCategory(category);
                          }}
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
                  readOnly={!enableEdit}
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
                  readOnly={!enableEdit}
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
                  readOnly={!enableEdit}
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
                  readOnly={!enableEdit}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Delete
            </Label>
            <div className="w-full">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={!enableEdit}>
                    <Trash /> Delete schedule
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSchedule}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <DialogFooter>
            <div className="flex w-full justify-start">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable-editing"
                  checked={enableEdit}
                  onCheckedChange={() => setEnableEdit(!enableEdit)}
                />
                <label
                  htmlFor="enable-editing"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Enable edit
                </label>
              </div>
            </div>
            <Button
              type="submit"
              onClick={handleUpdateSchedule}
              disabled={!enableEdit}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  } else {
    return null;
  }
}
