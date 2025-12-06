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
    mutationFn: coleAPI("/auth/login", "POST"),
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
        toast.error("Unable to connect to the server");
      }
    }
  };

  return (
    <div
      className={cn(
        "min-w-[250px] sm:min-w-[400px] flex flex-col gap-6",
        className
      )}
      {...props}
    >
      <Card className="gap-5 shadow-2xl border-0 bg-white/95 backdrop-blur-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-center text-3xl Nunito-Bold gradient-text">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-base">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-semibold Nunito-SemiBold"
                >
                  Username
                </Label>
                <Input
                  {...register("username")}
                  id="username"
                  type="username"
                  placeholder="Enter your username"
                  required
                  className="h-11 border-2 focus:border-primary transition-colors"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold Nunito-SemiBold"
                >
                  Password
                </Label>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="h-11 border-2 focus:border-primary transition-colors"
                />
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 text-base Nunito-SemiBold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isPending}
                >
                  {isPending ? "Logging In..." : "Login"}
                </Button>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-semibold hover:underline underline-offset-4 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
