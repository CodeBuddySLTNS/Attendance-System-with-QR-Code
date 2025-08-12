import NewClass from "@/components/teacher/new-class";
import { Card } from "@/components/ui/card";
import { coleAPI } from "@/lib/utils";
import type { ClassData } from "@/types/class.types";
import { useQuery } from "@tanstack/react-query";
import { CalendarRange, Clock } from "lucide-react";
import React, { useState } from "react";

const TeachersPage: React.FC = () => {
  const [open, setOpen] = useState(false);

  const { data: classes, refetch } = useQuery<ClassData[]>({
    queryKey: ["classes"],
    queryFn: coleAPI("/classes"),
  });

  return (
    <div className="w-full h-dvh flex flex-col items-center">
      <div className="w-[90%] sm:w-[80%] space-y-2.5">
        <div className="mt-6 sm:mt-8 flex justify-between">
          <h1 className="text-2xl Nunito-Bold">My Classes</h1>
          <NewClass
            refetch={refetch}
            open={open}
            close={() => setOpen((prev) => !prev)}
          />
        </div>
        {classes?.length ? (
          classes.map((cls, index) => (
            <Card className="p-4" key={index}>
              <div className="flex justify-between">
                <h2 className="flex gap-2 items-center font-bold">
                  <CalendarRange />
                  {cls.className.trim()} - {cls.department + cls.year}
                </h2>
                <p className="flex gap-2 items-center text-sm">
                  <Clock size={16} />
                  {cls.time.toUpperCase()}
                </p>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-4 mt-4">
            <p className="text-center text-gray-500">No classes found.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeachersPage;
