export interface TodoData {
  _id?: string;
  user_id?: string;
  name: string;
  description: string;
  category: string;
  status: "not-started" | "ongoing" | "done";
  due_date: string;
  created_at?: string;
  updated_at?: string;
}
