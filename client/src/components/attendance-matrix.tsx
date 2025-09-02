import React, { useState } from "react";
import DataTable from "@/components/data-table";
import { createAttendanceMatrixColumns } from "@/columns/attendance-matrix.columns";

interface ClassAttendanceMatrix {
  userId: number;
  name: string;
  photo?: string;
  departmentAcronym: string;
  year: number;
  date: string | null;
  dateTime: string | null;
  present: 0 | 1;
}

interface AttendanceMatrixProps {
  data: ClassAttendanceMatrix[];
}

interface StudentAttendance {
  userId: number;
  name: string;
  photo?: string;
  departmentAcronym: string;
  year: number;
  attendanceByDate: Record<string, "present" | "absent">;
}

const AttendanceMatrix: React.FC<AttendanceMatrixProps> = ({ data }) => {
  const [sortBy, setSortBy] = useState<"name" | "userId">("name");

  // Group data by student and create attendance matrix
  const studentAttendanceMap = new Map<number, StudentAttendance>();
  const allDates = new Set<string>();

  // Process the data to group by student and collect all dates
  data.forEach((record) => {
    if (record.date) {
      allDates.add(record.date);
    }

    if (!studentAttendanceMap.has(record.userId)) {
      studentAttendanceMap.set(record.userId, {
        userId: record.userId,
        name: record.name,
        photo: record.photo,
        departmentAcronym: record.departmentAcronym,
        year: record.year,
        attendanceByDate: {},
      });
    }

    if (record.date) {
      studentAttendanceMap.get(record.userId)!.attendanceByDate[record.date] =
        record.present ? "present" : "absent";
    }
  });

  // Convert to array and sort
  const students = Array.from(studentAttendanceMap.values()).sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return a.userId - b.userId;
  });

  // Sort dates
  const sortedDates = Array.from(allDates).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Create columns using the new function
  const columns = createAttendanceMatrixColumns(sortedDates, sortBy, setSortBy);

  return (
    <div className="w-full overflow-x-auto">
      <DataTable<StudentAttendance> data={students} columns={columns} />
    </div>
  );
};

export default AttendanceMatrix;
