export interface Exercise {
  id: string;
  name: string;
  duration: number; // in seconds
  calories: number;
  date?: Date;
  state?: 'completed' | 'cancelled' | null;
}
