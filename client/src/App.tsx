import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Layout from "./layout";
import StudentsPage from "./pages/students-page";
import { Toaster } from "./components/ui/toaster";
import { useQuery } from "@tanstack/react-query";
import { coleAPI } from "./lib/utils";
import { useMainStore } from "./store";
import Login from "./pages/auth/login";
import LandingPage from "./pages/landing-page";
import Signup from "./pages/auth/signup";
import ViewClass from "./pages/teacher/view-class";
import { Loader } from "lucide-react";

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useMainStore((state) => state.user);
  const { data, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: coleAPI("/auth/session"),
  });

  useEffect(() => {
    if (data) {
      useMainStore.getState().setLoggedIn(true);
      useMainStore.getState().setUser(data);
    }

    if (!isLoading && !data && !useMainStore.getState().user) {
      navigate("/login");
    }
  }, [data, isLoading]);

  useEffect(() => {
    switch (location.pathname) {
      case "/login":
        if (user) navigate("/");
    }
  }, [location.pathname, user, navigate]);

  if (isLoading)
    return (
      <div className="w-full h-dvh flex justify-center items-center bg-gradient-to-br from-blue-50 via-purple-50/50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <Loader size={70} className="animate-spin text-primary" />
          <p className="text-muted-foreground Nunito-Medium">Loading...</p>
        </div>
      </div>
    );

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/class/:classId" element={<ViewClass />} />
        <Route path="/students" element={<StudentsPage />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </Layout>
  );
};

export default App;
