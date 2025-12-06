import { LoginForm } from "@/components/login-form";

export default function Login() {
  return (
    <div className="w-full h-dvh flex justify-center items-center bg-gradient-to-br from-blue-50 via-purple-50/50 to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/paclogo.png')] bg-center bg-no-repeat opacity-5 blur-2xl"></div>
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
