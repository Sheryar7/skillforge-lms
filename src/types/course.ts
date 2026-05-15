export type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  instructor_id: string;
  instructor?: string;
  price: number; 
};