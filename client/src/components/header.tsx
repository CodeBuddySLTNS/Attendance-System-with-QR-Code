import React from "react";
import { Button } from "./ui/button";

const Header: React.FC = () => {
  return (
    <div className="w-full flex justify-between items-center px-4 py-2 bg-gray-900 shadow-2xl">
      <div className="Nunito-Extra-Bold text-xl text-white">
        QR Code Attendance System
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
