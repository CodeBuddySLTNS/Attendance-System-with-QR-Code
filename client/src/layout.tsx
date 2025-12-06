import React, { useEffect, type ReactNode } from "react";
import Header from "./components/header";
import { useLocation, useNavigate } from "react-router-dom";
import { useMainStore } from "./store";

type LayoutNode = {
  children: ReactNode;
};

const Layout: React.FC<LayoutNode> = ({ children }) => {
  const loggedIn = useMainStore((state) => state.loggedIn);
  const setPage = useMainStore((state) => state.setPage);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setPage("home");
        break;

      case "/students":
        if (!loggedIn) navigate("/");
        setPage("students");
        break;

      case "/attendance-records":
        if (!loggedIn) navigate("/");
        setPage("attendance-records");
        break;
    }
  }, [location.pathname, setPage, loggedIn, navigate]);

  return (
    <div className="w-full h-dvh flex flex-col">
      <Header />
      <div className="w-full flex-1 overflow-auto pt-[57px]">{children}</div>
    </div>
  );
};

export default Layout;
