"use client";

import AgendaHomepage from "./agenda";
import ScheduleHomepage from "./schedule";
import TodoHomepage from "./todo";

export default function Homepage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <TodoHomepage />
      <AgendaHomepage />
      <ScheduleHomepage />
    </div>
  );
}
