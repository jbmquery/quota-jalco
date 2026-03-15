import React from "react";
import { SiGoogleanalytics } from "react-icons/si";
import { IoIosNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar bg-primary shadow-sm">

      <div className="flex-1 px-2">
        <a className="md:text-xl text-white font-bold mr-2">
          QUOTA JALVO
        </a>
      </div>

      <div className="flex flex-row gap-2 md:gap-6 mx-2">

        <SiGoogleanalytics
          onClick={() => navigate("/analytics")}
          className="text-white text-lg md:text-2xl cursor-pointer hover:scale-[1.1] hover:opacity-75 transition-all duration-300"
        />

        <IoIosNotifications
          className="text-white text-lg md:text-2xl cursor-pointer hover:scale-[1.1] hover:opacity-75 transition-all duration-300"
        />

        <a className="text-white font-bold cursor-pointer hover:scale-[1.1] hover:opacity-75 transition-all duration-300">
          Salir
        </a>
      </div>
    </div>
  );
}

export default Navbar;