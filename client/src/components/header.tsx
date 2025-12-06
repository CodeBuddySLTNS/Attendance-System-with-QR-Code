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
      <div className="w-full flex justify-between items-center px-4 py-2.5 z-10 bg-gradient-to-r from-[#0E2148] via-[#1a3a6b] to-[#0E2148] shadow-lg border-b border-white/10">
        <div className="Nunito-Extra-Bold flex items-center gap-2.5 text-xl text-white">
          <div className="w-8 h-8 rounded-md bg-white/10 p-1 flex items-center justify-center backdrop-blur-sm border border-white/20">
            <img src="/images/paclogo.png" className="w-full h-full object-contain" alt="Logo" />
          </div>
          <span className="drop-shadow-sm">QR Code Attendance</span>{" "}
          <span className="hidden sm:inline-block text-white/90">System</span>
        </div>

        <div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span className="hidden sm:inline-block">Logout</span>
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    )
  );
};

export default Header;
