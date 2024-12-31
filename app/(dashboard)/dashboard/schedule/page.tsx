"use client";

import AgendaBadge from "@/components/agenda/agenda-badge";
import CreateSchedule from "@/components/schedule/create-schedule";
import ScheduleBadge from "@/components/schedule/schedule-badge";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Calendar,
  CalendarViewTrigger,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarWeekView,
  CalendarEvent,
} from "@/components/ui/full-calendar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/authContext";
import { useToast } from "@/hooks/use-toast";
import useSchedule from "@/stores/schedule";
import { ScheduleData } from "@/types/schedule";
import axios from "axios";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const days = [
  { key: "sunday", day: "Sunday" },
  { key: "monday", day: "Monday" },
  { key: "tuesday", day: "Tuesday" },
  { key: "wednesday", day: "Wednesday" },
  { key: "thursday", day: "Thursday" },
  { key: "friday", day: "Friday" },
  { key: "saturday", day: "Saturday" },
];

export default function SchedulePage() {
  const [currentView, setCurrentView] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [startFilter, setStartFilter] = useState<Date>(new Date());
  const [endFilter, setEndFilter] = useState<Date>(new Date());

  const { schedules, setSchedules } = useSchedule();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/schedule`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSchedules(response.data.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            title: "Failed getting agendas",
            description: error.response?.data.detail || "An error occurred.",
          });
        } else {
          toast({
            title: "Failed getting agendas",
            description: "Network error. Please try again.",
          });
        }
      }
    };

    fetchSchedules();
  }, [token]);

  const groupSchedulesByDay = (schedules: ScheduleData[]) => {
    return schedules.reduce(
      (acc, schedule) => {
        const dayKey = schedule.day.toLowerCase();
        if (!acc[dayKey]) {
          acc[dayKey] = [];
        }
        acc[dayKey].push(schedule);
        return acc;
      },
      {} as Record<string, ScheduleData[]>
    );
  };

  const getFilteredSchedules = (
    schedules: ScheduleData[],
    currentView: string,
    currentDate: Date
  ) => {
    const groupedSchedules = groupSchedulesByDay(schedules);

    if (currentView === "day") {
      const dayKey = format(currentDate, "EEEE").toLowerCase();
      return days
        .filter(({ key }) => key === dayKey)
        .map(({ key, day }) => ({
          day,
          schedules: groupedSchedules[key] || [],
        }))
        .filter(({ schedules }) => schedules.length > 0);
    }

    return days
      .map(({ key, day }) => ({
        day,
        schedules: groupedSchedules[key] || [],
      }))
      .filter(({ schedules }) => schedules.length > 0);
  };

  const filteredSchedules = getFilteredSchedules(
    schedules,
    currentView,
    currentDate
  );

  useEffect(() => {
    const formatSchedules = (schedules: ScheduleData[]) => {
      const events: CalendarEvent[] = [];
      const currentDate = new Date();

      const viewStart = startFilter;
      const viewEnd = endFilter;

      schedules.forEach((schedule) => {
        let date = new Date(viewStart);

        while (date <= viewEnd) {
          const dayName = format(date, "EEEE").toLowerCase();

          if (dayName === schedule.day.toLowerCase()) {
            const [startHour, startMinute] = schedule.start_time
              .split(":")
              .map(Number);
            const [endHour, endMinute] = schedule.end_time
              .split(":")
              .map(Number);

            const start = new Date(date);
            start.setHours(startHour, startMinute);

            const end = new Date(date);
            end.setHours(endHour, endMinute);

            events.push({
              id: schedule._id!,
              start,
              end,
              title: schedule.name,
            });
          }

          date.setDate(date.getDate() + 1);
        }
      });

      return events;
    };

    if (schedules.length > 0) {
      setEvents(formatSchedules(schedules));
    }
  }, [schedules, startFilter, endFilter]);

  // Add the filter effect from your agenda code
  useEffect(() => {
    if (currentView === "year") {
      setStartFilter(startOfYear(currentDate));
      setEndFilter(endOfYear(currentDate));
    }
    if (currentView === "month") {
      setStartFilter(startOfMonth(currentDate));
      setEndFilter(endOfMonth(currentDate));
    }
    if (currentView === "week") {
      setStartFilter(startOfWeek(currentDate));
      setEndFilter(endOfWeek(currentDate));
    }
    if (currentView === "day") {
      setStartFilter(startOfDay(currentDate));
      setEndFilter(endOfDay(currentDate));
    }
  }, [currentView, currentDate]);

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
                <BreadcrumbPage>Schedule</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="px-2">
        <div className="flex">
          <div className="w-1/5 mt-6">
            <CreateSchedule />
            <div className="flex flex-col gap-4 py-4">
              {filteredSchedules.map(({ day, schedules }) => (
                <div key={day} className="flex flex-col gap-2">
                  <span className="text-medium font-semibold">{day}</span>
                  {schedules.map((schedule) => (
                    <ScheduleBadge key={schedule._id} schedule={schedule} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="w-4/5">
            <Calendar
              events={events}
              onChangeDate={setCurrentDate}
              onChangeView={setCurrentView}
            >
              <div className="h-dvh py-6 flex flex-col">
                <div className="flex px-6 items-center gap-2 mb-6">
                  <CalendarViewTrigger
                    className="aria-[current=true]:bg-accent"
                    view="day"
                  >
                    Day
                  </CalendarViewTrigger>
                  <CalendarViewTrigger
                    view="week"
                    className="aria-[current=true]:bg-accent"
                  >
                    Week
                  </CalendarViewTrigger>

                  <span className="flex-1" />

                  <CalendarCurrentDate />

                  <CalendarPrevTrigger>
                    <ChevronLeft size={20} />
                    <span className="sr-only">Previous</span>
                  </CalendarPrevTrigger>

                  <CalendarTodayTrigger>Today</CalendarTodayTrigger>

                  <CalendarNextTrigger>
                    <ChevronRight size={20} />
                    <span className="sr-only">Next</span>
                  </CalendarNextTrigger>
                </div>

                <div className="flex-1 overflow-auto px-6 relative">
                  <CalendarDayView />
                  <CalendarWeekView />
                </div>
              </div>
            </Calendar>
          </div>
        </div>
      </div>
    </>
  );
}
