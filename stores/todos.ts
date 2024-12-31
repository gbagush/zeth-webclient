import { create } from "zustand";
import { TodoData } from "@/types/todo";

interface TodosState {
  todos: TodoData[];
  setTodos: (todos: TodoData[]) => void;
}

const useTodos = create<TodosState>((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
}));

export default useTodos;
