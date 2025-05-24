import { attendanceRecordColumns } from "@/columns/attendance-records.columns";
import type { Department } from "@/components/add-student";
import BgImageLayer from "@/components/bg-image-layer";
import { Calendar } from "@/components/calendar";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, coleAPI } from "@/lib/utils";
import type {
  AttendanceRecords,
  StudentByDepartment,
} from "@/types/students.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface DepartmentYear {
  departmentId: string;
  departmentName: string;
  year: string;
}

const AttendanceRecords = () => {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date>();
  const [depYear, setDepYear] = useState<DepartmentYear>({
    departmentId: "",
    departmentName: "",
    year: "",
  });

  const pad = (n: number) => n.toString().padStart(2, "0");
  const getLocalDateString = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const localDateString = date
    ? getLocalDateString(date)
    : getLocalDateString(new Date());

  const { data: students } = useQuery<AttendanceRecords>({
    queryKey: ["studentsbydepartment"],
    queryFn: coleAPI(
      `/students/bydepartment?date=${localDateString}&departmentId=${parseInt(
        depYear.departmentId
      )}&year=${parseInt(depYear.year)}`
    ),
  });

  const { data: departments } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: coleAPI(`/departments`),
  });

  useEffect(() => {
    if (depYear.departmentId && depYear.year) {
      queryClient.invalidateQueries({ queryKey: ["studentsbydepartment"] });
    }
  }, [date, depYear, queryClient]);

  return (
    <div className="w-full h-full p-8">
      <BgImageLayer />
      <div className="h-full relative z-[1]">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">Attendance Records</h1>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date || new Date(), "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="w-full mt-2 grid grid-cols-2 gap-4">
          <div>
            <Select
              value={depYear.departmentId.toString()}
              onValueChange={(value) =>
                setDepYear((prev) => ({ ...prev, departmentId: value }))
              }
            >
              <SelectTrigger className="w-[300px] text-left">
                <SelectValue placeholder="Select department"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                {departments?.map((dep, index) => (
                  <SelectItem key={index} value={dep.departmentId.toString()}>
                    {dep.departmentName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={depYear.year.toString()}
              onValueChange={(value) =>
                setDepYear((prev) => ({ ...prev, year: value }))
              }
            >
              <SelectTrigger className="w-[300px] text-left">
                <SelectValue placeholder="Select department"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st year</SelectItem>
                <SelectItem value="2">2nd year</SelectItem>
                <SelectItem value="3">3rd year</SelectItem>
                <SelectItem value="4">4th year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable<StudentByDepartment>
          data={students?.students || []}
          columns={attendanceRecordColumns}
        />
      </div>
    </div>
  );
};

export default AttendanceRecords;
