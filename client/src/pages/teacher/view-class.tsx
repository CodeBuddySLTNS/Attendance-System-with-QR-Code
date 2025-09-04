import { Card } from "@/components/ui/card";
import { coleAPI } from "@/lib/utils";
import type {
  ClassAttendanceMatrix,
  ClassAttendanceRecord,
  ClassData,
} from "@/types/class.types";
import config from "../../../system.config.json";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  Scanner,
  type IDetectedBarcode,
  useDevices,
} from "@yudiel/react-qr-scanner";
import {
  QrCode,
  Users,
  CheckSquare,
  ArrowRight,
  CameraOff,
  Download,
} from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Student } from "@/types/students.types";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AttendanceMatrix from "@/components/attendance-matrix";
import DataTable from "@/components/data-table";
import { dailyAttendanceColumns } from "@/columns/daily-attendance.columns";
import {
  exportDailyAttendance,
  exportAttendanceMatrix,
} from "@/lib/excel-export";

interface TimeData {
  hours: string;
  minutes: string;
  seconds: string;
  amPm: string;
}

const ViewClass: React.FC = () => {
  const { classId } = useParams();

  const queryClient = useQueryClient();
  const [mode, setMode] = useState<"scan" | "students" | "attendance">("scan");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  const [time, setTime] = useState<TimeData>({
    hours: "00",
    minutes: "00",
    seconds: "00",
    amPm: "AM",
  });

  const [toggleAdd, setToggleAdd] = useState(false);
  const [showAllDays, setShowAllDays] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [validatedStudent, setValidatedStudent] = useState<
    (Student & { photo?: string; departmentAcronym?: string }) | null
  >(null);

  // Camera device management
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(
    undefined
  );
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [devicesInitialized, setDevicesInitialized] = useState(false);
  const devices = useDevices();

  // Memoize constraints to prevent unnecessary re-renders
  const scannerConstraints = React.useMemo(() => {
    if (selectedDeviceId) {
      return { deviceId: { exact: selectedDeviceId } };
    }
    return isMobile ? { facingMode: "environment" } : { facingMode: "user" };
  }, [selectedDeviceId, isMobile]);

  // Debounced device selection handler
  const handleDeviceChange = React.useCallback(
    (deviceId: string | undefined) => {
      setSelectedDeviceId(deviceId);
      setCameraError(null);
    },
    []
  );

  // Export handlers
  const handleExportDaily = () => {
    if (!attendanceByDate || !cls) return;

    try {
      exportDailyAttendance(attendanceByDate, cls.className, selectedDate);
      toast.success("Daily attendance exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export daily attendance");
    }
  };

  const handleExportMatrix = () => {
    if (!attendanceMatrix || !cls) return;

    try {
      exportAttendanceMatrix(attendanceMatrix, cls.className);
      toast.success("Attendance matrix exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export attendance matrix");
    }
  };

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

  const { data: attendanceMatrix } = useQuery<ClassAttendanceMatrix[]>({
    queryKey: ["class-attendance-matrix", classId],
    queryFn: coleAPI(`/classes/${classId}/attendance/matrix`),
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

  const { mutateAsync: addClassAttendance } = useMutation({
    mutationFn: coleAPI("/attendances/add-class", "POST"),
    onSuccess: () => {
      toast.success("Attendance recorded successfully!");
      queryClient.invalidateQueries({
        queryKey: ["class-attendance-date", classId, selectedDate],
      });
      queryClient.invalidateQueries({
        queryKey: ["class-attendance-matrix", classId],
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      if (error.response?.data?.message === "Already exists!") {
        toast.error("Attendance already recorded for today!");
      } else {
        toast.error("Invalid QR code or student not in this class");
      }
    },
  });

  const handleScanResult = async (result: IDetectedBarcode[]) => {
    try {
      setCameraError(null);

      const data = JSON.parse(result[0].rawValue);
      if (!data.userId) throw new Error("Invalid Format!");

      let student: Student | null = null;

      try {
        student = await coleAPI(
          `/classes/${classId}/students/${data.userId}/validate`
        )({});
      } catch (error) {
        if (error) {
          setValidatedStudent(null);
          return toast.error("Invalid QR code or student not in this class");
        }
      }

      if (student) {
        setValidatedStudent(student);
      } else {
        throw new Error("Invalid");
      }

      // Save attendance
      const now = new Date();
      const dateTime = now
        .toLocaleString("sv-SE", { timeZone: "Asia/Manila" })
        .replace("T", " ");
      const date = now.toISOString().slice(0, 10);

      await addClassAttendance({
        classId: parseInt(classId!),
        userId: data.userId,
        type: "in",
        dateTime,
        date,
      });
    } catch (error) {
      if (error) return;
    }
  };

  // Device detection and camera setup
  useEffect(() => {
    // Detect if device is mobile (only once)
    if (!devicesInitialized) {
      const checkMobile = () => {
        const userAgent =
          navigator.userAgent ||
          navigator.vendor ||
          (window as unknown as { opera?: string }).opera ||
          "";
        const isMobileDevice =
          /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
            userAgent
          );
        const isTouchDevice =
          "ontouchstart" in window || navigator.maxTouchPoints > 0;
        setIsMobile(isMobileDevice || isTouchDevice);
      };

      checkMobile();
      setDevicesInitialized(true);
    }
  }, [devicesInitialized]);

  // Auto-select appropriate camera when devices are available (only once)
  useEffect(() => {
    if (devices.length > 0 && !selectedDeviceId && devicesInitialized) {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (isMobile) {
        // On mobile, prefer back camera (environment)
        const backCamera = videoDevices.find(
          (device) =>
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("rear") ||
            device.label.toLowerCase().includes("environment")
        );

        if (backCamera) {
          setSelectedDeviceId(backCamera.deviceId);
        } else if (videoDevices.length > 1) {
          // If no back camera found but multiple cameras, use the last one (usually back on mobile)
          setSelectedDeviceId(videoDevices[videoDevices.length - 1].deviceId);
        } else {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } else {
        // On desktop, prefer front camera (user)
        const frontCamera = videoDevices.find(
          (device) =>
            device.label.toLowerCase().includes("front") ||
            device.label.toLowerCase().includes("user") ||
            device.label.toLowerCase().includes("facing")
        );

        if (frontCamera) {
          setSelectedDeviceId(frontCamera.deviceId);
        } else {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      }
    }
  }, [devices, selectedDeviceId, devicesInitialized, isMobile]);

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
    <div className="w-full flex flex-col items-center">
      <div className="w-[90%] sm:w-[80%] space-y-2.5 pb-10">
        <div className="mt-6 sm:mt-8 flex gap-1 justify-between items-center">
          <div className="border-l-5 border-orange-600 pl-2 sm:pl-3">
            {isLoading && "Loading..."}
            {!isLoading && cls && (
              <>
                {cls.className?.trim()} - {cls.department}
                {cls.year}
              </>
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
          <Card className="p-4 grid grid-cols-1 sm:[grid-template-columns:1.1fr_1.9fr] shadow-xl">
            <div className="rounded-md">
              <h2 className="text-center text-2xl rounded py-1.5 font-bold mb-2">
                Scan QR Code
              </h2>

              {/* Camera Selection */}
              {devices.length > 1 && (
                <div className="mb-3">
                  <select
                    value={selectedDeviceId || ""}
                    onChange={(e) =>
                      handleDeviceChange(e.target.value || undefined)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    {devices
                      .filter((device) => device.kind === "videoinput")
                      .map((device, index) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Camera ${index + 1}`}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Camera Error Display */}
              {cameraError && (
                <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  <CameraOff className="inline w-4 h-4 mr-1" />
                  {cameraError}
                </div>
              )}

              <div className="">
                <div className="mx-1 shadow rounded-md overflow-hidden">
                  {devicesInitialized && (
                    <Scanner
                      key={`scanner-${selectedDeviceId || "default"}`}
                      onScan={handleScanResult}
                      onError={(error) => {
                        console.error("Scanner error:", error);
                        setCameraError(
                          "Camera access failed. Please check permissions."
                        );
                      }}
                      sound={true}
                      constraints={scannerConstraints}
                      classNames={{
                        video:
                          "sm:scale-x-[-1] scale-x-100 w-full object-cover",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="rainbow flex-1 flex flex-col justify-center items-center order-1 sm:order-2 bg-gray-100 p-6 rounded-md shadow-sm transition hover:shadow-md">
              <div className="w-56 h-56 bg-white rounded-full overflow-hidden mb-4 shadow-md flex items-center justify-center border-2 border-gray-300">
                <img
                  src={
                    validatedStudent?.photo
                      ? `${
                          config.isProduction
                            ? config.prodServer
                            : config.devServer
                        }${validatedStudent.photo}`
                      : "/images/default-icon.png"
                  }
                  alt=""
                />
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold mb-1 text-gray-800">
                  {validatedStudent?.name || "Student Name"}
                </h4>
                <div className="border-t-2 border-gray-600 text-gray-700 flex items-center justify-center gap-2 text-[1.5rem] font-bold">
                  <span>{time.hours}</span>:<span>{time.minutes}</span>:
                  <span>{time.seconds}</span>
                  <span>{time.amPm}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {mode === "students" && (
          <Card className="p-4 space-y-3">
            {toggleAdd ? (
              <div className="flex flex-col gap-4">
                <div className="flex gap-1 justify-between items-end">
                  <h1 className="text-lg font-bold pb-1 sm:mb-2 sm:leading-0">
                    Search students
                  </h1>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="shadow sm:w-max flex gap-1"
                    onClick={() => setToggleAdd(false)}
                  >
                    <span className="hidden sm:inline-block">
                      View class students
                    </span>
                    <ArrowRight />
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                  <div className="flex-1">
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Type a name"
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
                            <div className="w-8 h-8 border rounded-full overflow-hidden bg-gray-100">
                              <img
                                src={
                                  s?.photo
                                    ? `${
                                        config.isProduction
                                          ? config.prodServer
                                          : config.devServer
                                      }${s.photo}`
                                    : "/images/default-icon.png"
                                }
                              />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {s.name}
                              </div>
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
            ) : (
              <div className="">
                <div className="flex gap-1 justify-between border-b">
                  <h1 className="text-lg font-bold pb-1 mb-2">Students</h1>

                  <Button size="sm" onClick={() => setToggleAdd(true)}>
                    Add Student
                  </Button>
                </div>
                {!studentsInClass?.length && (
                  <p className="pt-3 text-center text-gray-500">
                    No students in this class.
                  </p>
                )}
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {studentsInClass?.map((s) => (
                    <div
                      key={s.userId}
                      className="flex items-center gap-3 p-3 border rounded-md"
                    >
                      <div className="w-12 h-12 rounded-full border overflow-hidden bg-gray-100">
                        <img
                          src={
                            s?.photo
                              ? `${
                                  config.isProduction
                                    ? config.prodServer
                                    : config.devServer
                                }${s.photo}`
                              : "/images/default-icon.png"
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{s.name}</div>
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
            )}
          </Card>
        )}

        {mode === "attendance" && (
          <Card className="p-4 gap-1">
            <div className="flex flex-col items-center pb-2 sm:flex-row sm:justify-between gap-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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

              <div className="flex gap-2">
                {!showAllDays && attendanceByDate?.length ? (
                  <Button
                    onClick={handleExportDaily}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Export Daily
                  </Button>
                ) : null}
                {showAllDays && attendanceMatrix?.length ? (
                  <Button
                    onClick={handleExportMatrix}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Export Matrix
                  </Button>
                ) : null}
              </div>
            </div>

            {!showAllDays ? (
              <div className="border-t">
                {!attendanceByDate?.length && (
                  <p className="text-center text-gray-500">No students.</p>
                )}
                {attendanceByDate?.length && (
                  <DataTable<ClassAttendanceRecord>
                    data={attendanceByDate}
                    columns={dailyAttendanceColumns}
                  />
                )}
              </div>
            ) : (
              <div className="border-t pt-1">
                {!attendanceMatrix?.length && (
                  <p className="text-center text-gray-500">No records.</p>
                )}
                {attendanceMatrix?.length && (
                  <AttendanceMatrix data={attendanceMatrix} />
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ViewClass;
