export interface ScheduleData {
  _id?: string;
  user_id?: string;
  name: string;
  description: string;
  category: string;
  day: string;
  start_time: string;
  end_time: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}
