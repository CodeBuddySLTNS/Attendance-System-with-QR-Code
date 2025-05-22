export interface PresentStudent {
  type?: string;
  userId: number;
  name: string;
  courseAndYear: string;
  date: Date;
}

export interface Student {
  userId: number;
  studentId: number;
  name: string;
  departmentName: string;
  departmentAcronym: string;
  year: number;
}
