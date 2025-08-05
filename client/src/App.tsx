import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AttendanceRecords from "./pages/attendance-records";
import Layout from "./layout";
import StudentsPage from "./pages/students-page";
import { Toaster } from "./components/ui/toaster";
import { useQuery } from "@tanstack/react-query";
import { coleAPI } from "./lib/utils";
import { useMainStore } from "./store";
import Login from "./pages/auth/login";
import LandingPage from "./pages/landing-page";
import Signup from "./pages/auth/signup";

const App: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: coleAPI("/login/session"),
  });

  useEffect(() => {
    if (data) {
      useMainStore.getState().setLoggedIn(true);
    }
    if (!isLoading && !data) {
      navigate("/login");
    }
  }, [data, navigate, isLoading]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/attendance-records" element={<AttendanceRecords />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </Layout>
  );
};

export default App;
