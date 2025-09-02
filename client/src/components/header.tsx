import React from "react";
import { Button } from "./ui/button";
// import { Link } from "react-router-dom";
import { useMainStore } from "../store";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Header: React.FC = () => {
  // const page = useMainStore((state) => state.page);
  const loggedIn = useMainStore((state) => state.loggedIn);
  const navigate = useNavigate();

  const handleLogout = () => {
    useMainStore.getState().setLoggedIn(false);
    useMainStore.getState().setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    loggedIn && (
      <div className="w-full flex justify-between items-center px-4 py-2.5 z-10 bg-[#0E2148] shadow-2xl">
        <div className="Nunito-Extra-Bold flex items-center gap-2 text-xl text-white">
          <div className="w-8 h-8">
            <img src="/images/paclogo.png" />
          </div>
          <span>QR Code Attendance</span>{" "}
          <span className="hidden sm:inline-block">System</span>
        </div>

        {/* <div
          className={`${
            !loggedIn && "hidden"
          } text-white Nunito-Medium flex gap-4`}
        >
          <Link
            to="/"
            className={`${page === "home" && "border-b-2 border-[#E3D095]"}`}
          >
            Home
          </Link>
          <Link
            to="/students"
            className={`${
              page === "students" && "border-b-2 border-[#E3D095]"
            }`}
          >
            Students
          </Link>
          <Link
            to="/attendance-records"
            className={`${
              page === "attendance-records" && "border-b-2 border-[#E3D095]"
            }`}
          >
            Attendance Records
          </Link>
        </div> */}

        <div>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            <span className="hidden sm:inline-block">Logout</span>
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    )
  );
};

export default Header;
