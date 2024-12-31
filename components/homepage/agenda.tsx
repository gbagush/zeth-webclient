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
import useAgenda from "@/stores/agenda";
import { AgendaData } from "@/types/agenda";

export default function AgendaHomepage() {
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
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Today&apos;s Agenda</h3>
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
