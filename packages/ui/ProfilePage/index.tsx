// Profile.tsx
import React, { useEffect, useState } from "react";
import { fetchUserProfileDetails } from "@/app/shared/services/api/userApi";
import { useRoleStore } from "../../store/roleStore";

import UserProfileView from "./UserProfileView";
import UserReferralView from "./UserReferalView";

// =========================
// Types
// =========================

interface UserData {
  id: string | number;
  [key: string]: any;
}

interface ProfileType {
  [key: string]: any;
}

interface CoinsHistoryType {
  [key: string]: any;
}

interface FetchUserProfileResponse {
  data: {
    result: ProfileType[];
    coins_history: CoinsHistoryType[];
    total_earned: number;
    total_redeemed: number;
    total_remaining: number;
  };
}

// =========================
// Component
// =========================

const Profile: React.FC = () => {
  const { userData } = useRoleStore();

  const userId: string | number = userData?.id;

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [userCoinsHistory, setUserCoinsHistory] = useState<CoinsHistoryType[]>(
    []
  );
  const [userCoins, setUserCoins] = useState<number[]>([]);

  useEffect(() => {
    const initialRender = async () => {
      try {
        const response = (await fetchUserProfileDetails(
          userId
        )) as FetchUserProfileResponse;

        setProfile(response.data.result[0]);
        setUserCoinsHistory(response.data.coins_history);
        setUserCoins([
          response.data.total_earned,
          response.data.total_redeemed,
          response.data.total_remaining,
        ]);
      } catch (error) {
        console.log(`Error at userProfile: ${error}`);
      }
    };

    if (userId) initialRender();
  }, [userId]);

  return (
    <div className="p-4 md:px-5 md:py-5 lg:px-10 lg:py-5 bg-gray-200 min-h-[calc(100vh-57px)]">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-white shadow-sm p-4 rounded-xl w-full md:w-[40%] lg:w-[30%]">
          <UserProfileView userID={userId} profile={profile} />
        </div>

        <div className="bg-white shadow-sm p-4 rounded-xl w-full md:w-[60%] lg:w-[70%] min-h-[calc(100vh-150px)]">
          <UserReferralView
            userID={userId}
            profile={profile}
            userCoins={userCoins}
            userCoinsHistory={userCoinsHistory}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
