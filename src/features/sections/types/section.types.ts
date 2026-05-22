export interface Section {
  id: string;
  course_id: string;
  title: string;
  position?: number;
  created_at?: string;
}

export interface CreateSectionInput {
  course_id: string;
  title: string;
  position?: number;
}

export interface UpdateSectionInput {
  title?: string;
  position?: number;
}
