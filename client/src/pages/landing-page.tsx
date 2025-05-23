import React, { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import PresentStudentsTabe from "../components/present-students-table";
import BgImageLayer from "@/components/bg-image-layer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { coleAPI } from "@/lib/utils";
import { toast } from "sonner";
import type { AxiosError } from "axios";

interface TimeData {
  hours: string;
  minutes: string;
  seconds: string;
  amPm: string;
}

const LandingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [time, setTime] = useState<TimeData>({
    hours: "00",
    minutes: "00",
    seconds: "00",
    amPm: "AM",
  });

  const { data: attendances } = useQuery({
    queryKey: ["attendances"],
    queryFn: coleAPI(
      "/attendances?date=" + new Date().toISOString().split("T")[0]
    ),
  });

  const { mutateAsync: addAttendance } = useMutation({
    mutationFn: coleAPI("/attendances/add", "POST"),
    onError: (e: AxiosError<{ message?: string }>) => {
      if (e.response?.data?.message === "Already exists!") {
        return toast.error("Attendance already exists!");
      } else if (e.response?.data?.message) {
        return toast.error(e.response.data.message);
      }
      toast.error("Failed to add attendance");
    },
  });

  const handleScanResult = async (result: IDetectedBarcode[]) => {
    try {
      const data = JSON.parse(result[0].rawValue);
      if (!data.userId || !data?.name || !data?.courseAndYear)
        throw new Error("Invalid Format!");

      try {
        await addAttendance({
          type: "in",
          userId: data.userId,
          dateTime: new Date()
            .toLocaleString("sv-SE", { timeZone: "Asia/Manila" })
            .replace("T", " "),
          date: new Date(),
        });

        queryClient.invalidateQueries({ queryKey: ["attendances"] });
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const timeData = {
        hours: (currentTime.getHours() % 12 || 12).toString().padStart(2, "0"),
        minutes: currentTime.getMinutes().toString().padStart(2, "0"),
        seconds: currentTime.getSeconds().toString().padStart(2, "0"),
        amPm: currentTime.getHours() >= 12 ? "PM" : "AM",
      };

      setTime(timeData);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full p-8 flex justify-center items-center bg-gray-300 shadow-xl">
      <Card className="w-full h-full p-4 grid grid-cols-[1fr_2fr] rounded-lg bg-gray-100">
        <Card className="p-4 rounded-lg grid grid-cols-1 grid-rows-[max-content_1fr] gap-2">
          <div className="flex flex-col gap-1.5">
            <h2 className="font-bold text-xl text-center">
              Scan your QR Code here for your attendance
            </h2>
            <Scanner
              onScan={handleScanResult}
              sound={true}
              classNames={{
                video: "scale-x-[-1] w-full object-cover",
              }}
            />
          </div>
          <div className="h-full flex items-center justify-center gap-2 p-1 text-2xl font-bold border rounded shadow-md">
            <span>{time.hours}</span>:<span>{time.minutes}</span>:
            <span>{time.seconds}</span>
            <span>{time.amPm}</span>
          </div>
        </Card>
        <Card className="p-4 rounded-lg gap-1 overflow-hidden relative">
          <BgImageLayer />
          <PresentStudentsTabe data={attendances || []} />
        </Card>
      </Card>
    </div>
  );
};

export default LandingPage;
