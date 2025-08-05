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
import { useMainStore } from "@/store";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

interface LoginData {
  username: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { register, handleSubmit, reset } = useForm<LoginData>();
  const navigate = useNavigate();

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: coleAPI("/login", "POST"),
    onSuccess: (d) => {
      useMainStore.getState().setLoggedIn(true);
      useMainStore.getState().setUser(d.user);
      localStorage.setItem("token", d.token);
      navigate("/");
      reset();
    },
  });

  const onSubmit = async (data: LoginData) => {
    try {
      await login({
        username: data.username.trim(),
        password: data.password.trim(),
      });
    } catch (error) {
      if (error instanceof Error) {
        const axErr = error as AxiosError<Error>;
        if (axErr.response?.data.message)
          return toast.error(axErr.response.data.message);
        toast.error("Failed to login");
      }
    }
  };

  return (
    <div
      className={cn(
        "min-w-[310px] sm:min-w-[350px] flex flex-col gap-6",
        className
      )}
      {...props}
    >
      <Card className="gap-5">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Login to your account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
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
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  {isPending ? "Logging In..." : "Login"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
