import * as XLSX from "xlsx";
import type {
  ClassAttendanceRecord,
  ClassAttendanceMatrix,
} from "@/types/class.types";

export const exportDailyAttendance = (
  data: ClassAttendanceRecord[],
  className: string,
  date: string
) => {
  const excelData = data.map((record, index) => ({
    "No.": index + 1,
    Name: record.name,
    Status: record.present === 1 ? "✓" : "✗",
    Time: record.dateTime
      ? new Date(record.dateTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      : "--:--",
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  ws["!cols"] = [
    { wch: 5 }, // No.
    { wch: 20 }, // Name
    { wch: 10 }, // Status
    { wch: 15 }, // Time
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Daily Attendance");

  const formattedDate = new Date(date)
    .toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    })
    .replace(/\//g, "-");

  const filename = `${className}_Daily_${formattedDate}.xlsx`;

  XLSX.writeFile(wb, filename);
};

export const exportAttendanceMatrix = (
  data: ClassAttendanceMatrix[],
  className: string
) => {
  const uniqueDates = [...new Set(data.map((record) => record.date))]
    .filter((date) => date !== null)
    .sort();

  const uniqueStudents = data.reduce((acc, record) => {
    if (!acc.find((student) => student.userId === record.userId)) {
      acc.push({
        userId: record.userId,
        name: record.name,
      });
    }
    return acc;
  }, [] as { userId: number; name: string }[]);

  const headers = [
    "No.",
    "Name",
    ...uniqueDates.map((date) =>
      date
        ? new Date(date).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
          })
        : ""
    ),
    "Present",
    "Absent",
  ];

  const excelData = uniqueStudents.map((student, index) => {
    const row: Record<string, string> = {
      "No.": `${(index + 1).toString()}.`,
      Name: student.name,
    };

    uniqueDates.forEach((date) => {
      if (date) {
        const attendanceRecord = data.find(
          (record) => record.userId === student.userId && record.date === date
        );
        row[
          new Date(date).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
          })
        ] = attendanceRecord
          ? attendanceRecord.present === 1
            ? "✓"
            : "✗"
          : "✗";
      }
    });

    row.Present = Object.values(row)
      .filter((value) => value === "✓")
      .length.toString();

    row.Absent = (uniqueDates.length - parseInt(row.Present)).toString();

    return row;
  });

  const dataForSheet = excelData.map((record) =>
    headers.map((header) => record[header])
  );

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([]);

  const colWidths = [
    { wch: 5 }, // No.
    { wch: 20 }, // Name
    ...uniqueDates.map(() => ({ wch: 12 })), // Date columns
    { wch: 10 }, // Present
    { wch: 10 }, // Absent
  ];
  ws["!cols"] = colWidths;

  XLSX.utils.sheet_add_aoa(ws, [["", `Total Days: ${uniqueDates.length}`]], {
    origin: "A1",
  });
  XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A2" });
  XLSX.utils.sheet_add_aoa(ws, dataForSheet, { origin: "A3" });

  XLSX.utils.book_append_sheet(wb, ws, "Attendance Matrix");

  const currentDate = new Date()
    .toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    })
    .replace(/\//g, "-");

  const filename = `${className}_AttendanceMatrix_${currentDate}.xlsx`;

  XLSX.writeFile(wb, filename);
};
