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

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(
    undefined
  );
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [devicesInitialized, setDevicesInitialized] = useState(false);
  const devices = useDevices();

  const scannerConstraints = React.useMemo(() => {
    if (selectedDeviceId) {
      return { deviceId: { exact: selectedDeviceId } };
    }
    return isMobile ? { facingMode: "environment" } : { facingMode: "user" };
  }, [selectedDeviceId, isMobile]);

  const handleDeviceChange = React.useCallback(
    (deviceId: string | undefined) => {
      setSelectedDeviceId(deviceId);
      setCameraError(null);
    },
    []
  );

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

  const { mutateAsync: removeAttendance } = useMutation({
    mutationFn: async (attendanceId: number | undefined) =>
      await coleAPI(`/attendances/delete?id=${attendanceId}`, "DELETE")({}),
    onSuccess: async () => {
      toast.success("Student attendance removed from class");
      queryClient.invalidateQueries({
        queryKey: ["class-attendance-date", classId, selectedDate],
      });
      queryClient.invalidateQueries({
        queryKey: ["class-attendance-matrix", classId],
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

      // save attendance
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

  const totalDays = () => {
    const days = new Set<string>();
    attendanceMatrix?.forEach((record) => record.date && days.add(record.date));
    return days.size;
  };

  // device detection and camera setup
  useEffect(() => {
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

  useEffect(() => {
    if (devices.length > 0 && !selectedDeviceId && devicesInitialized) {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (isMobile) {
        const backCamera = videoDevices.find(
          (device) =>
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("rear") ||
            device.label.toLowerCase().includes("environment")
        );

        if (backCamera) {
          setSelectedDeviceId(backCamera.deviceId);
        } else if (videoDevices.length > 1) {
          setSelectedDeviceId(videoDevices[videoDevices.length - 1].deviceId);
        } else {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } else {
        // desktop front camera
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
    <div className="w-full flex flex-col items-center px-2 sm:px-0">
      <div className="w-full sm:w-[90%] md:w-[80%] space-y-3 sm:space-y-2.5 pb-20 sm:pb-10">
        <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="border-l-6 border-primary pl-3 sm:pl-4">
            {isLoading && (
              <span className="text-muted-foreground text-sm">Loading...</span>
            )}
            {!isLoading && cls && (
              <div>
                <h2 className="text-lg font-bold Nunito-Bold gradient-text">
                  {cls.className?.trim()}
                </h2>
                <p className="text-muted-foreground Nunito-Medium mt-1 text-xs">
                  {cls.department}
                  {cls.year}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-sm p-1.5 sm:p-2 rounded-lg border shadow-sm w-full sm:w-auto justify-center sm:justify-start">
            <Button
              variant={mode === "scan" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("scan")}
              className={`flex-1 sm:flex-initial ${
                mode === "scan"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : ""
              }`}
            >
              <QrCode size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline sm:inline ml-1 text-xs sm:text-sm">
                Scan
              </span>
            </Button>
            <Button
              variant={mode === "students" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("students")}
              className={`flex-1 sm:flex-initial ${
                mode === "students"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : ""
              }`}
            >
              <Users size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline sm:inline ml-1 text-xs sm:text-sm">
                Students
              </span>
            </Button>
            <Button
              variant={mode === "attendance" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("attendance")}
              className={`flex-1 sm:flex-initial ${
                mode === "attendance"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : ""
              }`}
            >
              <CheckSquare size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline sm:inline ml-1 text-xs sm:text-sm">
                Attendance
              </span>
            </Button>
          </div>
        </div>
        {mode === "scan" && (
          <Card className="p-3 sm:p-6 grid grid-cols-1 sm:[grid-template-columns:1.1fr_1.9fr] shadow-2xl border-0 bg-white/95 backdrop-blur-md gap-4 sm:gap-6">
            <div className="rounded-xl order-2 sm:order-1">
              <h2 className="text-center text-lg sm:text-xl md:text-2xl rounded-lg py-2 font-bold mb-3 sm:mb-4 Nunito-Bold gradient-text">
                Scan QR Code
              </h2>

              {/* Camera Selection */}
              {devices.length > 1 && (
                <div className="mb-2 sm:mb-3">
                  <select
                    value={selectedDeviceId || ""}
                    onChange={(e) =>
                      handleDeviceChange(e.target.value || undefined)
                    }
                    className="w-full p-2 sm:p-2.5 border-2 border-gray-300 rounded-lg text-sm focus:border-primary transition-colors touch-manipulation"
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
                <div className="mx-1 shadow-xl rounded-xl overflow-hidden border-2 border-primary/20">
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
                          "sm:scale-x-[-1] scale-x-100 w-full object-cover rounded-lg",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="rainbow flex-1 flex flex-col justify-center items-center order-2 sm:order-1 p-4 sm:p-6 md:p-8 rounded-xl">
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white rounded-full overflow-hidden mb-4 sm:mb-6 shadow-2xl flex items-center justify-center border-4 border-white/50 ring-4 ring-primary/20">
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
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center w-full px-2 flex flex-col">
                <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 mb-2 sm:mb-3 inline-block max-w-full">
                  <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white Nunito-Bold drop-shadow-2xl break-words">
                    {validatedStudent?.name || "Student Name"}
                  </h4>
                  <div className="border-t-2 border-white/50 text-white flex items-center justify-center gap-1 sm:gap-2 text-xl sm:text-2xl md:text-3xl font-bold Nunito-Bold pt-2 drop-shadow-2xl">
                    <span>{time.hours}</span>:<span>{time.minutes}</span>:
                    <span>{time.seconds}</span>
                    <span className="text-base sm:text-lg md:text-xl">
                      {time.amPm}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {mode === "students" && (
          <Card className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 shadow-2xl border-0 bg-white/95 backdrop-blur-md">
            {toggleAdd ? (
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 sm:justify-between sm:items-end">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold Nunito-Bold gradient-text">
                    Search students
                  </h1>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="shadow w-full sm:w-max flex gap-1 justify-center"
                    onClick={() => setToggleAdd(false)}
                  >
                    <span className="text-xs sm:text-sm">
                      <span className="hidden sm:inline">
                        View class students
                      </span>
                      <span className="sm:hidden">View Class</span>
                    </span>
                    <ArrowRight size={16} />
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                  <div className="flex-1">
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Type a name"
                      className="h-10 sm:h-9 text-base sm:text-sm touch-manipulation"
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
                    className="w-full sm:w-auto h-10 sm:h-9 touch-manipulation"
                  >
                    Add Selected
                  </Button>
                </div>

                <div className="max-h-80 overflow-y-auto border-2 rounded-xl p-2 sm:p-3 bg-white/50 backdrop-blur-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
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
                            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 touch-manipulation ${
                              checked
                                ? "bg-gradient-to-r from-blue-50 to-purple-50 border-primary shadow-md"
                                : "bg-white hover:bg-gray-50 border-gray-200"
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
                              className="w-5 h-5 sm:w-4 sm:h-4 text-primary touch-manipulation"
                            />
                            <div className="w-10 h-10 sm:w-10 sm:h-10 border-2 border-gray-200 rounded-full overflow-hidden bg-gray-100 shadow-sm flex-shrink-0">
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
                                alt={s.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs sm:text-sm font-semibold Nunito-SemiBold truncate">
                                {s.name}
                              </div>
                              <div className="text-[10px] sm:text-xs text-muted-foreground Nunito-Medium">
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
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 sm:justify-between sm:items-center border-b-2 pb-3 mb-3 sm:mb-4">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold Nunito-Bold gradient-text">
                    Students
                  </h1>

                  <Button
                    size="sm"
                    onClick={() => setToggleAdd(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg w-full sm:w-auto h-10 sm:h-8 touch-manipulation"
                  >
                    Add Student
                  </Button>
                </div>
                {!studentsInClass?.length && (
                  <p className="pt-4 sm:pt-6 text-center text-muted-foreground Nunito-Medium text-sm sm:text-base">
                    No students in this class.
                  </p>
                )}
                <div className="pt-2 sm:pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {studentsInClass?.map((s) => (
                    <div
                      key={s.userId}
                      className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 rounded-xl bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200 card-hover"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary/20 overflow-hidden bg-gray-100 shadow-md flex-shrink-0">
                        <img
                          src={
                            s?.photo
                              ? `${
                                  config.isProduction
                                    ? config.prodServer
                                    : new URL(config.devServer).origin
                                }${s.photo}`
                              : "/images/default-icon.png"
                          }
                          alt={s.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold Nunito-SemiBold text-sm sm:text-base truncate">
                          {s.name}
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
                        className="shadow-md hover:shadow-lg transition-all text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-8 touch-manipulation flex-shrink-0"
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
          <Card className="p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 shadow-2xl border-0 bg-white/95 backdrop-blur-md">
            <div className="flex flex-col pb-3 sm:pb-4 gap-3 sm:gap-4 bg-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl border-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="text-xs sm:text-sm font-semibold Nunito-SemiBold text-muted-foreground whitespace-nowrap">
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border-2 rounded-lg px-2 sm:px-3 py-2 text-sm sm:text-base focus:border-primary transition-colors Nunito-Medium flex-1 sm:flex-initial touch-manipulation"
                      disabled={showAllDays}
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer touch-manipulation">
                    <input
                      type="checkbox"
                      checked={showAllDays}
                      onChange={(e) => setShowAllDays(e.target.checked)}
                      className="w-5 h-5 sm:w-4 sm:h-4 text-primary touch-manipulation"
                    />
                    <span className="text-xs sm:text-sm font-semibold Nunito-SemiBold">
                      Show all days
                    </span>
                  </label>
                </div>

                {showAllDays && (
                  <div className="text-xs sm:text-sm font-semibold Nunito-SemiBold text-muted-foreground">
                    Total days:{" "}
                    <span className="text-primary">
                      {attendanceMatrix ? totalDays() : "0"}
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {!showAllDays && attendanceByDate?.length ? (
                    <Button
                      onClick={handleExportDaily}
                      size="sm"
                      variant="outline"
                      className="flex items-center justify-center gap-1 w-full sm:w-auto h-10 sm:h-8 touch-manipulation"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Export Daily</span>
                    </Button>
                  ) : null}
                  {showAllDays && attendanceMatrix?.length ? (
                    <Button
                      onClick={handleExportMatrix}
                      size="sm"
                      variant="outline"
                      className="flex items-center justify-center gap-1 w-full sm:w-auto h-10 sm:h-8 touch-manipulation"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Export Matrix</span>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            {!showAllDays ? (
              <div className="border-t pt-2 sm:pt-4 overflow-x-auto">
                {!attendanceByDate?.length && (
                  <p className="text-center text-gray-500 text-sm sm:text-base py-4">
                    No students.
                  </p>
                )}
                {attendanceByDate?.length && (
                  <div className="min-w-full">
                    <DataTable<ClassAttendanceRecord>
                      data={attendanceByDate}
                      columns={dailyAttendanceColumns((attendanceId) =>
                        removeAttendance(attendanceId)
                      )}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="border-t pt-2 sm:pt-4 overflow-x-auto">
                {!attendanceMatrix?.length && (
                  <p className="text-center text-gray-500 text-sm sm:text-base py-4">
                    No records.
                  </p>
                )}
                {attendanceMatrix?.length && (
                  <div className="min-w-full">
                    <AttendanceMatrix data={attendanceMatrix} />
                  </div>
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
