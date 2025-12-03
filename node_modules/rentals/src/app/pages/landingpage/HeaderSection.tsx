// apps/rentals/src/app/pages/landing/HeaderSection.tsx
import { useState, useEffect } from "react";
//import AuthModal from "@shared/ui/AuthModalView";
import tailwindStyles from "../../../../../../packages/styles/tailwindStyles";

const HeaderSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleMobileMenu = () => {
    document.getElementById("mobile-menu")?.classList.toggle("hidden");
  };

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${isScrolled ? "bg-white shadow-lg" : "bg-transparent"}
        `}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <img src="/RUFRENT6.png" alt="RufRent Logo" className="h-12" />

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={openModal}
              className="flex items-center gap-3 bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-xl transition-all font-semibold"
            >
              <span>Post Property</span>
              <span className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold">
                FREE
              </span>
            </button>
            <button onClick={openModal} className="text-gray-700 hover:text-black font-medium">
              Login
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={toggleMobileMenu} className="md:hidden text-3xl">
            Menu
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className="hidden fixed inset-0 bg-[#001433] text-white z-40 pt-20 px-6"
        >
          <div className="space-y-8 text-center">
            <button
              onClick={openModal}
              className="block w-full bg-white text-black py-4 rounded-lg font-bold text-lg"
            >
              Post Property FREE
            </button>
            <button onClick={openModal} className="block text-2xl">Login</button>
          </div>
        </div>
      </header>

      {/* <AuthModal isOpen={isModalOpen} onClose={closeModal} /> */}
    </>
  );
};

export default HeaderSection;