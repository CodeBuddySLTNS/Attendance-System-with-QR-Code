import { useMainStore } from "@/store";
import React from "react";
import TeachersPage from "./teacher/page";

const LandingPage: React.FC = () => {
  const user = useMainStore((state) => state.user);

  switch (user?.role) {
    case "teacher":
      return <TeachersPage />;
    default:
      return <div>ds</div>;
  }
};

export default LandingPage;
