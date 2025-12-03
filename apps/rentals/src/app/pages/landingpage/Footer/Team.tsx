// src/components/.../Team.tsx
import React from "react";
import tailwindStyles from "../../../../../../../packages/styles/tailwindStyles";

const Team: React.FC = () => {
  return (
    <>
      <div className="max-w-4xl mt-20 lg:mt-12 mx-auto p-4 pt-2 bg-white shadow-lg rounded-lg border border-[#ffc107]">
        {/* Header Section */}
        <div className="text-center mt-2">
          <h1 className={tailwindStyles.heading_2}>Meet the Team Behind Rufrent</h1>
          <p className={`${tailwindStyles.paragraph} mt-2 text-gray-700`}>
            At Rufrent, we are a passionate team ... (content unchanged)
          </p>
        </div>

        {/* Leadership */}
        <div className="mt-6">
          <h2 className={`${tailwindStyles.heading_3} text-gray-800`}>
            👨‍💼 Leadership & Visionaries
          </h2>
          <p className={`${tailwindStyles.paragraph} mt-2 text-gray-700`}>
            Our leadership team comprises industry experts ...
          </p>
        </div>

        {/* Tech Team */}
        <div className="mt-6 p-4 bg-[#e7eff7]">
          <h2 className={tailwindStyles.heading_3}>💻 Technology & Product Team</h2>
          <p className={`${tailwindStyles.paragraph} mt-2`}>
            Our tech innovators ensure that Rufrent remains ...
          </p>
        </div>

        {/* Customer Success */}
        <div className="mt-6 p-4 bg-white">
          <h2 className={tailwindStyles.heading_3}>📞 Customer Success & Support</h2>
          <p className={`${tailwindStyles.paragraph} mt-2`}>
            A dedicated team that works round the clock ...
          </p>
        </div>

        {/* Operations */}
        <div className="mt-6 p-4 bg-[#e7eff7]">
          <h2 className={tailwindStyles.heading_3}>🏡 Community & Operations Team</h2>
          <p className={`${tailwindStyles.paragraph} mt-2`}>
            The backbone of Rufrent's premium property listings ...
          </p>
        </div>

        {/* Conclusion */}
        <div className="mt-6 text-center bg-white">
          <h2 className={tailwindStyles.heading_3}>🚀 Welcome to the Future of Home Rentals!</h2>
          <p className={`${tailwindStyles.paragraph} mt-2`}>
            At Rufrent, our goal is simple — create the most transparent, reliable rental ecosystem.
          </p>
        </div>
      </div>
    </>
  );
};

export default Team;
