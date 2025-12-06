import NewClass from "@/components/teacher/new-class";
import { Card } from "@/components/ui/card";
import { coleAPI } from "@/lib/utils";
import type { ClassData } from "@/types/class.types";
import { useQuery } from "@tanstack/react-query";
import { CalendarRange, Clock } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TeachersPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data: classes, refetch } = useQuery<ClassData[]>({
    queryKey: ["classes"],
    queryFn: coleAPI("/classes"),
  });

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-[90%] sm:w-[80%] space-y-4">
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl Nunito-Bold gradient-text">My Classes</h1>
            <p className="text-muted-foreground mt-1 Nunito-Medium">Manage your classes and attendance</p>
          </div>
          <NewClass
            refetch={refetch}
            open={open}
            close={() => setOpen((prev) => !prev)}
          />
        </div>
        {classes?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls, index) => (
              <Card
                className="p-5 cursor-pointer card-hover border-2 hover:border-primary/50 transition-all duration-300 bg-white/95 backdrop-blur-sm"
                key={index}
                onClick={() => navigate(`/class/${cls.classId}`)}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-2 items-center">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        <CalendarRange size={20} />
                      </div>
                      <h2 className="font-bold Nunito-SemiBold text-lg">
                        {cls.className.trim()}
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sm Nunito-Medium">{cls.department}{cls.year}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Clock size={16} className="text-primary" />
                    <p className="text-sm font-semibold Nunito-SemiBold text-primary">
                      {cls.time.toUpperCase()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 mt-4 border-2 border-dashed bg-white/80 backdrop-blur-sm">
            <p className="text-center text-muted-foreground Nunito-Medium">No classes found. Create your first class to get started.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeachersPage;
