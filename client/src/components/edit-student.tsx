import type { Student } from "@/types/students.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Department, InputData } from "./add-student";
import { coleAPI } from "@/lib/utils";
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

const EditStudent: React.FC<{
  isOpen: boolean;
  close: () => void;
  student: Student;
}> = ({ isOpen, close, student }) => {
  const queryClient = useQueryClient();

  const { data: departments } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: coleAPI("/departments"),
  });

  const { mutateAsync: updateStudent, isPending } = useMutation({
    mutationFn: coleAPI("/students/update", "PATCH"),
    onError: () => {
      toast.error("Failed to update student");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student updated successfully");
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
    const studentData = {
      userId: student.userId,
      studentId: data.studentId || null,
      name: data.name,
      departmentId: parseInt(data.departmentId),
      year: data.year,
    };
    await updateStudent(studentData);
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
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                {...register("studentId")}
                type="number"
                placeholder="Enter student ID (optional)"
              />
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
