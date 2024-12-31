import { create } from "zustand";
import { AgendaData } from "@/types/agenda";

interface AgendaState {
  agendas: AgendaData[];
  setAgendas: (agendas: AgendaData[]) => void;
}

const useAgenda = create<AgendaState>((set) => ({
  agendas: [],
  setAgendas: (agendas) => set({ agendas }),
}));

export default useAgenda;
