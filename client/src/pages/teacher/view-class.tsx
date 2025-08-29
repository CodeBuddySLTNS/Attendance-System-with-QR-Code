import { Card } from "@/components/ui/card";
import { coleAPI } from "@/lib/utils";
import type { ClassData } from "@/types/class.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { QrCode, Users, CheckSquare } from "lucide-react";
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Student } from "@/types/students.types";
// removed unused Select components
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ViewClass: React.FC = () => {
  const { classId } = useParams();

  const queryClient = useQueryClient();
  const [mode, setMode] = useState<"scan" | "students" | "attendance">("scan");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [showAllDays, setShowAllDays] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [validatedStudent, setValidatedStudent] = useState<
    (Student & { photo?: string; departmentAcronym?: string }) | null
  >(null);

  const { data: cls, isLoading } = useQuery<ClassData | undefined>({
    queryKey: ["class", classId],
    queryFn: coleAPI(`/classes/${classId}`),
    enabled: Boolean(classId),
  });

  const { data: studentsInClass } = useQuery<Student[]>({
    queryKey: ["class-students", classId],
    queryFn: coleAPI(`/classes/${classId}/students`),
    enabled: Boolean(classId) && mode === "students",
  });

  const { data: attendanceByDate } = useQuery<
    Array<Student & { dateTime: string | null; present: 0 | 1; date?: string }>
  >({
    queryKey: ["class-attendance-date", classId, selectedDate],
    queryFn: coleAPI(`/classes/${classId}/attendance?date=${selectedDate}`),
    enabled: Boolean(classId) && mode === "attendance" && !showAllDays,
  });

  const { data: attendanceAll } = useQuery<
    Array<Student & { dateTime: string; date: string }>
  >({
    queryKey: ["class-attendance-all", classId],
    queryFn: coleAPI(`/classes/${classId}/attendance/all`),
    enabled: Boolean(classId) && mode === "attendance" && showAllDays,
  });

  const { data: allStudents } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: coleAPI("/students"),
    enabled: mode === "students",
  });

  const { mutateAsync: addStudentToClass, isPending: adding } = useMutation({
    mutationFn: coleAPI(`/classes/${classId}/students`, "POST"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["class-students", classId],
      });
    },
  });

  const { mutateAsync: removeStudentFromClass } = useMutation({
    mutationFn: async (userId: number) =>
      await coleAPI(`/classes/${classId}/students/${userId}`, "DELETE")({}),
    onSuccess: async () => {
      toast.success("Student removed from class");
      await queryClient.invalidateQueries({
        queryKey: ["class-students", classId],
      });
    },
  });
  const handleScanResult = async (result: IDetectedBarcode[]) => {
    try {
      const data = JSON.parse(result[0].rawValue);
      if (!data.userId) throw new Error("Invalid Format!");

      const student = await coleAPI(
        `/classes/${classId}/students/${data.userId}/validate`
      )({});
      setValidatedStudent(student);
    } catch (error) {
      console.error(error);
      toast.error("Invalid QR code or student not in this class");
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[90%] sm:w-[80%] space-y-2.5">
        <div className="mt-6 sm:mt-8 flex justify-between items-center">
          <div>
            {isLoading && "Loading..."}
            {!isLoading && cls && (
              <span>
                {cls.className?.trim()} - {cls.department}
                {cls.year}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={mode === "scan" ? "default" : "secondary"}
              size="sm"
              onClick={() => setMode("scan")}
            >
              <QrCode />
            </Button>
            <Button
              variant={mode === "students" ? "default" : "secondary"}
              size="sm"
              onClick={() => setMode("students")}
            >
              <Users />
            </Button>
            <Button
              variant={mode === "attendance" ? "default" : "secondary"}
              size="sm"
              onClick={() => setMode("attendance")}
            >
              <CheckSquare />
            </Button>
          </div>
        </div>
        {mode === "scan" && (
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
                <img
                  src={validatedStudent?.photo || "/images/default-icon.png"}
                  alt=""
                />
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold mb-2 text-gray-800">
                  {validatedStudent?.name || "------  ------"}
                </h4>
                <p className="text-purple-900 font-medium">
                  {validatedStudent
                    ? `${validatedStudent.departmentAcronym} ${validatedStudent.year}`
                    : "--------"}
                </p>
              </div>
            </div>
          </Card>
        )}

        {mode === "students" && (
          <Card className="p-4 space-y-3">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                <div className="flex-1">
                  <label className="text-sm">Search students</label>
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Type a name or student ID"
                  />
                </div>
                <Button
                  disabled={!selectedStudentIds.length || adding}
                  onClick={async () => {
                    try {
                      await Promise.all(
                        selectedStudentIds.map((id) =>
                          addStudentToClass({ userId: parseInt(id) })
                        )
                      );
                      toast.success("Students added to class");
                      setSelectedStudentIds([]);
                    } catch {
                      toast.error("Failed to add students");
                    }
                  }}
                >
                  Add Selected
                </Button>
              </div>

              <div className="max-h-80 overflow-y-auto border rounded p-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {allStudents
                    ?.filter((s) => {
                      const q = search.toLowerCase();
                      return (
                        s.name.toLowerCase().includes(q) ||
                        s.studentId?.toString()?.includes(q)
                      );
                    })
                    .map((s) => {
                      const checked = selectedStudentIds.includes(
                        s.userId.toString()
                      );
                      return (
                        <label
                          key={s.userId}
                          className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${
                            checked ? "bg-blue-50" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              setSelectedStudentIds((prev) =>
                                e.target.checked
                                  ? [...prev, s.userId.toString()]
                                  : prev.filter(
                                      (id) => id !== s.userId.toString()
                                    )
                              );
                            }}
                          />
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                            <img src={s.photo || "/images/default-icon.png"} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{s.name}</div>
                            <div className="text-[11px] text-gray-600">
                              {s.departmentAcronym} {s.year}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="border-t pt-3">
              {!studentsInClass?.length && (
                <p className="text-center text-gray-500">
                  No students in this class.
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto">
                {studentsInClass?.map((s) => (
                  <div
                    key={s.userId}
                    className="flex items-center gap-3 p-3 border rounded-md"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                      <img src={s.photo || "/images/default-icon.png"} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-gray-600">
                        {s.departmentAcronym} {s.year}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        try {
                          await removeStudentFromClass(s.userId);
                        } catch {
                          toast.error("Failed to remove student");
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {mode === "attendance" && (
          <Card className="p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
              <div className="flex items-center gap-2">
                <label className="text-sm">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border rounded px-2 py-1"
                  disabled={showAllDays}
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showAllDays}
                  onChange={(e) => setShowAllDays(e.target.checked)}
                />
                Show all days
              </label>
            </div>

            {!showAllDays ? (
              <div className="border-t pt-3">
                {!attendanceByDate?.length && (
                  <p className="text-center text-gray-500">No students.</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto">
                  {attendanceByDate?.map((s) => (
                    <div
                      key={s.userId}
                      className="flex items-center gap-3 p-3 border rounded-md"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                        <img src={s.photo || "/images/default-icon.png"} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{s.name}</div>
                        <div className="text-xs text-gray-600">
                          {s.departmentAcronym} {s.year}
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        {s.present ? (
                          <span className="text-green-600">Present</span>
                        ) : (
                          <span className="text-gray-500">Absent</span>
                        )}
                        <div className="text-gray-600">
                          {s.dateTime
                            ? new Date(s.dateTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "--:--"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-t pt-3">
                {!attendanceAll?.length && (
                  <p className="text-center text-gray-500">No records.</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto">
                  {attendanceAll?.map((s, idx) => (
                    <div
                      key={`${s.userId}-${idx}`}
                      className="flex items-center gap-3 p-3 border rounded-md"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                        <img src={s.photo || "/images/default-icon.png"} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{s.name}</div>
                        <div className="text-xs text-gray-600">
                          {s.departmentAcronym} {s.year}
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <div className="text-gray-600">
                          {new Date(s.dateTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ViewClass;
