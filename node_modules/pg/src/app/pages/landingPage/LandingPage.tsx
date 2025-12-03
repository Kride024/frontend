import React from "react";
// --- Imports from your first section ---
import guest from "@pg/app/shared/assests/guest.png";
import lp_img from "@pg/app/shared/assests/img1.jpg";
import manager from "@pg/app/shared/assests/manager.png";
import owner from "@pg/app/shared/assests/owner.png";

// --- Imports for 'Why Choose MyPG?' section ---
import automationImg from "@pg/app/shared/assests/automation.png";
import guestExperienceImg from "@pg/app/shared/assests/guestExperience.png";
import transparencyImg from "@pg/app/shared/assests/screenTransparency.png";
import singleLoginImg from "@pg/app/shared/assests/singleLogin.png";

// --- IMPORT FOR THE HORIZONTAL NAVBAR ---
import { Navbar as LandingPageNavbar } from "./LandingPageNavbar";
import TabNavigation from "../../../../../../packages/ui/Shared/TabNavigation"
//import Navbar from "@/app/shared/components/Navbar/Navbar"
// --- Types ---
type BlueDotsProps = {
  className?: string;
};

// --- Component for the decorative dots ---
const BlueDots: React.FC<BlueDotsProps> = ({ className }) => (
  <svg
    className={className}
    width="448"
    height="431"
    viewBox="0 0 448 431"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Include all SVG path elements here */}
    <path
      d="M16.0968 -109.926C16.0968 -105.468 12.4934 -101.853 8.04839 -101.853C3.60339 -101.853 0 -105.468 0 -109.926C0 -114.385 3.60339 -118 8.04839 -118C12.4934 -118 16.0968 -114.385 16.0968 -109.926Z"
      fill="currentColor"
    />
    <path
      d="M64.3871 -109.926C64.3871 -105.468 60.7837 -101.853 56.3387 -101.853C51.8937 -101.853 48.2903 -105.468 48.2903 -109.926C48.2903 -114.385 51.8937 -118 56.3387 -118C60.7837 -118 64.3871 -114.385 64.3871 -109.926Z"
      fill="currentColor"
    />
    <path
      d="M112.677 -109.926C112.677 -105.468 109.074 -101.853 104.629 -101.853C100.184 -101.853 96.5806 -105.468 96.5806 -109.926C96.5806 -114.385 100.184 -118 104.629 -118C109.074 -118 112.677 -114.385 112.677 -109.926Z"
      fill="currentColor"
    />
    {/* ... Add all other <path> elements here ... */}
    <path
      d="M499 422.927C499 427.385 495.397 431 490.952 431C486.507 431 482.903 427.385 482.903 422.927C482.903 418.468 486.507 414.853 490.952 414.853C495.397 414.853 499 418.468 499 422.927Z"
      fill="currentColor"
    />
  </svg>
);

// Main Component
export const Landingpage: React.FC = () => {
  const whyChooseCards = [
    { img: automationImg, text: "Saves time with automation" },
    { img: transparencyImg, text: "Increases transparency for owners/managers" },
    { img: guestExperienceImg, text: "Enhances guest experience" },
    { img: singleLoginImg, text: "Single login, Multiple Services (RR Ecosystem)" },
  ];

  return (
    <div className="bg-white">
      <LandingPageNavbar />
     {/* <Navbar/> */}
      {/* HERO SECTION */}
      <div className="mx-0 sm:mx-[50px] overflow-auto">

        <div className="relative w-full h-[65vh] sm:h-[60vh] rounded-b-[40px] overflow-hidden">
          <img
            src={lp_img}
            alt="Landing Page Background"
            className="absolute inset-0 w-full h-full object-cover rounded-b-[40px]"
          />
         

          <div
            className="
              absolute top-1/2 left-1/2 
              -translate-x-1/2 -translate-y-1/2
              flex flex-col items-center justify-center text-center
              px-4 sm:px-6
            "
          >
            <TabNavigation/>
            <h1
              className="
                text-white font-poppins font-bold 
                text-[28px] sm:text-[40px] md:text-[54px] lg:text-[60px]
                leading-tight tracking-tight
                [text-shadow:4px_4px_3px_rgba(0,0,0,0.25)]
              "
            >
              PG MANAGEMENT. SIMPLIFIED
            </h1>

            <p
              className="
                mt-4 text-white font-poppins font-medium 
                text-[14px] sm:text-[16px] md:text-[20px]
                max-w-[90%] sm:max-w-[700px] md:max-w-[900px]
                [text-shadow:3px_3px_4px_rgba(0,0,0,0.25)]
              "
            >
              From Occupancy Tracking To Guest Convenience, MyPG By Rufrent
              Helps Owners, Managers, And Guests Manage Everything In One Place.
            </p>

            <button
              className="
                mt-6 sm:mt-8 bg-[#1E2EFF] text-white font-semibold 
                text-sm sm:text-base md:text-lg px-6 sm:px-10 py-3 sm:py-4 rounded-xl
                shadow-md hover:bg-[#3040ff] transition duration-300
              "
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2 */}
      <div
        className="
          flex flex-col sm:flex-row flex-wrap justify-center items-center 
          w-full py-8 gap-6 sm:gap-4 px-4
        "
      >
        {[
          {
            text: "Track occupancy, finances, and maintenance — all from a single dashboard.",
            img: owner,
            title: "OWNER",
            imgSize: "w-[90px] sm:w-[100px]",
          },
          {
            text: "Manage day-to-day tasks, check-ins/checkouts, and service requests effortlessly.",
            img: manager,
            title: "MANAGERS",
            imgSize: "w-[130px] sm:w-[160px]",
          },
          {
            text: "Seamless check-ins, bill tracking, and service requests right from your mobile devices.",
            img: guest,
            title: "GUESTS",
            imgSize: "w-[110px] sm:w-[140px]",
          },
        ].map((card, index) => (
          <div
            key={index}
            className="
              flex flex-col items-center text-center 
              w-full sm:w-[300px] md:w-[330px]
              bg-white rounded-2xl shadow-xl
            "
          >
            <p className="px-4 sm:px-2 mt-4 text-black font-montserrat text-[15px] sm:text-[17px] font-semibold leading-snug">
              {card.text}
            </p>
            <div className="w-[160px] sm:w-[200px] h-[160px] sm:h-[200px] rounded-full bg-[#EAEFFF] flex justify-center items-center my-5">
              <img src={card.img} alt={card.title} className={card.imgSize} />
            </div>
            <h3 className="text-black font-montserrat text-[18px] sm:text-[20px] font-bold mb-6 tracking-tight">
              {card.title}
            </h3>
          </div>
        ))}
      </div>

      {/* WHY CHOOSE MYPG SECTION */}
      <div className="w-full py-16 sm:py-24 px-4 bg-white bg-[radial-gradient(theme(colors.gray.200)_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="relative max-w-7xl mx-auto">
          <BlueDots className="absolute top-0 right-0 w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] text-[#605BFF] -mt-8 z-0" />
          <BlueDots className="absolute bottom-0 left-0 w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] text-[#605BFF] -mb-8 z-0" />

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-black font-poppins font-semibold text-center text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tighter mb-12 md:mb-20">
              Why Choose MyPG?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {whyChooseCards.map((card, index) => (
                <div key={index} className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-xl">
                  <div className="w-full h-48 sm:h-56 flex items-center justify-center mb-6">
                    <img src={card.img} alt={card.text} className="max-w-full max-h-full object-contain" />
                  </div>
                  <p className="text-black font-poppins font-medium text-lg sm:text-xl text-center">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
