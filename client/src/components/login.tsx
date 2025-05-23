import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useMutation } from "@tanstack/react-query";
import { coleAPI } from "@/lib/utils";
import { toast } from "sonner";
import { useMainStore } from "@/store";
import { AxiosError } from "axios";

interface LoginData {
  username: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit, reset } = useForm<LoginData>();

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: coleAPI("/login", "POST"),
    onSuccess: (d) => {
      useMainStore.getState().setLoggedIn(true);
      localStorage.setItem("token", d.token);
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
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="sm">
            Login
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mt-2 mr-4 px-6 py-6">
          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <h1 className="text-center text-xl Nunito-Bold">Admin access</h1>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                {...register("username")}
                type="text"
                id="username"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                {...register("password")}
                type="password"
                id="password"
                required
              />
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Logging In..." : "Login"}
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Login;
