// src/pages/Admin/Communities/LandmarksForm.tsx
import React, { useEffect, useState, ChangeEvent } from "react";
import {
  fetchBuilders,
  fetchCommunities,
  fetchLandmarkCategories,
  addLandmarks,
  importLandmarks,
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
  builder_id?: string | number;
}

interface LandmarkCategory {
  id: string | number;
  landmark_category: string;
}

interface LandmarkInput {
  category: string;
  name: string;
  distance: string;
}

interface LandmarksFormProps {
  cities: City[];
  allCommunities: Community[];
}

const LandmarksForm: React.FC<LandmarksFormProps> = ({ cities, allCommunities }) => {
  const [showImportForm, setShowImportForm] = useState<boolean>(false);

  // Add Landmarks States
  const [landmarkCity, setLandmarkCity] = useState<string>("");
  const [landmarkBuilders, setLandmarkBuilders] = useState<Builder[]>([]);
  const [landmarkBuilder, setLandmarkBuilder] = useState<string>("");
  const [landmarkCommunities, setLandmarkCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string>("");

  const [landmarkCategories, setLandmarkCategories] = useState<LandmarkCategory[]>([]);
  const [landmarks, setLandmarks] = useState<LandmarkInput[]>([
    { category: "", name: "", distance: "" },
  ]);

  // Import States
  const [sourceCommunityId, setSourceCommunityId] = useState<string>("");
  const [targetCommunityId, setTargetCommunityId] = useState<string>("");

  // Fetch Builders when city changes
  useEffect(() => {
    const loadBuilders = async () => {
      if (!landmarkCity) {
        setLandmarkBuilders([]);
        setLandmarkBuilder("");
        setLandmarkCommunities([]);
        setSelectedCommunity("");
        return;
      }
      try {
        const { data } = await fetchBuilders(landmarkCity);
        setLandmarkBuilders(data.result || []);
      } catch (err) {
        console.error("Failed to fetch builders:", err);
        setLandmarkBuilders([]);
      }
    };
    loadBuilders();
  }, [landmarkCity]);

  // Fetch Communities when builder changes
  useEffect(() => {
    const loadCommunities = async () => {
      if (!landmarkBuilder) {
        setLandmarkCommunities([]);
        setSelectedCommunity("");
        return;
      }
      try {
        const { data } = await fetchCommunities(landmarkBuilder);
        setLandmarkCommunities(data.result || []);
      } catch (err) {
        console.error("Failed to fetch communities:", err);
        setLandmarkCommunities([]);
      }
    };
    loadCommunities();
  }, [landmarkBuilder]);

  // Fetch Landmark Categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchLandmarkCategories();
        setLandmarkCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch landmark categories:", err);
        setLandmarkCategories([]);
      }
    };
    loadCategories();
  }, []);

  // Handlers
  const handleAddLandmarkRow = () => {
    setLandmarks((prev) => [...prev, { category: "", name: "", distance: "" }]);
  };

  const handleLandmarkChange = (
    index: number,
    field: keyof LandmarkInput,
    value: string
  ) => {
    setLandmarks((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveLandmarkRow = (index: number) => {
    if (landmarks.length === 1) return;
    setLandmarks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveLandmarks = async () => {
    if (!selectedCommunity) {
      alert("Please select a community.");
      return;
    }

    const hasEmptyFields = landmarks.some(
      (l) => !l.category || !l.name.trim() || !l.distance.trim()
    );
    if (hasEmptyFields) {
      alert("Please fill all landmark fields.");
      return;
    }

    const payload = {
      community_id: Number(selectedCommunity),
      landmarks: landmarks.map((l) => ({
        landmark_name: l.name.trim(),
        distance: parseFloat(l.distance) || 0,
        landmark_category_id: Number(l.category),
      })),
    };

    try {
      const { message } = await addLandmarks(payload);
      alert(message?.includes("successfully") ? "Landmarks saved successfully!" : message || "Saved!");
      // Reset form
      setLandmarks([{ category: "", name: "", distance: "" }]);
    } catch (err) {
      console.error(err);
      alert("Failed to save landmarks.");
    }
  };

  const handleImportLandmarks = async () => {
    if (!sourceCommunityId || !targetCommunityId) {
      alert("Please select both source and target communities.");
      return;
    }
    if (sourceCommunityId === targetCommunityId) {
      alert("Source and target communities must be different.");
      return;
    }

    try {
      const { message } = await importLandmarks(sourceCommunityId, targetCommunityId);
      alert(message?.includes("completed") ? "Landmarks imported successfully!" : message || "Import completed.");
    } catch (err) {
      console.error(err);
      alert("Failed to import landmarks.");
    }
  };

  return (
    <SectionCard title="Landmarks Management">
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
            Add Landmarks
          </button>
          <button
            onClick={() => setShowImportForm(true)}
            className={`py-3 px-6 font-semibold text-sm transition-colors ${
              showImportForm
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Import Landmarks
          </button>
        </div>
      </div>

      {/* City & Builder Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <CitySelect
          id="landmark-city"
          label="City:"
          value={landmarkCity}
          onChange={setLandmarkCity}
          cities={cities}
        />
        <BuilderSelect
          id="landmark-builder"
          label="Builder:"
          value={landmarkBuilder}
          onChange={setLandmarkBuilder}
          builders={landmarkBuilders}
          disabled={!landmarkCity}
        />
      </div>

      {!showImportForm ? (
        <div className="space-y-8">
          {/* Community Selection */}
          <CommunitySelect
            id="landmark-community"
            label="Community:"
            value={selectedCommunity}
            onChange={setSelectedCommunity}
            communities={landmarkCommunities}
            disabled={!landmarkBuilder}
            placeholder="Select Community to Add Landmarks"
          />

          {/* Dynamic Landmark Rows */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-800">Add Landmarks</h4>
            {landmarks.map((landmark, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-xl border border-gray-200 relative"
              >
                {/* Category */}
                <select
                  value={landmark.category}
                  onChange={(e) => handleLandmarkChange(index, "category", e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {landmarkCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.landmark_category}
                    </option>
                  ))}
                </select>

                {/* Name */}
                <input
                  type="text"
                  placeholder="Landmark Name (e.g., Apollo Hospital)"
                  value={landmark.name}
                  onChange={(e) => handleLandmarkChange(index, "name", e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                {/* Distance */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Distance (e.g., 2.5)"
                    value={landmark.distance}
                    onChange={(e) => handleLandmarkChange(index, "distance", e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-600 font-medium">km</span>
                </div>

                {/* Remove Button */}
                {landmarks.length > 1 && (
                  <button
                    onClick={() => handleRemoveLandmarkRow(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                    title="Remove this landmark"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <button
              onClick={handleAddLandmarkRow}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105"
            >
              Add Another Landmark
            </button>
            <button
              onClick={handleSaveLandmarks}
              disabled={!selectedCommunity || landmarks.some(l => !l.category || !l.name || !l.distance)}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold px-10 py-3 rounded-full shadow-lg transition transform hover:scale-105 disabled:scale-100"
            >
              Save All Landmarks
            </button>
          </div>
        </div>
      ) : (
        /* Import Tab */
        <div className="max-w-2xl mx-auto space-y-8">
          <h3 className="text-2xl font-bold text-center text-gray-800">Import Landmarks from Another Community</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Source */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">Source Community (Copy From)</label>
              <select
                value={sourceCommunityId}
                onChange={(e) => setSourceCommunityId(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
              >
                <option value="">Select Source Community</option>
                {allCommunities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">Target Community (Copy To)</label>
              <select
                value={targetCommunityId}
                onChange={(e) => setTargetCommunityId(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
              >
                <option value="">Select Target Community</option>
                {allCommunities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <button
              onClick={handleImportLandmarks}
              disabled={!sourceCommunityId || !targetCommunityId || sourceCommunityId === targetCommunityId}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-xl px-12 py-5 rounded-full shadow-2xl transition-all transform hover:scale-105 disabled:scale-100"
            >
              Import All Landmarks
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  );
};

export default LandmarksForm;