import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useMainStore } from "../store";

const Header: React.FC = () => {
  const page = useMainStore((state) => state.page);

  return (
    <div className="w-full flex justify-between items-center px-4 py-2.5 bg-[#0E2148] shadow-2xl">
      <div className="Nunito-Extra-Bold flex items-center gap-2 text-xl text-white">
        <div className="w-8 h-8">
          <img src="/images/paclogo.png" />
        </div>
        <span>QR Code Attendance System</span>
      </div>

      <div className="text-white Nunito-Medium flex gap-4">
        <Link
          to="/"
          className={`${page === "home" && "border-b-2 border-[#E3D095]"}`}
        >
          Home
        </Link>
        <Link
          to="/students"
          className={`${page === "students" && "border-b-2 border-[#E3D095]"}`}
        >
          Students
        </Link>
      </div>

      <div>
        <Button variant="secondary" size="sm">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Header;
