// src/pages/Admin/Communities/Communities.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  fetchCities,
  fetchAllCommunities,
} from "@/app/shared/services/api/index";
import AddCommunityForm from "./AddCommunityForm";
import AmenitiesForm from "./AmenitiesForm";
import LandmarksForm from "./LandmarksForm";

interface City {
  id: string | number;
  name: string;
  // Add other fields if needed from your API
}

interface Community {
  id: string | number;
  name: string;
  builder_id?: string | number;
  city?: string;
  // Extend as per your actual community structure
}

type ActiveTab = "community" | "amenities" | "landmarks";

const Communities: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [allCommunities, setAllCommunities] = useState<Community[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("community");

  // Refs for smooth scrolling
  const communityFormRef = useRef<HTMLDivElement>(null);
  const amenitiesFormRef = useRef<HTMLDivElement>(null);
  const landmarksFormRef = useRef<HTMLDivElement>(null);

  // Fetch cities on mount
  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await fetchCities();
        const cityList = response?.data?.result || [];
        setCities(Array.isArray(cityList) ? cityList : []);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
        setCities([]);
      }
    };
    loadCities();
  }, []);

  // Fetch all communities (used in LandmarksForm for selection)
  useEffect(() => {
    const loadAllCommunities = async () => {
      try {
        const response = await fetchAllCommunities();
        const communityList = response?.data?.result || [];
        setAllCommunities(Array.isArray(communityList) ? communityList : []);
      } catch (error) {
        console.error("Failed to fetch all communities:", error);
        setAllCommunities([]);
      }
    };
    loadAllCommunities();
  }, []);

  // Smooth scroll helper with slight delay for tab state update
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  };

  const handleTabClick = (tab: ActiveTab, ref: React.RefObject<HTMLDivElement>) => {
    setActiveTab(tab);
    scrollToSection(ref);
  };

  return (
    <div className="p-6 lg:p-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Communities Management
          </h2>
          <p className="mt-2 text-indigo-100">
            Add and manage communities, amenities, and landmarks
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 p-8 bg-gray-50 border-b">
          <button
            onClick={() => handleTabClick("community", communityFormRef)}
            className={`px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
              activeTab === "community"
                ? "bg-green-600 text-white"
                : "bg-white text-green-600 hover:bg-green-50"
            }`}
          >
            Add Community
          </button>
          <button
            onClick={() => handleTabClick("amenities", amenitiesFormRef)}
            className={`px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
              activeTab === "amenities"
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 hover:bg-blue-50"
            }`}
          >
            Manage Amenities
          </button>
          <button
            onClick={() => handleTabClick("landmarks", landmarksFormRef)}
            className={`px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
              activeTab === "landmarks"
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-600 hover:bg-purple-50"
            }`}
          >
            Add Landmark
          </button>
        </div>

        <div className="p-6 lg:p-10 space-y-16">
          {/* Add Community Section */}
          <section ref={communityFormRef}>
            {activeTab === "community" && cities.length > 0 ? (
              <AddCommunityForm cities={cities} />
            ) : activeTab === "community" ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading cities...</p>
              </div>
            ) : null}
          </section>

          {/* Amenities Section */}
          <section ref={amenitiesFormRef}>
            {activeTab === "amenities" && cities.length > 0 ? (
              <AmenitiesForm cities={cities} />
            ) : activeTab === "amenities" ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading cities...</p>
              </div>
            ) : null}
          </section>

          {/* Landmarks Section */}
          <section ref={landmarksFormRef}>
            {activeTab === "landmarks" && cities.length > 0 && allCommunities.length > 0 ? (
              <LandmarksForm cities={cities} allCommunities={allCommunities} />
            ) : activeTab === "landmarks" ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {cities.length === 0 ? "Loading cities..." : "Loading communities..."}
                </p>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Communities;