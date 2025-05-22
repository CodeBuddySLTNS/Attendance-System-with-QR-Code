import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { coleAPI } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";

interface InputData {
  studentId?: number;
  name: string;
  departmentId: string;
  year: number;
}

interface Department {
  departmentId: number;
  departmentName: string;
  acronym: string;
}

const AddStudent: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: departments } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: coleAPI("/departments"),
  });

  const { mutateAsync: addStudent, isPending } = useMutation({
    mutationFn: coleAPI("/students/add", "POST"),
    onError: () => {
      toast.error("Failed to add student");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student added successfully");
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<InputData>();

  const onSubmit: SubmitHandler<InputData> = async (data) => {
    const studentData = {
      studentId: data.studentId || null,
      name: data.name,
      departmentId: parseInt(data.departmentId),
      year: data.year,
    };
    await addStudent(studentData);
  };

  const selectedDepartment = watch("departmentId");

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">Add Student</Button>
        </DialogTrigger>
        <DialogContent className="gap-2">
          <DialogHeader>
            <DialogTitle className="Nunito-Bold text-xl text-center">
              Add Student
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Student ID</Label>
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
                rules={{ required: "Department is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={selectedDepartment ?? ""}
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
              />{" "}
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
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddStudent;
