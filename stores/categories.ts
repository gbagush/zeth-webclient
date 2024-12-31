import { create } from "zustand";
import { CategoryData } from "@/types/category";

interface CategoriesState {
  categories: CategoryData[];
  setCategories: (categories: CategoryData[]) => void;
}

const useCategories = create<CategoriesState>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
}));

export default useCategories;
