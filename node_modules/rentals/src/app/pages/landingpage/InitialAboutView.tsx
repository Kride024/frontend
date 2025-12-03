// apps/rentals/src/app/pages/InitialAboutView.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import AuthModal from "../../../../../../packages/ui/AuthModal/AuthModal";
import { RENTALS_BASE } from "../../../../../../packages/config/constants";
import tailwindStyles from "../../../../../../packages/styles/tailwindStyles";

const jwtSecretKey = `${import.meta.env.VITE_JWT_SECRET_KEY}`;

const InitialAboutView: React.FC = () => {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState<boolean>(false);

  const jwtToken = Cookies.get(jwtSecretKey);
  const isLogin = jwtToken !== undefined;

  const handleLinkClick = (path?: string): void => {
    if (!isLogin) {
      setLoginOpen(true);
    } else {
      navigate(`${RENTALS_BASE}/postProperties`);
    }
  };

  const closeModel = (): void => setLoginOpen(false);

  return (
    <>
      <div id="about">
        <section className="p-5 md:p-10 bg-white text-center space-y-4">
          <h2 className={`${tailwindStyles.heading} text-xl font-bold mb-4`}>
            The Privileged Owners of Premium Gated Communities in Hyderabad
          </h2>

          <p className={`${tailwindStyles.paragraph_l}`}>
            Find the Perfect Tenant effortlessly!
          </p>

          <div
            onClick={handleLinkClick}
            className={`${tailwindStyles.secondaryButton} flex justify-center justify-self-center items-center h-7 rounded-md cursor-pointer`}
          >
            <div className="font-semibold text-sm pb-0.5 mr-2">
              Post Property
            </div>

            <div className="bg-green-700 text-white font-bold text-xs px-2 rounded-sm relative inline-block">
              FREE
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-green-300 transform animate-pulse"></div>
            </div>
          </div>
        </section>
      </div>

      <AuthModal
        isOpen={loginOpen}
        onClose={closeModel}
        triggerBy={`${RENTALS_BASE}/postProperties`}
      />
    </>
  );
};

export default InitialAboutView;
