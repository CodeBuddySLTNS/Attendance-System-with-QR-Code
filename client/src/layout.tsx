import React, { useEffect, type ReactNode } from "react";
import Header from "./components/header";
import { useLocation } from "react-router-dom";
import { useMainStore } from "./store";

type LayoutNode = {
  children: ReactNode;
};

const Layout: React.FC<LayoutNode> = ({ children }) => {
  const setPage = useMainStore((state) => state.setPage);
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setPage("home");
        break;

      case "/students":
        setPage("students");
        break;
    }
  }, [location.pathname, setPage]);

  return (
    <div className="w-full h-dvh grid grid-cols-1 grid-rows-[max-content_1fr] overflow-hidden">
      <Header />
      <div className="w-full h-full overflow-hidden">{children}</div>
    </div>
  );
};

export default Layout;
