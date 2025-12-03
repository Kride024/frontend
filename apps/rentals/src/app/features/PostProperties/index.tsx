import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useRoleStore } from "../../../../../../packages/store/roleStore";
import {
  uploadProperty,
  fetchPostPropertiesData,
} from "../../shared/services/api/index";
import { updateProperty } from "../../../../../../packages/servivces/utils/apiCrud";
import useUserListingsStore from "../../store/userListingsStore";
import ProgressBar from "./ProgressBar";
import LoadingView from "../../../../../../packages/ui/Shared/LoadingView";
import PropertyForm from "./PropertyForm";
import tailwindStyles from "@packages/styles/tailwindStyles";
import PostProcess from "./PostProcess";
import SuccessView from "./SuccessView";
import ErrorView from "./ErrorView";
import TextModel from "./BenefitsModel";

// Type Definitions
interface FormData {
  city: string;
  builder: string;
  community: string;
  propertyType: string;
  towerNumber: string;
  floorNumber: string;
  flatNumber: string;
  bedrooms: string;
  bathrooms: string;
  propertyDescription: string;
  balcony: string;
  tenantType: string;
  foodPreferences: string;
  rental_low: string;
  rental_high: string;
  parking: string;
  maintenance: string;
  available: string;
  depositAmount: string;
  area: string;
  facing: string;
}

interface Option {
  [key: string]: any;
}

interface DropdownData {
  cityList: Option[];
  builderList: Option[];
  communityList: Option[];
  propertyType: Option[];
  bedrooms: Option[];
  bathrooms: Option[];
  balcony: Option[];
  tenantType: Option[];
  foodPreference: Option[];
  parking: Option[];
  propertyDescription: Option[];
  availability: Option[];
  facing: Option[];
}

interface BuildersAndCommunities {
  builders: Option[];
  communities: Option[];
}

interface PanelField {
  label: string;
  name: keyof FormData | "images" | "monthly_rental";
  options?: Option[];
  type: "dropdown" | "radio" | "text" | "number" | "file" | "group";
  displayKey?: string;
}

const jwtSecretKey = `${import.meta.env.VITE_JWT_SECRET_KEY}`;

const PostPropertiesView: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useRoleStore();
  const { fetchUserListings, selectedProperty, clearSelectedProperty } = useUserListingsStore();
  const userId = userData.id;
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [submissionStatus, setSubmissionStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const jwtToken = Cookies.get(jwtSecretKey);

  const [formData, setFormData] = useState<FormData>({
    city: "",
    builder: "",
    community: "",
    propertyType: "",
    towerNumber: "",
    floorNumber: "",
    flatNumber: "",
    bedrooms: "",
    bathrooms: "",
    propertyDescription: "",
    balcony: "",
    tenantType: "",
    foodPreferences: "",
    rental_low: "",
    rental_high: "",
    parking: "",
    maintenance: "",
    available: "",
    depositAmount: "",
    area: "",
    facing: "",
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [buildersAndCommunities, setBuildersAndCommunities] = useState<BuildersAndCommunities>({
    builders: [],
    communities: [],
  });
  const [dropdownData, setDropdownData] = useState<DropdownData>({
    cityList: [],
    builderList: [],
    communityList: [],
    propertyType: [],
    bedrooms: [],
    bathrooms: [],
    balcony: [],
    tenantType: [],
    foodPreference: [],
    parking: [],
    propertyDescription: [],
    availability: [],
    facing: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [modalImage, setModalImage] = useState<string | null>(null);

  // Redirect if JWT missing
  useEffect(() => {
    if (!jwtToken) navigate("/");
  }, [jwtToken, navigate]);

  // Populate form when editing
  useEffect(() => {
    if (selectedProperty) {
      setFormData({
        city: selectedProperty.city_id || "",
        builder: selectedProperty.builder_id || "",
        community: selectedProperty.community_id || "",
        propertyType: selectedProperty.prop_type_id || selectedProperty.prop_type || "",
        towerNumber: selectedProperty.tower_no || "",
        floorNumber: selectedProperty.floor_no || "",
        flatNumber: selectedProperty.flat_no || "",
        bedrooms: selectedProperty.home_type_id || "",
        bathrooms: selectedProperty.nbaths || "",
        propertyDescription: selectedProperty.prop_desc_id || "",
        balcony: selectedProperty.nbalcony || "",
        tenantType: selectedProperty.tenant_type_id || "",
        foodPreferences: selectedProperty.eat_pref_id || "",
        rental_low: selectedProperty.rental_low || "",
        rental_high: selectedProperty.rental_high || "",
        parking: selectedProperty.parking_count || "",
        maintenance: selectedProperty.maintenance_id || "",
        available: selectedProperty.available_date_id || "",
        depositAmount: selectedProperty.deposit_amount || "",
        area: selectedProperty.super_area || "",
        facing: selectedProperty.facing || "",
      });
      const userImages = (selectedProperty.images || []).filter(Boolean);
      setExistingImages(userImages);
      setImagePreviews(userImages.slice(0, 5));
    }
  }, [selectedProperty]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPostPropertiesData();
        if (response?.data?.result) {
          const {
            cities,
            builders,
            communities,
            propType,
            homeTypes,
            baths,
            balconies,
            tenants,
            tenantEatPrefs,
            parkingCounts,
            propDesc,
            availability,
            facing,
          } = response.data.result;

          setDropdownData({
            cityList: cities || [],
            builderList: [],
            communityList: [],
            propertyType: propType || [],
            bedrooms: homeTypes || [],
            bathrooms: baths || [],
            balcony: balconies || [],
            tenantType: tenants || [],
            foodPreference: tenantEatPrefs || [],
            parking: parkingCounts || [],
            propertyDescription: propDesc || [],
            availability: availability || [],
            facing: facing || [],
          });

          setBuildersAndCommunities({
            builders: builders || [],
            communities: communities || [],
          });
        }
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update builder and community dropdowns based on selection
  useEffect(() => {
    if (formData.city) {
      const builders = buildersAndCommunities.builders.filter(
        (b) => b.city_id === formData.city
      );
      setDropdownData((prev) => ({ ...prev, builderList: builders }));
    }
  }, [formData.city, buildersAndCommunities.builders]);

  useEffect(() => {
    if (formData.builder) {
      const communities = buildersAndCommunities.communities.filter(
        (c) => c.builder_id === formData.builder
      );
      setDropdownData((prev) => ({ ...prev, communityList: communities }));
    }
  }, [formData.builder, buildersAndCommunities.communities]);

  // Input change handler
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value, files, checked } = e.target as HTMLInputElement & { dataset: { id?: string } };

    if (type === "file" && files) {
      const fileList = Array.from(files);
      if (newImages.length + fileList.length + existingImages.length - removedImages.length > 10) {
        alert("Maximum 10 images are allowed.");
        return;
      }
      setNewImages((prev) => [...prev, ...fileList]);
      setImagePreviews((prev) => [
        ...prev,
        ...fileList.map((file) => URL.createObjectURL(file)),
      ].slice(0, 5));
    } else if (name === "city") {
      setFormData((prev) => ({ ...prev, city: value, builder: "", community: "" }));
      setDropdownData((prev) => ({ ...prev, builderList: [], communityList: [] }));
    } else if (name === "builder") {
      setFormData((prev) => ({ ...prev, builder: value, community: "" }));
      setDropdownData((prev) => ({ ...prev, communityList: [] }));
    } else {
      if (name === "maintenance") {
        const selectedOption = checked ? e.target.dataset.id || null : null;
        setFormData((prev) => ({ ...prev, maintenance: selectedOption }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRemoveImage = (index: number) => {
    const previewImage = imagePreviews[index];
    if (existingImages.includes(previewImage)) {
      setRemovedImages((prev) => [...prev, previewImage]);
      setExistingImages((prev) => prev.filter((img) => img !== previewImage));
    } else {
      setNewImages((prev) => prev.filter((file) => URL.createObjectURL(file) !== previewImage));
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const openImageModal = (image: string) => setModalImage(image);
  const closeImageModal = () => setModalImage(null);

  const validatePanel = (panelFields: PanelField[]) => {
    const panelErrors: Record<string, string> = {};
    panelFields.forEach((field) => {
      if (formData.propertyType === "3" && (field.name === "floorNumber" || field.name === "flatNumber")) return;
      const value = formData[field.name as keyof FormData];
      if ((field.type === "dropdown" || field.type === "radio") && !value) {
        panelErrors[field.name] = `Please select a valid ${field.label.toLowerCase()}.`;
      } else if ((field.type === "text" || field.type === "number") && !value) {
        panelErrors[field.name] = `${field.label} must be entered.`;
      }
    });
    return panelErrors;
  };

  const handleNext = () => {
    const panelFields = panels[currentStep - 1];
    const panelErrors = validatePanel(panelFields);
    if (Object.keys(panelErrors).length > 0) {
      setErrors(panelErrors);
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const panelFields = panels[currentStep - 1];
    const panelErrors = validatePanel(panelFields);
    if (Object.keys(panelErrors).length > 0) {
      setErrors(panelErrors);
      return;
    }

    const propertyData: Record<string, any> = {
      user_id: userId,
      prop_type_id: formData.propertyType || null,
      home_type_id: formData.bedrooms || null,
      prop_desc_id: formData.propertyDescription || null,
      community_id: formData.community || null,
      no_baths: formData.bathrooms || null,
      no_balconies: formData.balcony || null,
      tenant_type_id: formData.tenantType || null,
      tenant_eat_pref_id: formData.foodPreferences || null,
      rental_low: isNaN(parseInt(formData.rental_low)) ? null : parseInt(formData.rental_low),
      rental_high: isNaN(parseInt(formData.rental_high)) ? null : parseInt(formData.rental_high),
      parking_count_id: formData.parking || null,
      maintenance_id: formData.maintenance || null,
      tower_no: formData.towerNumber || null,
      floor_no: isNaN(parseInt(formData.floorNumber)) ? null : parseInt(formData.floorNumber),
      flat_no: formData.flatNumber || null,
      available_date: formData.available || null,
      deposit_amount: isNaN(parseInt(formData.depositAmount)) ? null : parseInt(formData.depositAmount),
      super_area: isNaN(parseInt(formData.area)) ? null : parseInt(formData.area),
      facing: formData.facing || null,
      current_status: selectedProperty ? 1 : undefined,
    };
console.log("propertyyyyyy",propertyData)
    Object.keys(propertyData).forEach((key) => {
      if (propertyData[key] === undefined) delete propertyData[key];
    });

    try {
      let response;
      if (selectedProperty) {
        if (!selectedProperty.id) throw new Error("Property ID is missing");
        response = await updateProperty(selectedProperty.id, propertyData, newImages, removedImages);
      } else {
        response = await uploadProperty({ ...propertyData, images: newImages });
      }

      setSubmissionStatus("success");
      setErrors({});
      setNewImages([]);
      setRemovedImages([]);
      clearSelectedProperty();
      await fetchUserListings(userId);
    } catch (error: any) {
      setSubmissionStatus("error");
      setErrorMessage(error.response?.data?.message || error.message || "An error occurred while submitting the property");
    }
  };

  const panels: PanelField[][] = [
    [
      { label: "City", name: "city", options: dropdownData.cityList, type: "dropdown", displayKey: "name" },
      { label: "Builder", name: "builder", options: dropdownData.builderList, type: "dropdown", displayKey: "name" },
      { label: "Community", name: "community", options: dropdownData.communityList, type: "dropdown", displayKey: "name" },
      { label: "Property Type", name: "propertyType", options: dropdownData.propertyType, type: "dropdown", displayKey: "prop_type" },
      { label: "Description", name: "propertyDescription", options: dropdownData.propertyDescription, type: "dropdown", displayKey: "prop_desc" },
      { label: "Home Type", name: "bedrooms", options: dropdownData.bedrooms, type: "dropdown", displayKey: "home_type" },
    ],
    [
      { label: "Tower/Unit Number", name: "towerNumber", type: "text" },
      { label: "Floor Number", name: "floorNumber", type: "number" },
      { label: "Flat Number", name: "flatNumber", type: "text" },
      { label: "Bathrooms", name: "bathrooms", options: dropdownData.bathrooms, type: "dropdown", displayKey: "nbaths" },
      { label: "Balcony Count", name: "balcony", options: dropdownData.balcony, type: "dropdown", displayKey: "nbalcony" },
      { label: "Parking", name: "parking", options: dropdownData.parking, type: "dropdown", displayKey: "parking_count" },
    ],
    [
      { label: "Monthly Rental (INR)", name: "monthly_rental", type: "group" },
      { label: "Min", name: "rental_low", type: "number" },
      { label: "Max", name: "rental_high", type: "number" },
      { label: "Tenant Type", name: "tenantType", options: dropdownData.tenantType, type: "dropdown", displayKey: "tenant_type" },
      { label: "Food Preferences", name: "foodPreferences", options: dropdownData.foodPreference, type: "dropdown", displayKey: "eat_pref" },
      { label: "Maintenance", name: "maintenance", type: "radio", options: [
        { label: "Included", value: "included", id: 1 },
        { label: "Not Included", value: "not_included", id: 2 },
      ]},
      { label: "Availability", name: "available", options: dropdownData.availability, type: "dropdown", displayKey: "available" },
      { label: "Deposit Amount (INR)", name: "depositAmount", type: "number" },
      { label: "Area in sqft", name: "area", type: "number" },
      { label: "Flat Facing", name: "facing", options: dropdownData.facing, type: "dropdown", displayKey: "name" },
      { label: "Upload Images (* Highlights Your Property)", name: "images", type: "file" },
    ],
  ];

  const totalSteps = panels.length;
  const resetSubmissionStatus = async () => {
    setSubmissionStatus(null);
    await fetchUserListings(userId);
    navigate("/");
  };

  return (
    <div className="px-5 lg:px-10 py-3" style={{
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "calc(100vh - 60px)",
      width: "100%",
      backgroundImage: `url("data:image/svg+xml,....")`,
    }}>
      {pageLoading ? (
        <LoadingView />
      ) : (
        <div className="w-full md:min-h-[calc(100vh-200px)] mx-auto">
          <div className="flex md:hidden mb-4 min-w-[100%]">
            <TextModel />
          </div>
          <div className="flex items-end justify-center md:justify-between">
            <div className="hidden md:block md:mr-5">
              <TextModel />
            </div>
            <div className="md:w-[75%] w-full justify-self-end">
              <h2 className={`${tailwindStyles.heading_2} text-center`}>
                {selectedProperty ? "Edit Property" : "Post A Property"}
              </h2>
              <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
              <div className="bg-white shadow-lg p-4 md:p-6 rounded-lg mt-3 md:mt-6">
                <PropertyForm
                  panels={panels}
                  currentStep={currentStep}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  loading={false}
                  imagePreviews={imagePreviews}
                  handleRemoveImage={handleRemoveImage}
                  openImageModal={openImageModal}
                  handleSubmit={handleSubmit}
                  handleNext={handleNext}
                  totalSteps={totalSteps}
                  setCurrentStep={setCurrentStep}
                />
              </div>
            </div>
          </div>
          <PostProcess />
        </div>
      )}
      {modalImage && (
        <div className="fixed inset-0 top-10 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-gray-600 rounded-lg p-4 shadow-lg relative w-3/4 h-3/4 flex items-center justify-center">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
            <img src={modalImage} alt="Modal View" className="w-full h-full object-contain" />
          </div>
        </div>
      )}
      {submissionStatus === "success" && <SuccessView onClose={resetSubmissionStatus} />}
      {submissionStatus === "error" && <ErrorView onClose={resetSubmissionStatus} errorMessage={errorMessage} />}
    </div>
  );
};

export default PostPropertiesView;
