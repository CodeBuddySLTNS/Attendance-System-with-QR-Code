import React, { useState } from "react";
import DataTable from "@/components/data-table";
import { createAttendanceMatrixColumns } from "@/columns/attendance-matrix.columns";
import type { AttendanceMatrixProps } from "@/types/class.types";
import type { StudentAttendance } from "@/types/students.types";

const AttendanceMatrix: React.FC<AttendanceMatrixProps> = ({ data }) => {
  const [sortBy, setSortBy] = useState<"name" | "userId">("name");

  // group by student
  const studentAttendanceMap = new Map<number, StudentAttendance>();
  const allDates = new Set<string>();

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

  const students = Array.from(studentAttendanceMap.values()).sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return a.userId - b.userId;
  });

  const sortedDates = Array.from(allDates).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const columns = createAttendanceMatrixColumns(sortedDates, sortBy, setSortBy);

  return (
    <div className="w-full overflow-x-auto">
      <DataTable<StudentAttendance> data={students} columns={columns} />
    </div>
  );
};

export default AttendanceMatrix;
