import { useMainStore } from "@/store";
import React from "react";
import TeachersPage from "./teacher/page";
import StudentsPage from "./students-page";

const LandingPage: React.FC = () => {
  const user = useMainStore((state) => state.user);

  switch (user?.role) {
    case "teacher":
      return <TeachersPage />;
    case "admin":
      return <StudentsPage />;
  }
};

export default LandingPage;
