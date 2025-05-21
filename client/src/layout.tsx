import React, { type ReactNode } from "react";
import Header from "./components/header";

type LayoutNode = {
  children: ReactNode;
};

const Layout: React.FC<LayoutNode> = ({ children }) => {
  return (
    <div className="w-full h-full grid grid-cols-1 grid-rows-[max-content_1fr]">
      <Header />
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

export default Layout;
