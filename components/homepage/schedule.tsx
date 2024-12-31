"use client";
import axios from "axios";

import { useEffect, useState } from "react";

import {
  Calendar,
  CalendarDayView,
  CalendarEvent,
} from "@/components/ui/full-calendar";

import { useAuth } from "@/context/authContext";
import { useToast } from "@/hooks/use-toast";
import useSchedule from "@/stores/schedule";
import { ScheduleData } from "@/types/schedule";
import { format } from "date-fns";

export default function ScheduleHomepage() {
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

  useEffect(() => {
    const formatSchedules = (schedules: ScheduleData[]) => {
      const events: CalendarEvent[] = [];
      const currentDate = new Date();

      const viewStart = new Date(currentDate.setHours(0, 0, 0, 0));
      const viewEnd = new Date(currentDate.setHours(23, 59, 59, 999));

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
  }, [schedules]);
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Today&apos;s Schedule</h3>
      <Calendar events={events} view="day">
        <div className="h-dvh py-6 flex flex-col">
          <div className="flex-1 overflow-auto px-6 relative">
            <CalendarDayView />
          </div>
        </div>
      </Calendar>
    </div>
  );
}
