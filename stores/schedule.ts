import { ScheduleData } from "@/types/schedule";
import { create } from "zustand";

interface SchedulesState {
  schedules: ScheduleData[];
  setSchedules: (schedules: ScheduleData[]) => void;
}

const useSchedule = create<SchedulesState>((set) => ({
  schedules: [],
  setSchedules: (schedules) => set({ schedules }),
}));

export default useSchedule;
