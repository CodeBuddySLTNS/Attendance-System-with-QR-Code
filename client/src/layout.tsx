import React, { type ReactNode } from "react";
import Header from "./components/header";

type LayoutNode = {
  children: ReactNode;
};

const Layout: React.FC<LayoutNode> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 grid-rows-[max-content_1fr]">
      <Header />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
