import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import type { StudentAttendance } from "@/types/students.types";

export const createAttendanceMatrixColumns = (
  sortedDates: string[],
  sortBy: "name" | "userId",
  setSortBy: (sort: "name" | "userId") => void
): ColumnDef<StudentAttendance>[] => {
  const columns: ColumnDef<StudentAttendance>[] = [
    {
      accessorKey: "userId",
      header: () => {
        return (
          <div className="w-full h-auto text-center p-0 font-semibold">No.</div>
        );
      },
      cell: ({ row }) => {
        return <div className="text-center font-medium">{row.index + 1}.</div>;
      },
    },
    {
      accessorKey: "name",
      header: () => {
        return (
          <Button
            variant="ghost"
            onClick={() => setSortBy(sortBy === "name" ? "userId" : "name")}
            className="h-auto p-0 font-semibold"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
            <img
              src={row.original.photo || "/images/default-icon.png"}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{row.getValue("name")}</div>
          </div>
        </div>
      ),
    },
  ];

  // Add date columns
  sortedDates.forEach((date) => {
    const dateObj = new Date(date);
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    const year = dateObj.getFullYear().toString().padStart(2, "0");
    const headerText = `${month}/${day}/${year.split("").slice(-2).join("")}`;

    columns.push({
      accessorKey: `attendance_${date}`,
      header: () => <div className="text-center">{headerText}</div>,
      cell: ({ row }) => {
        const attendance = row.original.attendanceByDate[date];
        return (
          <div className="text-center">
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                attendance === "present"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {attendance === "present" ? "Present" : "Absent"}
            </span>
          </div>
        );
      },
    });
  });

  return columns;
};
