import React, { useState } from "react";
import { Card } from "../components/ui/card";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import PresentStudentsTabe from "../components/present-students-table";

interface PresentStudent {
  type: string;
  name: string;
  courseAndYear: string;
  date: Date;
}

const LandingPage: React.FC = () => {
  const [presentStudents, setPresentStudents] = useState<PresentStudent[]>([]);

  const handleScanResult = async (result: IDetectedBarcode[]) => {
    console.log(result[0].rawValue);
  };

  return (
    <div className="w-full h-full p-8 flex justify-center items-center bg-[#E3D095] shadow-xl">
      <Card className="w-full h-full p-4 grid grid-cols-[1fr_2fr] rounded-lg bg-gray-100">
        <Card className="p-4 rounded-lg ">
          <div className="flex flex-col gap-1.5">
            <h2 className="Nunito-Extra-Bold text-xl text-center">
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
        <Card className="p-4 rounded-lg gap-1 overflow-hidden">
          <PresentStudentsTabe />
        </Card>
      </Card>
    </div>
  );
};

export default LandingPage;
