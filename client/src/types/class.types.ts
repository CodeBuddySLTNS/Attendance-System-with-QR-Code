export interface ClassData {
  classId: number;
  className: string;
  departmentId: string;
  department: string;
  year: number;
  time: string;
}

export interface ClassAttendanceRecord {
  userId: number;
  name: string;
  photo?: string;
  departmentAcronym: string;
  year: number;
  dateTime: string | null;
  present: 0 | 1;
  date?: string;
}

export interface ClassAttendanceMatrix {
  userId: number;
  name: string;
  photo?: string;
  departmentAcronym: string;
  year: number;
  date: string | null;
  dateTime: string | null;
  present: 0 | 1;
}
