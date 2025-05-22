import React, { useState } from "react";
import { Card } from "../components/ui/card";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import PresentStudentsTabe from "../components/present-students-table";
import type { PresentStudent } from "../types/students.types";
import BgImageLayer from "@/components/bg-image-layer";

const LandingPage: React.FC = () => {
  const [presentStudents, setPresentStudents] = useState<PresentStudent[]>([]);

  const handleScanResult = async (result: IDetectedBarcode[]) => {
    try {
      const data = JSON.parse(result[0].rawValue);
      if (!data.userId || !data?.name || !data?.courseAndYear)
        throw new Error("Invalid Format!");

      const presentValue: PresentStudent = {
        type: "in",
        userId: data.userId,
        name: data.name,
        courseAndYear: data.courseAndYear,
        date: new Date(),
      };

      setPresentStudents((prev) => [...prev, presentValue]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full p-8 flex justify-center items-center bg-gray-400 shadow-xl">
      <Card className="w-full h-full p-4 grid grid-cols-[1fr_2fr] rounded-lg bg-gray-100">
        <Card className="p-4 rounded-lg ">
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
        </Card>
        <Card className="p-4 rounded-lg gap-1 overflow-hidden relative">
          <BgImageLayer />
          <PresentStudentsTabe data={presentStudents} />
        </Card>
      </Card>
    </div>
  );
};

export default LandingPage;
