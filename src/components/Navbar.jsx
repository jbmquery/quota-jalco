//src/components/Navbar.jsx
import React from "react";
import { SiGoogleanalytics } from "react-icons/si";
import { IoIosNotifications } from "react-icons/io";
import { IoIosNotificationsOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

function Navbar({ soundMuted, setSoundMuted }) {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="navbar bg-primary shadow-sm">
      <div className="flex-1 px-2">
        <a
          className="md:text-xl text-white font-bold mr-2 cursor-pointer"
          onClick={() => navigate("/registros")}
        >
          QUOTA JALVO
        </a>
      </div>

      <div className="flex flex-row gap-6 mx-2">
        <SiGoogleanalytics
          onClick={() => navigate("/analytics")}
          className="text-white text-lg md:text-2xl cursor-pointer hover:scale-[1.1] hover:opacity-75 transition-all duration-300"
        />

        {soundMuted ? (
          <IoIosNotificationsOff
            onClick={() => setSoundMuted(false)}
            className="text-white text-lg md:text-2xl cursor-pointer hover:scale-[1.1] hover:opacity-75 transition-all duration-300"
          />
        ) : (
          <IoIosNotifications
            onClick={() => setSoundMuted(true)}
            className="text-white text-lg md:text-2xl cursor-pointer hover:scale-[1.1] hover:opacity-75 transition-all duration-300"
          />
        )}

        <a
          onClick={logout}
          className="text-white font-bold cursor-pointer hover:scale-[1.1] hover:opacity-75 transition-all duration-300"
        >
          Salir
        </a>
      </div>
    </div>
  );
}

export default Navbar;