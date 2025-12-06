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

export interface InputData {
  studentId?: number;
  name: string;
  departmentId: string;
  year: number;
}

export interface Department {
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
          <Button 
            size="sm" 
            className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Add Student
          </Button>
        </DialogTrigger>
        <DialogContent className="gap-4 shadow-2xl border-2 bg-white/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="Nunito-Bold text-2xl text-center gradient-text">
              Add Student
            </DialogTitle>
            <DialogDescription className="text-center Nunito-Medium">
              Fill in the student information below
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="Nunito-SemiBold">Student ID</Label>
              <Input
                {...register("studentId")}
                type="number"
                placeholder="Enter student ID (optional)"
                className="h-11 border-2 focus:border-primary transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="Nunito-SemiBold">Name</Label>
              <Input
                {...register("name", {
                  required: "Name is required",
                })}
                type="text"
                placeholder="Enter name"
                className="h-11 border-2 focus:border-primary transition-colors"
              />
              {errors.name && (
                <p className="text-sm text-red-500 Nunito-Medium">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="Nunito-SemiBold">Department</Label>
              <Controller
                control={control}
                name="departmentId"
                rules={{ required: "Department is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={selectedDepartment ?? ""}
                  >
                    <SelectTrigger className="h-11 border-2 focus:border-primary">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-md border-2">
                      {departments?.map((dep, index) => (
                        <SelectItem
                          key={index}
                          value={dep.departmentId.toString()}
                          className="Nunito-Medium"
                        >
                          {dep.departmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.departmentId && (
                <p className="text-sm text-red-500 Nunito-Medium">
                  {errors.departmentId.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="year" className="Nunito-SemiBold">Year Level</Label>
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
                className="h-11 border-2 focus:border-primary transition-colors"
              />
              {errors.year && (
                <p className="text-sm text-red-500 Nunito-Medium">{errors.year.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 h-11 Nunito-SemiBold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddStudent;
