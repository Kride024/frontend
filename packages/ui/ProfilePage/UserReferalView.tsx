import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import {
  FaWhatsapp,
  FaFacebook,
  FaX,
  FaEnvelope,
} from "react-icons/fa6";
import tailwindStyles from "@packages/styles/tailwindStyles";

// ---------- Types ----------
interface UserProfileType {
  ref_code?: string;
  [key: string]: any;
}

interface CoinsHistoryType {
  svc_id: number;
  earned_coins?: number;
  redeemed_coins?: number;
  time_earned_coins?: string;
  time_redeemed_coins?: string;
}

interface UserReferralViewProps {
  userID: string | number;
  profile: UserProfileType | null;
  userCoins: number[];
  userCoinsHistory: CoinsHistoryType[];
}

interface ServiceType {
  id: number;
  imgSrc: string;
  title: string;
  coins: number;
}

interface CoinHistoryItemType {
  date: string;
  type: "Earning" | "Redemption";
  reason: string;
  amount: number;
}

// ---------- Static Services ----------
const services: ServiceType[] = [
  { id: 1, imgSrc: "/Package/Package_Image_1.png", title: "Rental Agreements", coins: 2500 },
  { id: 2, imgSrc: "/Package/Package_Image_2.png", title: "360° Photo Shoot", coins: 2000 },
  { id: 3, imgSrc: "/Package/Package_Image_3.png", title: "T-shirt", coins: 1000 },
  { id: 4, imgSrc: "/Package/Package_Image_4.png", title: "Deep Cleaning Service", coins: 3000 },
];

const UserReferralView: React.FC<UserReferralViewProps> = ({
  userID,
  profile,
  userCoins,
  userCoinsHistory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCoinHistoryModalOpen, setIsCoinHistoryModalOpen] = useState<boolean>(false);
  const [referralCode, setReferralCode] = useState<string>("");
  const [signupLink, setSignupLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [coinHistory, setCoinHistory] = useState<CoinHistoryItemType[]>([]);
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [totalRedeemed, setTotalRedeemed] = useState<number>(0);
  const [totalRemaining, setTotalRemaining] = useState<number>(0);

  // ---------- Fetch User Data ----------
  useEffect(() => {
    const fetchUserData = () => {
      try {
        if (profile?.ref_code) setReferralCode(profile.ref_code);

        if (userCoins?.length === 3) {
          setTotalEarned(userCoins[0] || 0);
          setTotalRedeemed(userCoins[1] || 0);
          setTotalRemaining(userCoins[2] || 0);
        }

        if (Array.isArray(userCoinsHistory)) {
          const history: CoinHistoryItemType[] = userCoinsHistory.map((item) => ({
            date: item.time_earned_coins || item.time_redeemed_coins
              ? new Date(item.time_earned_coins || item.time_redeemed_coins).toLocaleDateString()
              : "NA",
            type: item.earned_coins ? "Earning" : "Redemption",
            reason: getReason(item.svc_id, item.earned_coins ? "Earning" : "Redemption"),
            amount: item.earned_coins || item.redeemed_coins || 0,
          }));

          setCoinHistory(history);
        }
      } catch (error) {
        console.error("Error fetching referral data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userID, profile, userCoins, userCoinsHistory]);

  // ---------- Generate Signup Link ----------
  useEffect(() => {
    if (referralCode) {
      setSignupLink(`https://www.rufrent.com/signup?ref=${referralCode}`);
    }
  }, [referralCode]);

  // ---------- Helper: Get Reason ----------
  const getReason = (svcId: number, type: "Earning" | "Redemption") => {
    if (type === "Earning") return "First Transaction by Referral";

    const reasons: Record<number, string> = {
      1: "Rental Agreement",
      2: "Photo Shoot",
      3: "Deep Cleaning",
      4: "T-Shirt",
    };

    return reasons[svcId] || "Unknown Service";
  };

  // ---------- Sharing ----------
  const shareLink = (platform: string) => {
    const message = `Sign up with this link: ${signupLink} and get rewards!`;

    switch (platform) {
      case "whatsapp":
        navigator.clipboard.writeText(message).then(() =>
          window.open(
            `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
            "_blank"
          )
        );
        break;

      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(signupLink)}`,
          "_blank"
        );
        break;

      case "email":
        window.location.href = `mailto:?subject=Join and Earn Rewards!&body=${encodeURIComponent(
          message
        )}`;
        break;

      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(signupLink)}`,
          "_blank"
        );
        break;
    }
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(signupLink);
    alert("Referral link copied!");
  };

  // ---------- UI Components (Typed) ----------
  const ServiceCard: React.FC<{ service: ServiceType }> = ({ service }) => (
    <div className="flex flex-col items-center bg-gray-50 rounded-lg p-4 border border-gray-100 hover:bg-gray-100 transition-all duration-200">
      <img src={service.imgSrc} alt={service.title} className="w-9 h-9" />
      <p className={`${tailwindStyles.heading_3} my-2 text-center`}>{service.title}</p>

      <div className="flex items-center space-x-2">
        <img src="/Profile/COIN.png" alt="coin" className="w-6 h-6" />
        <p className={tailwindStyles.heading_3}>{service.coins}</p>
      </div>

      <button className={tailwindStyles.secondaryButton}>Redeem</button>
    </div>
  );

  // ---------- Render ----------
  return (
    <div className="p-2">
      <div className="max-w-6xl mx-auto">
        {/* Coin Balance */}
        <div className="flex flex-col sm:flex-row items-center mb-4 relative">
          {/* Coin Balance Card */}
          <div className="w-full bg-gradient-to-br from-yellow-500 to-yellow-200 rounded-xl shadow-sm border p-6">
            <h1 className={tailwindStyles.heading_2}>Coin Balance</h1>

            <div className="mt-3">
              <div className="flex justify-between">
                <h1 className={tailwindStyles.heading_3}>Available Coins</h1>
                <div className="flex items-center space-x-4">
                  <p className="text-3xl font-bold">{totalRemaining}</p>
                  <img src="/Profile/COINS.png" className="h-12 w-12" />
                </div>
              </div>

              <div className="mt-3 flex justify-between">
                <p className={tailwindStyles.heading_3}>
                  <span className="text-green-600">Earned:</span> +{totalEarned}
                </p>
                <p className={tailwindStyles.heading_3}>
                  <span className="text-red-600">Redeemed:</span> -{totalRedeemed}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                className={`${tailwindStyles.secondaryButton} w-full`}
                onClick={() => setIsModalOpen(true)}
              >
                Refer & Earn
              </button>

              <button
                className={`${tailwindStyles.secondaryButton} w-full`}
                onClick={() => setIsCoinHistoryModalOpen(true)}
              >
                Coins History
              </button>
            </div>
          </div>

          {/* Coin History Modal */}
          {isCoinHistoryModalOpen && (
            <div className="absolute top-20 md:top-[85%] md:right-5 w-full md:w-96 bg-white rounded-xl shadow-lg border p-5 z-20">
              <div className="flex justify-between mb-4">
                <h2 className={tailwindStyles.heading_3}>Coin History</h2>
                <button onClick={() => setIsCoinHistoryModalOpen(false)}>
                  <FaTimes />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-4">
                {coinHistory.length > 0 ? (
                  coinHistory.map((h, i) => (
                    <div key={i} className="flex justify-between pb-2 border-b">
                      <div>
                        <p className="font-medium text-gray-800">{h.date}</p>
                        <p className={tailwindStyles.paragraph}>{h.reason}</p>
                      </div>

                      <div
                        className={`font-semibold ${
                          h.type === "Earning" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {h.type === "Earning" ? "+" : "-"} {h.amount} 🪙
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No Coin History</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Services Section */}
        <div className="p-2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-900 via-gray-700 to-gray-900 opacity-90 flex items-center justify-center rounded-xl z-10">
            <h1 className="text-white text-4xl font-bold">Coming Soon ...</h1>
          </div>

          <h2 className={`${tailwindStyles.heading_2} mb-4 text-center`}>
            Available Redeemable Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>

        {/* Referral Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="bg-white rounded-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between mb-4">
                <h2 className={tailwindStyles.heading_3}>Share Referral Link</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="flex justify-center gap-4 mb-6">
                {[
                  { Icon: FaWhatsapp, color: "bg-green-500", platform: "whatsapp" },
                  { Icon: FaEnvelope, color: "bg-gray-900", platform: "email" },
                  { Icon: FaFacebook, color: "bg-blue-600", platform: "facebook" },
                  { Icon: FaX, color: "bg-gray-900", platform: "twitter" },
                ].map(({ Icon, color, platform }) => (
                  <button
                    key={platform}
                    className={`w-12 h-12 ${color} rounded-full flex items-center justify-center text-white`}
                    onClick={() => shareLink(platform)}
                  >
                    <Icon size={24} />
                  </button>
                ))}
              </div>

              <div className="flex items-center bg-gray-50 rounded-lg p-3 border">
                <input
                  type="text"
                  value={isLoading ? "Loading..." : signupLink || "No referral link"}
                  readOnly
                  className="flex-1 bg-transparent text-sm"
                />
                <button
                  className={tailwindStyles.secondaryButton}
                  onClick={copyReferral}
                  disabled={isLoading || !signupLink}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserReferralView;
