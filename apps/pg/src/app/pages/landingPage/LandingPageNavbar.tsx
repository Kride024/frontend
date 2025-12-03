import { FC } from "react";

import { useAuthModal } from "@pg/app/shared/hooks/context/AuthContext";
import tailwindStyles from "@packages/styles/tailwindStyles"
export const Navbar: FC = () => {
  const { openModal } = useAuthModal();

  return (
    <nav
      className="
        sticky top-0 z-50 
        bg-[#181C3A]
        flex items-center justify-between
        px-12 py-2
        shadow-2xl
        mx-0 sm:mx-[50px] overflow-auto
      "
    >
      {/* Left Section — Logo + Title */}
      <div className="flex flex-col items-start">
        <div className="flex items-center space-x-2">
           <img src="/RUFRENT6.png" alt="logo" className={tailwindStyles.logo} />
        </div>
       <div className="justify-self-start">
              <span className="text-xs md:text-sm lg:text-md pl-1 tracking-widest text-white">
                PG
              </span>
            </div>
      </div>

      {/* Right Section — Buttons */}
      <div className="flex items-center space-x-6">
        <button
          onClick={openModal}
          className="text-white text-lg font-semibold hover:opacity-80 transition"
        >
          Login
        </button>
        <button
          className="
            bg-gradient-to-r from-[#FB432C] to-[#FF591E]
            text-white font-semibold text-lg
            px-6 py-2 rounded-xl
            shadow-md hover:opacity-90 transition
          "
        >
          Request Demo
        </button>
      </div>
    </nav>
  );
};
