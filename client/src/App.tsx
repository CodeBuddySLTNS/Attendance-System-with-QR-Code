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
