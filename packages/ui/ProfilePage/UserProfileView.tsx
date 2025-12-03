import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

// Reusable dropdown
import CountryDropdown from "../Shared/CountryCodeDropdown";

// Utility for fetching country list
import { getCountries } from "../../utils/getCountries";
import tailwindStyles from "@packages/styles/tailwindStyles";

const endPoint = `${import.meta.env.VITE_API_URL}`;

// ============================
// TYPES
// ============================

// Country type from getCountries()
interface Country {
  name: string;
  code: string;
  flag?: string;
}

// Incoming props
interface UserProfileViewProps {
  userID: string | number;
  profile: Record<string, any> | null;
}

// Local profile structure
interface ProfileDataType {
  [key: string]: any;
}

// Message type
interface MessageType {
  general?: string;
  color?: "red" | "green" | "blue";
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ userID, profile }) => {
  const [profileData, setProfileData] = useState<ProfileDataType | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedAltCountry, setSelectedAltCountry] = useState<Country | null>(null);

  const [updatedData, setUpdatedData] = useState<Record<string, any>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [message, setMessage] = useState<MessageType>({});
  const [isCountryDropdownOpen, setCountryDropdownOpen] = useState<boolean>(false);
  const [isAltCountryDropdownOpen, setAltCountryDropdownOpen] = useState<boolean>(false);

  const [countrySearchTerm, setCountrySearchTerm] = useState<string>("");
  const [altCountrySearchTerm, setAltCountrySearchTerm] = useState<string>("");

  const countryDropdownRef = useRef<HTMLDivElement | null>(null);
  const altCountryDropdownRef = useRef<HTMLDivElement | null>(null);

  const id = userID;

  // Load countries + profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryData: Country[] = await getCountries();
        setCountries(countryData);

        if (!profile) {
          setMessage({ general: "Profile data not found." });
          return;
        }

        const mobileNo = profile.mobile_no || "";
        const altMobileNo = profile.alt_mobile_no || "";

        const countryFromMobile = countryData.find(
          (c) => c.code === mobileNo.slice(0, mobileNo.length - 10)
        );

        const countryFromAltMobile = countryData.find(
          (c) => c.code === altMobileNo.slice(0, altMobileNo.length - 10)
        );

        const india = countryData.find((c) => c.name === "India");

        setSelectedCountry(countryFromMobile || india || null);
        setSelectedAltCountry(countryFromAltMobile || india || null);

        setProfileData(profile);

        setUpdatedData({
          ...profile,
          mobile_no: mobileNo.slice(-10),
          alt_mobile_no: altMobileNo.slice(-10),
        });
      } catch (error) {
        console.error("Error loading data:", error);
        setMessage({ general: "Error loading data." });
      }
    };

    fetchData();
  }, [profile]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setCountryDropdownOpen(false);
      }

      if (
        altCountryDropdownRef.current &&
        !altCountryDropdownRef.current.contains(event.target as Node)
      ) {
        setAltCountryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Save handler
  const handleSave = async () => {
    try {
      const updates: { field: string; value: any }[] = [];

      const newMobile = selectedCountry
        ? `${selectedCountry.code}${updatedData.mobile_no}`
        : updatedData.mobile_no;

      const newAltMobile = selectedAltCountry
        ? `${selectedAltCountry.code}${updatedData.alt_mobile_no}`
        : updatedData.alt_mobile_no;

      if (profileData?.mobile_no !== newMobile) {
        updates.push({ field: "mobile_no", value: newMobile });
      }
      if (profileData?.alt_mobile_no !== newAltMobile) {
        updates.push({ field: "alt_mobile_no", value: newAltMobile });
      }

      for (const field in updatedData) {
        if (
          updatedData[field] !== profileData?.[field] &&
          !["mobile_no", "alt_mobile_no"].includes(field)
        ) {
          updates.push({ field, value: updatedData[field] });
        }
      }

      if (updates.length === 0) {
        setMessage({ general: "No changes detected.", color: "blue" });
        return;
      }

      for (const update of updates) {
        const { field, value } = update;

        const tableName = ["mobile_no", "user_name"].includes(field)
          ? "dy_user"
          : "dy_user_profile";

        const whereCondition =
          tableName === "dy_user" ? `id="${id}"` : `user_id="${id}"`;

        await axios.put(`${endPoint}/updateRecord`, {
          tableName,
          fieldValuePairs: { [field]: value },
          whereCondition,
        });
      }

      setProfileData({ ...updatedData });
      setIsEditing(false);
      setMessage({ general: "Profile updated successfully.", color: "green" });
    } catch (error) {
      console.error("Error saving updates:", error);
      setMessage({ general: "Error saving updates.", color: "red" });
    }

    setTimeout(() => setMessage({}), 3000);
  };

  const handleCancel = () => {
    if (!profileData) return;

    setIsEditing(false);

    setUpdatedData({
      ...profileData,
      mobile_no: profileData.mobile_no?.slice(-10) || "",
      alt_mobile_no: profileData.alt_mobile_no?.slice(-10) || "",
    });

    setMessage({});
  };

  const filterCountries = (list: Country[], term: string) =>
    list.filter((c) =>
      c.name.toLowerCase().includes(term.toLowerCase())
    );

  if (!profileData) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow-sm p-2 rounded-xl w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className={tailwindStyles.heading_2}>Profile</h1>

        <div className="space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className={tailwindStyles.secondaryButton}
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className={`${tailwindStyles.secondaryButton} bg-gray-600 hover:bg-gray-700`}
              >
                Discard
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-1 text-sm font-semibold rounded-md"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {message.general && (
        <div
          className={`mb-4 p-3 rounded-md text-white ${
            message.color === "green"
              ? "bg-green-500"
              : message.color === "blue"
              ? "bg-blue-500"
              : "bg-red-500"
          }`}
        >
          {message.general}
        </div>
      )}

      <div className="grid w-full">
        {["user_name", "email_id", "current_city"].map((field) => (
          <div className="mb-4 w-full" key={field}>
            <label className={tailwindStyles.paragraph_b}>
              {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </label>

            {isEditing && field !== "email_id" ? (
              <input
                type="text"
                value={updatedData[field] || ""}
                onChange={(e) =>
                  setUpdatedData({
                    ...updatedData,
                    [field]: e.target.value,
                  })
                }
                className={`${tailwindStyles.paragraph} border px-4 py-2 rounded-md w-full`}
              />
            ) : (
              <div
                className={`${tailwindStyles.paragraph} border px-4 py-2 rounded-md w-full`}
              >
                {profileData[field] || "N/A"}
              </div>
            )}
          </div>
        ))}

        {/* Mobile Number */}
        <div className="mb-4">
          <label className={tailwindStyles.paragraph_b}>Mobile Number</label>

          <div className="flex flex-row items-center w-full space-x-2">
            <CountryDropdown
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              isDropdownOpen={isCountryDropdownOpen}
              setDropdownOpen={setCountryDropdownOpen}
              searchTerm={countrySearchTerm}
              setSearchTerm={setCountrySearchTerm}
              countries={filterCountries(countries, countrySearchTerm)}
              dropdownRef={countryDropdownRef}
              isEditing={isEditing}
            />

            <input
              type="text"
              placeholder="Mobile Number"
              value={updatedData.mobile_no || ""}
              onChange={(e) =>
                setUpdatedData({
                  ...updatedData,
                  mobile_no: e.target.value.replace(/\D/g, "").slice(-10),
                })
              }
              maxLength={10}
              disabled={!isEditing}
              className={`${tailwindStyles.paragraph} border px-4 py-2 rounded-md w-full`}
            />
          </div>
        </div>

        {/* Alternate Mobile */}
        <div className="mb-4">
          <label className={tailwindStyles.paragraph_b}>Alt Mobile Number</label>

          <div className="flex flex-row items-center w-full space-x-2">
            <CountryDropdown
              selectedCountry={selectedAltCountry}
              setSelectedCountry={setSelectedAltCountry}
              isDropdownOpen={isAltCountryDropdownOpen}
              setDropdownOpen={setAltCountryDropdownOpen}
              searchTerm={altCountrySearchTerm}
              setSearchTerm={setAltCountrySearchTerm}
              countries={filterCountries(countries, altCountrySearchTerm)}
              dropdownRef={altCountryDropdownRef}
              isEditing={isEditing}
            />

            <input
              type="text"
              placeholder="Alt Mobile Number"
              value={updatedData.alt_mobile_no || ""}
              onChange={(e) =>
                setUpdatedData({
                  ...updatedData,
                  alt_mobile_no: e.target.value.replace(/\D/g, "").slice(-10),
                })
              }
              maxLength={10}
              disabled={!isEditing}
              className={`${tailwindStyles.paragraph} border px-4 py-2 rounded-md w-full`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
