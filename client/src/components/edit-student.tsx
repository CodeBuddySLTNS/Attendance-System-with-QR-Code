import type { Student } from "@/types/students.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Department, InputData } from "./add-student";
import { coleAPI } from "@/lib/utils";
import Axios from "axios";
import config from "../../system.config.json";
import { toast } from "sonner";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";

const EditStudent: React.FC<{
  isOpen: boolean;
  close: () => void;
  student: Student;
}> = ({ isOpen, close, student }) => {
  const queryClient = useQueryClient();
  const [photo, setPhoto] = useState<string | null>(student.photo || null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const { data: departments } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: coleAPI("/departments"),
  });

  const { mutateAsync: updateStudent, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem("token");
      const instance = Axios.create({
        baseURL: config.isProduction ? config.prodServer : config.devServer,
      });
      const resp = await instance.patch("/students/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return resp.data;
    },
    onError: () => {
      toast.error("Failed to update student");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student updated successfully");
      setPhoto(null);
      close();
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InputData>({
    defaultValues: {
      studentId: student.studentId ?? "",
      name: student.name ?? "",
      departmentId:
        departments
          ?.find((dep) => dep.departmentName === student.departmentName)
          ?.departmentId.toString() ?? "",
      year: student.year ?? 1,
    },
  });

  useEffect(() => {
    reset({
      studentId: student.studentId ?? "",
      name: student.name ?? "",
      departmentId:
        departments
          ?.find((dep) => dep.departmentName === student.departmentName)
          ?.departmentId.toString() ?? "",
      year: student.year ?? 1,
    });
  }, [student, departments, reset]);

  const onSubmit: SubmitHandler<InputData> = async (data) => {
    const form = new FormData();
    form.append("userId", String(student.userId));
    if (data.studentId) form.append("studentId", String(data.studentId));
    form.append("name", data.name);
    form.append("departmentId", String(parseInt(data.departmentId)));
    form.append("year", String(data.year));
    if (photoFile) {
      form.append("photo", photoFile);
    }
    await updateStudent(form);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update the student information below.
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid [grid-template-columns:1fr_auto] gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  {...register("studentId")}
                  type="number"
                  placeholder="Enter student ID (optional)"
                />
              </div>

              <div
                className="relative"
                onClick={() => {
                  const input = document.getElementById("photo");
                  if (input) {
                    input.click();
                  }
                }}
              >
                <img
                  src={
                    photo
                      ? photo
                      : student.photo
                      ? `${
                          config.isProduction
                            ? config.prodServer
                            : config.devServer
                        }${student.photo}`
                      : "/images/default-icon.png"
                  }
                  alt="Student Photo"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-400 shadow"
                />
                <Edit
                  size={22}
                  className="absolute bottom-0 right-0 bg-gray-200 rounded p-[2px]"
                />
                <input
                  id="photo"
                  className="hidden"
                  type="file"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                {...register("name", {
                  required: "Name is required",
                })}
                type="text"
                placeholder="Enter name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Department</Label>
              <Controller
                control={control}
                name="departmentId"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map((dep, index) => (
                        <SelectItem
                          key={index}
                          value={dep.departmentId.toString()}
                        >
                          {dep.departmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.departmentId && (
                <p className="text-sm text-red-500">
                  {errors.departmentId.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="year">Year Level</Label>
              <Input
                {...register("year", {
                  required: "Year level is required",
                  min: 1,
                  max: 4,
                  valueAsNumber: true,
                })}
                type="number"
                min={1}
                max={4}
                placeholder="Enter year level"
              />
              {errors.year && (
                <p className="text-sm text-red-500">{errors.year.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full mt-3 Nunito-SemiBold"
            >
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditStudent;
