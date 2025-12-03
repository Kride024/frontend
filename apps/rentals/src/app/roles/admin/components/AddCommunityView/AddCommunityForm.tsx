// src/pages/Admin/Communities/AddCommunityForm.tsx
import React, { useEffect, useState, ChangeEvent } from "react";
import {
  fetchBuilders,
  createCommunity,
} from "@/app/shared/services/api/index";
import { SectionCard, CitySelect, BuilderSelect } from "./CommunitiesCommon";

interface City {
  id: string | number;
  name: string;
}

interface Builder {
  id: string | number;
  name: string;
}

interface AddCommunityFormProps {
  cities: City[];
}

interface FormData {
  nameCommunity: string;
  mapUrl: string;
  totalArea: string;
  openArea: string;
  nblocks: string;
  nfloorsPerBlock: string;
  nhousesPerFloor: string;
  address: string;
  majorArea: string;
  totflats: string;
  status: string;
  rstatus: string;
}

const AddCommunityForm: React.FC<AddCommunityFormProps> = ({ cities }) => {
  const [communityCity, setCommunityCity] = useState<string>("");
  const [communityBuilders, setCommunityBuilders] = useState<Builder[]>([]);
  const [communityBuilder, setCommunityBuilder] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    nameCommunity: "",
    mapUrl: "",
    totalArea: "",
    openArea: "",
    nblocks: "",
    nfloorsPerBlock: "",
    nhousesPerFloor: "",
    address: "",
    majorArea: "",
    totflats: "",
    status: "",
    rstatus: "",
  });

  const [images, setImages] = useState<File | null>(null);

  // Fetch builders when city changes
  useEffect(() => {
    const getBuilders = async () => {
      if (!communityCity) {
        setCommunityBuilders([]);
        setCommunityBuilder("");
        return;
      }

      try {
        const data = await fetchBuilders(communityCity);
        setCommunityBuilders(data.data.result || []);
        setCommunityBuilder("");
      } catch (error) {
        console.error("Error fetching builders:", error);
        setCommunityBuilders([]);
      }
    };

    getBuilders();
  }, [communityCity]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImages(e.target.files[0]);
    }
  };

  const handleSaveCommunity = async () => {
    const {
      nameCommunity,
      mapUrl,
      totalArea,
      openArea,
      nblocks,
      nfloorsPerBlock,
      nhousesPerFloor,
      address,
      majorArea,
      totflats,
      status,
      rstatus,
    } = formData;

    // Validation
    if (!nameCommunity.trim()) return alert("Please enter a community name.");
    if (!communityBuilder) return alert("Please select a builder.");
    if (!totalArea || isNaN(Number(totalArea)))
      return alert("Please enter a valid total area.");
    if (!openArea || isNaN(Number(openArea)))
      return alert("Please enter a valid open area.");
    if (!nblocks || isNaN(Number(nblocks)))
      return alert("Please enter a valid number of blocks.");
    if (!nfloorsPerBlock || isNaN(Number(nfloorsPerBlock)))
      return alert("Please enter a valid number of floors per block.");
    if (!nhousesPerFloor || isNaN(Number(nhousesPerFloor)))
      return alert("Please enter a valid number of houses per floor.");
    if (!totflats || isNaN(Number(totflats)))
      return alert("Please enter a valid total number of flats.");
    if (!address.trim()) return alert("Please enter a valid address.");
    if (!majorArea.trim()) return alert("Please enter a valid major area.");
    if (!status.trim()) return alert("Please select a status.");
    if (!rstatus.trim()) return alert("Please enter a valid rstatus.");

    const communityData = {
      name: nameCommunity.trim(),
      map_url: mapUrl.trim() || "",
      total_area: Number(totalArea),
      open_area: Number(openArea),
      nblocks: Number(nblocks),
      nfloors_per_block: Number(nfloorsPerBlock),
      nhouses_per_floor: Number(nhousesPerFloor),
      address: address.trim(),
      major_area: majorArea.trim(),
      builder_id: Number(communityBuilder),
      totflats: Number(totflats),
      status: status.trim(),
      rstatus: rstatus.trim(),
    };

    try {
      const response = await createCommunity(communityData, images);
      
      if (response?.message?.includes("successfully")) {
        alert("Community added successfully!");
        // Optional: Reset form
        setFormData({
          nameCommunity: "",
          mapUrl: "",
          totalArea: "",
          openArea: "",
          nblocks: "",
          nfloorsPerBlock: "",
          nhousesPerFloor: "",
          address: "",
          majorArea: "",
          totflats: "",
          status: "",
          rstatus: "",
        });
        setImages(null);
        setCommunityCity("");
        setCommunityBuilder("");
      } else {
        alert("Failed to add community.");
      }
    } catch (error) {
      console.error("Error creating community:", error);
      alert("An error occurred while adding the community.");
    }
  };

  return (
    <SectionCard title="Community Details">
      {/* City & Builder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <CitySelect
          id="community-city"
          value={communityCity}
          onChange={setCommunityCity}
          cities={cities}
          label="Select City:"
        />
        <BuilderSelect
          id="community-builder"
          value={communityBuilder}
          onChange={setCommunityBuilder}
          builders={communityBuilders}
          label="Select Builder:"
          disabled={!communityCity}
        />
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="nameCommunity"
          placeholder="Enter Community Name"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.nameCommunity}
          onChange={handleInputChange}
        />
        <input
          type="url"
          name="mapUrl"
          placeholder="Enter Map URL (optional)"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.mapUrl}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="totalArea"
          placeholder="Enter Total Area (sq ft)"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.totalArea}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="openArea"
          placeholder="Enter Open Area (sq ft)"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.openArea}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="nblocks"
          placeholder="Enter Number of Blocks"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.nblocks}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="nfloorsPerBlock"
          placeholder="Enter Floors per Block"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.nfloorsPerBlock}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="nhousesPerFloor"
          placeholder="Enter Houses per Floor"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.nhousesPerFloor}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Enter Full Address"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.address}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="majorArea"
          placeholder="Enter Major Area/Locality"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.majorArea}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="totflats"
          placeholder="Enter Total Flats"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.totflats}
          onChange={handleInputChange}
        />
        <select
          name="status"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.status}
          onChange={handleInputChange}
        >
          <option value="">Select Status</option>
          <option value="active">Completed</option>
          <option value="inactive">Ongoing</option>
        </select>
        <input
          type="text"
          name="rstatus"
          placeholder="Enter RERA Status (e.g., Registered)"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.rstatus}
          onChange={handleInputChange}
        />
      </div>

      {/* Image Upload */}
      <div className="mt-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Default Community Image
        </label>
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          onChange={handleFileChange}
        />
        {images && (
          <p className="mt-2 text-sm text-green-600">
            Selected: {images.name}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSaveCommunity}
          className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
        >
          Save Community
        </button>
      </div>
    </SectionCard>
  );
};

export default AddCommunityForm;