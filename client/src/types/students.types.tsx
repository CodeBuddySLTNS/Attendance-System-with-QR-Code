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

export interface StudentByDepartment {
  userId: number;
  name: string;
  studentId: number | null;
  isPresent: boolean;
  attendance: {
    attendanceId: number;
    type: string;
    dateTime: string;
    date: string;
  };
}

export interface AttendanceRecords {
  departmentName: string;
  year: number;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  students: StudentByDepartment[];
}
