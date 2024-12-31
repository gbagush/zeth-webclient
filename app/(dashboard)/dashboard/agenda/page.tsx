"use client";

import AgendaBadge from "@/components/agenda/agenda-badge";
import CreateAgenda from "@/components/agenda/create-agenda";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CalendarViewTrigger,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
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
import useAgenda from "@/stores/agenda";
import { AgendaData } from "@/types/agenda";
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

export default function AgendaPage() {
  const [currentView, setCurrentView] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [startFilter, setStartFilter] = useState<Date>(new Date());
  const [endFilter, setEndFilter] = useState<Date>(new Date());

  const { agendas, setAgendas } = useAgenda();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    const fetchTodos = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/agenda`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAgendas(response.data.data);
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

    fetchTodos();
  }, [token]);

  useEffect(() => {
    const formatAgendas = (agendas: AgendaData[]) => {
      return agendas.map((agenda) => {
        const date = new Date(agenda.date);

        const [startHour, startMinute] = agenda.start_time
          .split(":")
          .map(Number);
        const [endHour, endMinute] = agenda.end_time.split(":").map(Number);

        const start = new Date(date.setHours(startHour, startMinute));
        const end = new Date(date.setHours(endHour, endMinute));

        return {
          id: agenda._id!,
          start: start,
          end: end,
          title: agenda.name,
        };
      });
    };

    if (agendas.length > 0) {
      setEvents(formatAgendas(agendas));
    }
  }, [agendas]);

  useEffect(() => {
    if (currentView == "year") {
      setStartFilter(startOfYear(currentDate));
      setEndFilter(endOfYear(currentDate));
    }

    if (currentView == "month") {
      setStartFilter(startOfMonth(currentDate));
      setEndFilter(endOfMonth(currentDate));
    }

    if (currentView == "week") {
      setStartFilter(startOfWeek(currentDate));
      setEndFilter(endOfWeek(currentDate));
    }

    if (currentView == "day") {
      setStartFilter(startOfDay(currentDate));
      setEndFilter(endOfDay(currentDate));
    }
  }, [currentView, currentDate]);

  const groupedAgendas = agendas.reduce(
    (acc, agenda) => {
      const date = new Date(agenda.date);

      if (date >= startFilter && date <= endFilter) {
        const dateKey = format(date, "yyyy-MM-dd");
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(agenda);
      }
      return acc;
    },
    {} as Record<string, AgendaData[]>
  );

  const sortedDates = Object.keys(groupedAgendas).sort();

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
                <BreadcrumbPage>Agenda</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="px-2">
        <div className="flex">
          <div className="w-1/5 mt-6">
            <CreateAgenda />
            <div className="flex flex-col gap-4 py-4">
              {sortedDates.map((date) => (
                <div key={date} className="flex flex-col gap-2">
                  <span className="text-medium font-semibold">
                    {format(new Date(date), "MMMM d, yyyy")}
                  </span>
                  {groupedAgendas[date].map((agenda) => (
                    <AgendaBadge key={agenda._id} agenda={agenda} />
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
                  <CalendarViewTrigger
                    view="month"
                    className="aria-[current=true]:bg-accent"
                  >
                    Month
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
                  <CalendarMonthView />
                </div>
              </div>
            </Calendar>
          </div>
        </div>
      </div>
    </>
  );
}
