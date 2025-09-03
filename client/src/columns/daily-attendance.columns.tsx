import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import config from "../../system.config.json";
interface ClassAttendanceRecord {
  userId: number;
  name: string;
  photo?: string;
  departmentAcronym: string;
  year: number;
  dateTime: string | null;
  present: 0 | 1;
  date?: string;
}

export const dailyAttendanceColumns: ColumnDef<ClassAttendanceRecord>[] = [
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border rounded-full overflow-hidden bg-gray-100">
          <img
            src={
              row.original?.photo
                ? `${
                    config.isProduction ? config.prodServer : config.devServer
                  }${row.original.photo}`
                : "/images/default-icon.png"
            }
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
    header: () => <div className="text-center font-semibold">Time</div>,
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
