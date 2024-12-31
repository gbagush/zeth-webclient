export interface AgendaData {
  _id?: string;
  user_id?: string;
  name: string;
  description: string;
  category: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}
