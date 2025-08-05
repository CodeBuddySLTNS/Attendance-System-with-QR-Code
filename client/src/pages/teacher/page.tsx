import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarRange, Clock } from "lucide-react";
import React from "react";

const TeachersPage: React.FC = () => {
  return (
    <div className="w-full h-dvh flex flex-col items-center">
      <div className="w-[90%] sm:w-[80%] space-y-2.5">
        <div className="mt-6 sm:mt-8 flex justify-between">
          <h1 className="text-2xl Nunito-Bold">My Classes</h1>
          <Button size="sm">New Class</Button>
        </div>
        <Card className="p-4">
          <div className="flex justify-between">
            <h2 className="flex gap-2 items-center font-bold">
              <CalendarRange />
              SDP101 TTH - BSIT1
            </h2>
            <p className="flex gap-2 items-center text-sm">
              <Clock size={16} />
              8:00 AM - 9:30 AM
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between">
            <h2 className="flex gap-2 items-center font-bold">
              <CalendarRange />
              SDP101 - BSIT 1
            </h2>
            <p className="flex gap-2 items-center text-sm">
              <Clock size={16} />
              TTH 8:00 AM - 9:30 AM
            </p>
          </div>
        </Card>{" "}
        <Card className="p-4">
          <div className="flex justify-between">
            <h2 className="flex gap-2 items-center font-bold">
              <CalendarRange />
              SDP101 - BSIT 1
            </h2>
            <p className="flex gap-2 items-center text-sm">
              <Clock size={16} />
              TTH 8:00 AM - 9:30 AM
            </p>
          </div>
        </Card>{" "}
        <Card className="p-4">
          <div className="flex justify-between">
            <h2 className="flex gap-2 items-center font-bold">
              <CalendarRange />
              SDP101 - BSIT 1
            </h2>
            <p className="flex gap-2 items-center text-sm">
              <Clock size={16} />
              TTH 8:00 AM - 9:30 AM
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeachersPage;
