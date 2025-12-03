// packages/ui/src/components/AuthModal/AuthModal.tsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import MobileInputScreen from "./MobileInputScreen";
import LoginSignupScreen from "./LoginSignupScreen";
import MessageToast from "./MessageToast";
import CloseButton from "./CloseButton";
import { useRoleStore } from "../../store/roleStore";
import useUserListingsStore from "../../../apps/rentals/src/app/store/userListingsStore";
import useActionsListingsStore from "../../../apps/rentals/src/app/store/actionsListingsStore";
import useTransactionsStore from "../../store/transactionsStore";
import { STUDIO_BASE } from "@packages/config/constants";
import MobileVerificationScreen from "./MobileVerificationScreen";

const apiUrl = import.meta.env.VITE_API_URL as string;
const jwtSecretKey = import.meta.env.VITE_JWT_SECRET_KEY as string;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerBy?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, triggerBy = "/" }) => {
  const { setUserData } = useRoleStore();
  const { fetchUserListings } = useUserListingsStore();
  const { fetchActionsListings } = useActionsListingsStore();
  const { fetchUserTransactions } = useTransactionsStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLogin, setIsLogin] = React.useState(true);
  const [isMobileConfirmed, setIsMobileConfirmed] = React.useState(false);
  const [afterLoginIsMobile, setAfterLoginIsMobile] = React.useState(false);
  const [afterLoginData, setAfterLoginData] = React.useState<any>({});
  const [referralCode, setReferralCode] = React.useState("");

  const shared = {
    isLogin,
    setIsLogin,
    isMobileConfirmed,
    setIsMobileConfirmed,
    afterLoginIsMobile,
    setAfterLoginIsMobile,
    afterLoginData,
    setAfterLoginData,
    referralCode,
    setReferralCode,
    triggerBy,
    navigate,
    onClose,
    setUserData,
    fetchUserListings,
    fetchActionsListings,
    fetchUserTransactions,
  };

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setReferralCode(ref);
  }, [searchParams]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      setIsLogin(true);
      setIsMobileConfirmed(false);
      setAfterLoginIsMobile(false);
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 overflow-y-auto">
      <div
        className={`relative mx-5 w-full max-w-xl lg:max-w-2xl bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row ${
          isLogin ? "flex-row-reverse" : ""
        }`}
      >
        {/* Left Logo */}
        <div className="w-full bg-[#001433] h-24 md:min-h-[440px] md:rounded-r-full md:w-1/2 flex items-center justify-center p-6">
          <img src="/RUFRENT6.png" alt="logo" className="h-12" />
        </div>

        {/* Right Content */}
        <div className="relative w-full md:w-1/2 p-6 flex flex-col justify-center items-center">
          <MessageToast />
          <CloseButton onClose={onClose} />

          {((!isLogin && !isMobileConfirmed) || afterLoginIsMobile) ? (
            <MobileVerificationScreen {...shared} />
          ) : (
            <LoginSignupScreen {...shared} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;