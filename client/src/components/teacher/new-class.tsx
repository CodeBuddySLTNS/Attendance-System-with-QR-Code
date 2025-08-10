import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Controller, useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { coleAPI } from "@/lib/utils";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import type { Department } from "../add-student";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ClassData {
  className: string;
  departmentId: string;
  year: number;
}

const NewClass: React.FC<{ open: boolean; close: () => void }> = ({
  open,
  close,
}) => {
  const queryClient = new QueryClient();

  const { data: departments } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: coleAPI("/departments"),
  });

  const { mutateAsync: addClass, isPending } = useMutation({
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
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassData>();

  const onSubmit = async (data: ClassData) => {
    const payload = { ...data, departmentId: parseInt(data.departmentId) };
    console.log(payload);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogTrigger asChild>
        <Button size="sm">New Class</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new class</DialogTitle>
          <DialogDescription>Fill out the fields below.</DialogDescription>
        </DialogHeader>

        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Class Label</Label>
            <Input
              {...register("className", {
                required: "Name is required",
              })}
              id="name"
              type="text"
              placeholder="Enter label"
            />
            {errors.className && (
              <p className="text-sm text-red-500">{errors.className.message}</p>
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
                  value={field.value?.toString() ?? ""}
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
              id="year"
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
  );
};

export default NewClass;
