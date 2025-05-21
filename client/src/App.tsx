import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LandingPage from "./pages/landing-page";
import Layout from "./layout";
import StudentsPage from "./pages/students-page";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/students" element={<StudentsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
