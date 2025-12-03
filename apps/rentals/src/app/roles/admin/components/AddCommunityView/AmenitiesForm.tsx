// src/pages/Admin/Communities/AmenitiesForm.tsx
import React, { useEffect, useState, ChangeEvent } from "react";
import {
  fetchBuilders,
  fetchCommunities,
  fetchAmenityCategories,
  fetchAmenities,
  importAmenities,
  addAmenities,
} from "@/app/shared/services/api/index";
import {
  SectionCard,
  CitySelect,
  BuilderSelect,
  CommunitySelect,
} from "./CommunitiesCommon";

interface City {
  id: string | number;
  name: string;
}

interface Builder {
  id: string | number;
  name: string;
}

interface Community {
  id: string | number;
  name: string;
}

interface AmenityCategory {
  id: string | number;
  amenity_category: string;
}

interface Amenity {
  id: string | number;
  amenity_name: string;
}

interface AmenitiesFormProps {
  cities: City[];
}

const AmenitiesForm: React.FC<AmenitiesFormProps> = ({ cities }) => {
  const [showImportForm, setShowImportForm] = useState<boolean>(false);

  // === Add Amenities States ===
  const [amenityCity, setAmenityCity] = useState<string>("");
  const [amenityBuilders, setAmenityBuilders] = useState<Builder[]>([]);
  const [amenityBuilder, setAmenityBuilder] = useState<string>("");
  const [amenityCommunities, setAmenityCommunities] = useState<Community[]>([]);
  const [selectedCommunityForAmenity, setSelectedCommunityForAmenity] = useState<string>("");

  const [amenitiesCategories, setAmenitiesCategories] = useState<AmenityCategory[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenityCategory, setSelectedAmenityCategory] = useState<string>("");
  const [selectedAmenities, setSelectedAmenities] = useState<(string | number)[]>([]);

  // === Import Amenities States ===
  const [sourceCommunityId, setSourceCommunityId] = useState<string>("");
  const [targetCity, setTargetCity] = useState<string>("");
  const [targetBuilders, setTargetBuilders] = useState<Builder[]>([]);
  const [targetBuilder, setTargetBuilder] = useState<string>("");
  const [targetCommunities, setTargetCommunities] = useState<Community[]>([]);
  const [targetCommunityId, setTargetCommunityId] = useState<string>("");

  // === Effects ===

  // Builders for "Add Amenities" city
  useEffect(() => {
    const loadBuilders = async () => {
      if (!amenityCity) {
        setAmenityBuilders([]);
        setAmenityBuilder("");
        setAmenityCommunities([]);
        setSelectedCommunityForAmenity("");
        setSourceCommunityId(""); // Also affects import tab
        return;
      }
      try {
        const { data } = await fetchBuilders(amenityCity);
        setAmenityBuilders(data.result || []);
      } catch (err) {
        console.error("Failed to fetch builders:", err);
        setAmenityBuilders([]);
      }
    };
    loadBuilders();
  }, [amenityCity]);

  // Communities for "Add Amenities" builder (also used in Import → Source)
  useEffect(() => {
    const loadCommunities = async () => {
      if (!amenityBuilder) {
        setAmenityCommunities([]);
        setSelectedCommunityForAmenity("");
        setSourceCommunityId("");
        return;
      }
      try {
        const { data } = await fetchCommunities(amenityBuilder);
        setAmenityCommunities(data.result || []);
      } catch (err) {
        console.error("Failed to fetch communities:", err);
        setAmenityCommunities([]);
      }
    };
    loadCommunities();
  }, [amenityBuilder]);

  // Amenity Categories (global)
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchAmenityCategories();
        setAmenitiesCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch amenity categories:", err);
        setAmenitiesCategories([]);
      }
    };
    loadCategories();
  }, []);

  // Amenities list based on community + category
  useEffect(() => {
    const loadAmenities = async () => {
      if (!selectedCommunityForAmenity || !selectedAmenityCategory) {
        setAmenities([]);
        return;
      }
      try {
        const data = await fetchAmenities(selectedCommunityForAmenity, selectedAmenityCategory);
        setAmenities(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch amenities:", err);
        setAmenities([]);
      }
    };
    loadAmenities();
  }, [selectedCommunityForAmenity, selectedAmenityCategory]);

  // Target Builders (Import tab)
  useEffect(() => {
    const loadTargetBuilders = async () => {
      if (!targetCity) {
        setTargetBuilders([]);
        setTargetBuilder("");
        setTargetCommunities([]);
        setTargetCommunityId("");
        return;
      }
      try {
        const { data } = await fetchBuilders(targetCity);
        setTargetBuilders(data.result || []);
      } catch (err) {
        console.error("Failed to fetch target builders:", err);
        setTargetBuilders([]);
      }
    };
    loadTargetBuilders();
  }, [targetCity]);

  // Target Communities (Import tab)
  useEffect(() => {
    const loadTargetCommunities = async () => {
      if (!targetBuilder) {
        setTargetCommunities([]);
        setTargetCommunityId("");
        return;
      }
      try {
        const { data } = await fetchCommunities(targetBuilder);
        setTargetCommunities(data.result || []);
      } catch (err) {
        console.error("Failed to fetch target communities:", err);
        setTargetCommunities([]);
      }
    };
    loadTargetCommunities();
  }, [targetBuilder]);

  // === Handlers ===

  const handleAmenityCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedAmenityCategory(value);
    setAmenities([]);
    setSelectedAmenities([]);
  };

  const handleAmenityToggle = (amenityId: string | number) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleSaveAmenities = async () => {
    if (!selectedCommunityForAmenity) {
      alert("Please select a community.");
      return;
    }
    if (selectedAmenities.length === 0) {
      alert("Please select at least one amenity.");
      return;
    }

    const payload = {
      community_id: Number(selectedCommunityForAmenity),
      amenity_ids: selectedAmenities.map(Number),
    };

    try {
      const { message } = await addAmenities(payload);
      alert(message?.includes("successfully") ? message : "Amenities saved!");
      setSelectedAmenities([]); // Reset selection
    } catch (err) {
      console.error(err);
      alert("Failed to save amenities.");
    }
  };

  const handleImportAmenities = async () => {
    if (!sourceCommunityId || !targetCommunityId) {
      alert("Please select both source and target communities.");
      return;
    }

    try {
      const { message } = await importAmenities(sourceCommunityId, targetCommunityId);
      alert(message?.includes("completed") ? "Amenities imported successfully!" : message || "Import completed.");
    } catch (err) {
      console.error(err);
      alert("Failed to import amenities.");
    }
  };

  return (
    <SectionCard>
      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex -mb-px">
          <button
            onClick={() => setShowImportForm(false)}
            className={`py-3 px-6 font-semibold text-sm transition-colors ${
              !showImportForm
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Add Amenities
          </button>
          <button
            onClick={() => setShowImportForm(true)}
            className={`py-3 px-6 font-semibold text-sm transition-colors ${
              showImportForm
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Import Amenities
          </button>
        </div>
      </div>

      {/* ADD AMENITIES TAB */}
      {!showImportForm ? (
        <div className="space-y-6">
          {/* City → Builder → Community */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CitySelect
              id="amenity-city"
              label="City:"
              value={amenityCity}
              onChange={setAmenityCity}
              cities={cities}
            />
            <BuilderSelect
              id="amenity-builder"
              label="Builder:"
              value={amenityBuilder}
              onChange={setAmenityBuilder}
              builders={amenityBuilders}
              disabled={!amenityCity}
            />
            <CommunitySelect
              id="amenity-community"
              label="Community:"
              value={selectedCommunityForAmenity}
              onChange={setSelectedCommunityForAmenity}
              communities={amenityCommunities}
              disabled={!amenityBuilder}
              placeholder="Select Community"
            />
          </div>

          {/* Amenity Category */}
          <div>
            <label htmlFor="amenity-category" className="block text-sm font-medium text-gray-700 mb-2">
              Select Amenity Category
            </label>
            <select
              id="amenity-category"
              value={selectedAmenityCategory}
              onChange={handleAmenityCategoryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedCommunityForAmenity}
            >
              <option value="">Choose Category</option>
              {amenitiesCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.amenity_category}
                </option>
              ))}
            </select>
          </div>

          {/* Amenity Checkboxes */}
          {amenities.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Select Amenities ({selectedAmenities.length} selected)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                {amenities.map((amenity) => (
                  <label
                    key={amenity.id}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity.id)}
                      onChange={() => handleAmenityToggle(amenity.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-800">{amenity.amenity_name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <button
              onClick={handleSaveAmenities}
              disabled={selectedAmenities.length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105 disabled:scale-100"
            >
              Save Selected Amenities
            </button>
          </div>
        </div>
      ) : (
        /* IMPORT AMENITIES TAB */
        <div className="space-y-8">
          {/* Source Community */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Source Community (Copy From)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CitySelect
                id="source-city"
                label="City:"
                value={amenityCity}
                onChange={setAmenityCity}
                cities={cities}
              />
              <BuilderSelect
                id="source-builder"
                label="Builder:"
                value={amenityBuilder}
                onChange={setAmenityBuilder}
                builders={amenityBuilders}
                disabled={!amenityCity}
              />
              <CommunitySelect
                id="source-community"
                label="Source Community:"
                value={sourceCommunityId}
                onChange={setSourceCommunityId}
                communities={amenityCommunities}
                disabled={!amenityBuilder}
                placeholder="Select Source"
              />
            </div>
          </div>

          {/* Target Community */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Target Community (Copy To)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CitySelect
                id="target-city"
                label="City:"
                value={targetCity}
                onChange={setTargetCity}
                cities={cities}
              />
              <BuilderSelect
                id="target-builder"
                label="Builder:"
                value={targetBuilder}
                onChange={setTargetBuilder}
                builders={targetBuilders}
                disabled={!targetCity}
              />
              <CommunitySelect
                id="target-community"
                label="Target Community:"
                value={targetCommunityId}
                onChange={setTargetCommunityId}
                communities={targetCommunities}
                disabled={!targetBuilder}
                placeholder="Select Target"
              />
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <button
              onClick={handleImportAmenities}
              disabled={!sourceCommunityId || !targetCommunityId}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold px-10 py-3 rounded-full shadow-lg transition transform hover:scale-105 disabled:scale-100"
            >
              Import All Amenities
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  );
};

export default AmenitiesForm;