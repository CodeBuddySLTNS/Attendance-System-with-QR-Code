import { Button } from "@/components/ui/button";
import type { ClassAttendanceRecord } from "@/types/class.types";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

interface ClassAttendanceAll {
  userId: number;
  name: string;
  photo?: string;
  departmentAcronym: string;
  year: number;
  dateTime: string;
  date: string;
}

export const classAttendanceByDateColumns: ColumnDef<ClassAttendanceRecord>[] =
  [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
            />
          </div>
          <div>
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="text-sm text-gray-600">
              {row.original.departmentAcronym} {row.original.year}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "present",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full text-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("present") ? (
            <span className="text-green-700 font-medium">Present</span>
          ) : (
            <span className="text-red-500 font-medium">Absent</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "dateTime",
      header: "Time",
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("dateTime") ? (
            <span className="text-sm">
              {new Date(row.getValue("dateTime")).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          ) : (
            <span className="text-gray-400">--:--</span>
          )}
        </div>
      ),
    },
  ];

export const classAttendanceAllColumns: ColumnDef<ClassAttendanceAll>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
          <img src={row.original.photo || "/images/default-icon.png"} alt="" />
        </div>
        <div>
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-sm text-gray-600">
            {row.original.departmentAcronym} {row.original.year}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        <span className="text-sm">
          {new Date(row.getValue("date")).toLocaleDateString()}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "dateTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        <span className="text-sm">
          {new Date(row.getValue("dateTime")).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    ),
  },
];
