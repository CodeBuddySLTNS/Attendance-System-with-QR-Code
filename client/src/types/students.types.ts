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
  photo?: string;
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

export interface User {
  userId: number;
  name: string;
  role: "student" | "teacher" | "admin";
  departmentName?: string;
  departmentAcronym?: string;
  year?: number;
  studentId?: number | null;
}
