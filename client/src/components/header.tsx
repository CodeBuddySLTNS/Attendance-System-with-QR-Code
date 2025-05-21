import React from "react";

const Header: React.FC = () => {
  return (
    <div className="w-full flex justify-between items-center px-4 py-2 bg-gray-900">
      <div className="Nunito-Extra-Bold text-white">
        QR Code Attendance System
      </div>
      <div>
        <button className="btn text-white">Logout</button>
      </div>
    </div>
  );
};

export default Header;
