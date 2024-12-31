import { icons } from "lucide-react";

export interface CategoryData {
  _id?: string;
  user_id?: string;
  name: string;
  description: string;
  icon: keyof typeof icons;
  color: string;
  created_at?: string;
  updated_at?: string;
}
