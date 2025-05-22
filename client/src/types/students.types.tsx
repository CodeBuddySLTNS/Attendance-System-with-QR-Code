export interface PresentStudent {
  type?: string;
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
