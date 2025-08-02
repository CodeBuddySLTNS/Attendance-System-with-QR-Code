import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LandingPage from "./pages/landing-page";
import AttendanceRecords from "./pages/attendance-records";
import Layout from "./layout";
import StudentsPage from "./pages/students-page";
import { Toaster } from "./components/ui/toaster";
import { useQuery } from "@tanstack/react-query";
import { coleAPI } from "./lib/utils";
import { useMainStore } from "./store";

const App: React.FC = () => {
  const { data } = useQuery({
    queryKey: ["session"],
    queryFn: coleAPI("/login/session"),
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      useMainStore.getState().setLoggedIn(true);
    }
  }, [data]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/attendance-records" element={<AttendanceRecords />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </Layout>
    </Router>
  );
};

export default App;
