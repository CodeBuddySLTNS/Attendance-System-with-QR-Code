import { Card } from "@/components/ui/card";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { QrCode, Users } from "lucide-react";
import React from "react";

const ViewClass: React.FC = () => {
  const handleScanResult = async (result: IDetectedBarcode[]) => {
    try {
      const data = JSON.parse(result[0].rawValue);
      if (!data.userId || !data?.name || !data?.courseAndYear)
        throw new Error("Invalid Format!");

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[90%] sm:w-[80%] space-y-2.5">
        <div className="mt-6 sm:mt-8 flex justify-between items-center">
          <div>SDP101 - BSIT3</div>
          <div className="flex items-center gap-2">
            <QrCode />
            <Users />
          </div>
        </div>

        <Card className="p-4 grid grid-cols-1 sm:[grid-template-columns:1.1fr_1.9fr] ">
          <div className="rounded-md">
            <h2 className="text-center text-2xl rounded py-1.5 font-bold mb-2">
              Scan QR Code
            </h2>
            <div className="">
              <div className="mx-1 rounded-md overflow-hidden">
                <Scanner
                  onScan={handleScanResult}
                  sound={true}
                  classNames={{
                    video: "scale-x-[-1] w-full object-cover",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center order-1 sm:order-2 bg-gray-100 p-6 rounded-lg shadow-sm transition hover:shadow-md">
            <div className="w-56 h-56 bg-white rounded-full overflow-hidden mb-4 shadow-md flex items-center justify-center border-2 border-gray-300">
              <img src="/images/default-icon.png" alt="" />
            </div>
            <div className="text-center">
              <h4 className="text-xl font-bold mb-2 text-gray-800">
                ------ &nbsp;------
              </h4>
              <p className="text-purple-900 font-medium">--------</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ViewClass;
