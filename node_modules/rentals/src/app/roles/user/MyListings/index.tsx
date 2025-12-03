import { useEffect, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

import apiStatusConstants from "../../../../../../../packages/servivces/utils/apiStatus";
import LoadingView from "../../../../../../../packages/ui/Shared/LoadingView";
import FailureView from "../../../../../../../packages/ui/Shared/FailureView";
import MyListingCardView from "./MyListingsCardView";
import { useRoleStore } from "../../../../../../../packages/store/roleStore";
import useUserListingsStore from "../../../store/userListingsStore";
import PaginationControls from "./PaginationControls";
import Cookies from "js-cookie";
import tailwindStyles from "@packages/styles/tailwindStyles";

const jwtSecretKey: string = `${import.meta.env.VITE_JWT_SECRET_KEY}`;

// ----------------------
// Types
// ----------------------
interface ListingItem {
  id: number | string;
  [key: string]: any;
}

interface ApiResponse {
  status: string;
  data: ListingItem[];
}

interface AnimatedMessageProps {}

// ----------------------
// Animated Component
// ----------------------
const AnimatedMessage: React.FC<AnimatedMessageProps> = () => {
  const wrapperStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "1rem",
    overflow: "hidden",
  };

  const textContainerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    animation: "slideText 10s 5",
  };

  return (
    <>
      <style>
        {`
          @keyframes slideText {
            0% { transform: translateX(-100vw); opacity: 0; }
            20% { transform: translateX(0); opacity: 1; }
            60% { transform: translateX(0); opacity: 1; }
            80% { transform: translateX(100vw); opacity: 0; }
            100% { transform: translateX(100vw); opacity: 0; }
          }
        `}
      </style>

      <div style={wrapperStyle}>
        <div style={textContainerStyle}>
          <p className={tailwindStyles.heading_2}>No Brokerage is Charged</p>
        </div>
      </div>
    </>
  );
};

// ----------------------
// Main Component
// ----------------------
const MyListingsView: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useRoleStore();
  const { apiResponse, currentPage, fetchUserListings } = useUserListingsStore();

  const jwtToken = Cookies.get(jwtSecretKey);
  const userId = userData?.id;

  useEffect(() => {
    if (!jwtToken) {
      navigate("/");
    } else if (userId) {
      fetchUserListings(userId);
    }
  }, [jwtToken, userId, fetchUserListings, navigate, currentPage]);

  const renderListingView = () => {
    switch (apiResponse.status) {
      case apiStatusConstants.inProgress:
        return <LoadingView />;

      case apiStatusConstants.success:
        return (
          <>
            <div className="flex flex-wrap gap-4 justify-center">
              {apiResponse.data.length > 0 ? (
                apiResponse.data.map((each: ListingItem) => (
                  <MyListingCardView
                    key={each.id}
                    property={each}
                    timeText="Posted At"
                  />
                ))
              ) : (
                <div className="flex items-center justify-center min-h-[70vh] font-bold text-2xl">
                  Your Listings Not Found
                </div>
              )}
            </div>

            {/* Pagination */}
            {apiResponse.data.length > 0 && userId && (
              <PaginationControls userId={userId} />
            )}
          </>
        );

      case apiStatusConstants.failure:
        return <FailureView />;

      default:
        return <div>No Listings Available</div>;
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen p-5">
      {/* <AnimatedMessage /> */}
      {renderListingView()}
    </div>
  );
};

export default MyListingsView;
