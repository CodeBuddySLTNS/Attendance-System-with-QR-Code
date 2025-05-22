import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, QrCode, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Student } from "@/types/students.types";

export const studentColumns = (
  QrCodeFn: (student: Student) => void,
  editFn: (student: Student) => void,
  deleteFn: (student: Student) => void
): ColumnDef<Student>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "departmentAcronym",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Course
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="uppercase text-center">
        {row.getValue("departmentAcronym")}
      </div>
    ),
  },
  {
    accessorKey: "year",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Year
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("year")}</div>
    ),
  },
  {
    id: "action",

    header: () => <div className="w-auto text-center">Action</div>,
    cell: ({ row }) => (
      <div className="w-auto flex items-center justify-center gap-2">
        <Button
          size="sm"
          className="bg-green-700 text-white hover:bg-green-600 cursor-pointer"
          onClick={() => QrCodeFn(row.original)}
        >
          <QrCode />
        </Button>
        <Button
          size="sm"
          className="cursor-pointer"
          onClick={() => editFn(row.original)}
        >
          <Edit />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="cursor-pointer"
          onClick={() => deleteFn(row.original)}
        >
          <Trash2 />
        </Button>
      </div>
    ),
  },
];
