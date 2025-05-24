import { attendanceRecordColumns } from "@/columns/attendance-records.columns";
import BgImageLayer from "@/components/bg-image-layer";
import { Calendar } from "@/components/calendar";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, coleAPI } from "@/lib/utils";
import type { PresentStudent } from "@/types/students.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

const AttendanceRecords = () => {
  const [date, setDate] = useState<Date>();
  const queryClient = useQueryClient();

  const pad = (n: number) => n.toString().padStart(2, "0");
  const getLocalDateString = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const localDateString = date
    ? getLocalDateString(date)
    : getLocalDateString(new Date());

  const { data } = useQuery({
    queryKey: ["attendances", localDateString],
    queryFn: coleAPI(`/attendances?date=${localDateString}`),
  });

  useEffect(() => {
    if (date) {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
    }
  }, [date, queryClient]);

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

        <div className="w-full mt-2 grid grid-cols-3 gap-4">
          <div className="h-8 p-4 border rounded shadow"></div>
        </div>

        <DataTable<PresentStudent>
          data={data || []}
          columns={attendanceRecordColumns}
        />
      </div>
    </div>
  );
};

export default AttendanceRecords;
