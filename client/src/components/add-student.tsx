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
import { useForm, type SubmitHandler } from "react-hook-form";

interface InputData {
  name: string;
  year: number;
}

const AddStudent: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputData>();

  const onSubmit: SubmitHandler<InputData> = (data) => {
    console.log(data);
  };

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
              <Label htmlFor="year">Year Level</Label>
              <Input
                {...register("year", {
                  required: "Year level is required",
                  min: 1,
                  max: 4,
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
            <Button type="submit" className="w-full mt-3 Nunito-SemiBold">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddStudent;
