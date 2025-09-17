import { cn, coleAPI } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

interface LoginData {
  name: string;
  username: string;
  password: string;
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { register, handleSubmit, reset } = useForm<LoginData>();
  const navigate = useNavigate();
  const [showPassword, setShowpassword] = useState(false);

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: coleAPI("/auth/signup", "POST"),
    onSuccess: () => {
      toast.success("Account created successfully!");
      navigate("/login");
      reset();
    },
  });

  const onSubmit = async (data: LoginData) => {
    try {
      await login({
        name: data.username.trim(),
        username: data.username.trim(),
        password: data.password.trim(),
      });
    } catch (error) {
      if (error instanceof Error) {
        const axErr = error as AxiosError<Error>;
        if (axErr.response?.data.message)
          return toast.error(axErr.response.data.message);
        toast.error("Unable to connect to the server");
      }
    }
  };

  return (
    <div
      className={cn(
        "min-w-[250px] sm:min-w-[350px] flex flex-col gap-6",
        className
      )}
      {...props}
    >
      <Card className="gap-5">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create Account</CardTitle>
          <CardDescription className="text-center">
            Fill out the fields below to create new account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input {...register("name")} id="name" type="name" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  {...register("username")}
                  id="username"
                  type="username"
                  placeholder=""
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  {showPassword ? (
                    <EyeClosed
                      size={20}
                      onClick={() => setShowpassword(false)}
                      className="absolute top-1/2 right-2 text-gray-500 transform -translate-y-1/2"
                    />
                  ) : (
                    <Eye
                      size={20}
                      onClick={() => setShowpassword(true)}
                      className="absolute top-1/2 right-2 text-gray-500 transform -translate-y-1/2"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  {isPending ? "Processing..." : "Submit"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
