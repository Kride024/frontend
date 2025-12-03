import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RENTALS_BASE } from "../../../../../../../packages/config/constants";
import {
  MapPin,
  IndianRupee,
  Home,
  Armchair,
  NotebookPen,
  Layers,
  Car,
  Calendar,
  Square,
  Bath,
  Wrench,
  Building2,
  Fence,
  UtensilsCrossed,
} from "lucide-react";
import tailwindStyles from "../../../../../../../packages/styles/tailwindStyles";
import useUserListingsStore from "../../../store/userListingsStore";

// ---------------------------------------------
// TYPES
// ---------------------------------------------
export interface Property {
  id: number;
  community_name: string;
  address: string;
  city_name?: string;
  prop_type?: string;
  rental_low: number;
  rental_high: number;
  deposit_amount?: number;
  home_type?: string;
  tower_no?: string;
  flat_no?: string;
  floor_no?: string;
  super_area: number | null;
  parking_count?: string;
  nbaths?: string;
  nbalcony?: string;
  prop_desc?: string;
  maintenance_type?: string;
  eat_pref?: string;
  available_date?: string;
  default_img: string;
  images?: string[];
  current_status: string;
  map_url?: string;
  property_added_at: string;

  // RM Details
  rm_name?: string;
  rm_mobile_no?: string;
}

interface MyListingCardViewProps {
  property: Property;
  timeText: string;
}

interface MappedProperty {
  images: string[];
  name: string;
  location: string;
  details: Record<string, string>;
}

// ---------------------------------------------
// MAP BACKEND → UI MODEL
// ---------------------------------------------
const mapBackendDataToComponent = (property: Property): MappedProperty => {
  const allImages = [property.default_img, ...(property.images || [])].filter(
    Boolean
  );

  return {
    images: allImages.length > 0 ? allImages : ["default-image.jpg"],
    name: property.community_name,
    location: property.address,
    details: {
      City: property.city_name || "N/A",
      PropertyType: property.prop_type || "N/A",
      "Rent/Month": `₹${property.rental_low.toLocaleString()} to ₹${property.rental_high.toLocaleString()}`,
      Deposit: property.deposit_amount
        ? `₹${property.deposit_amount.toLocaleString()}`
        : "N/A",
      Type: property.home_type || "N/A",
      TowerNo: property.tower_no || "N/A",
      FlatNo: property.flat_no || "N/A",
      Floor: property.floor_no || "N/A",
      Area:
        property.super_area !== null ? `${property.super_area} sqft` : "--",
      Parking: property.parking_count || "N/A",
      Bathrooms: property.nbaths || "N/A",
      Balconies: property.nbalcony || "N/A",
      Furnishing: property.prop_desc || "N/A",
      Maintenance: property.maintenance_type || "N/A",
      EatPreference: property.eat_pref || "N/A",
      Availability: property.available_date || "N/A",
    },
  };
};

// ---------------------------------------------
// STATUS STYLES
// ---------------------------------------------
const statusStyles: Record<
  string,
  { bg: string; text: string }
> = {
  Review: {
    bg: "bg-gradient-to-r from-yellow-700 to-blue-700",
    text: "text-white",
  },
  "Invalid-Input": {
    bg: "bg-gradient-to-r from-red-700 to-blue-700",
    text: "text-white",
  },
  Approved: {
    bg: "bg-gradient-to-r from-green-700 to-blue-700",
    text: "text-white",
  },
  Rented: {
    bg: "bg-gradient-to-r from-green-900 to-blue-900",
    text: "text-white",
  },
  Default: {
    bg: "bg-gradient-to-r from-blue-700 to-blue-500",
    text: "text-white",
  },
};

// ---------------------------------------------
// INFO ITEM COMPONENT
// ---------------------------------------------
interface InfoItemProps {
  value: string;
  label: string;
  addBorderRight: boolean;
  addBorderBottom: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({
  value,
  label,
  addBorderRight,
  addBorderBottom,
}) => {
  const icons: Record<string, JSX.Element> = {
    City: <Building2 className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />,
    PropertyType: <Building2 className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />,
    "Rent/Month": (
      <IndianRupee className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />
    ),
    Maintenance: <Wrench className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />,
    Deposit: <NotebookPen className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />,
    Area: <Square className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />,
    Type: <Home className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />,
    Furnishing: <Armchair className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />,
    Floor: <Layers className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />,
    Parking: <Car className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />,
    Availability: <Calendar className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />,
    Bathrooms: <Bath className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />,
    Balconies: <Fence className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />,
    TowerNo: <Building2 className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />,
    FloorNo: <Layers className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />,
    FlatNo: <Home className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />,
    EatPreference: (
      <UtensilsCrossed className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />
    ),
  };

  return (
    <div
      className={`flex items-center gap-2 px-2 py-2 sm:px-3 sm:py-2 bg-gradient-to-br from-gray-50 to-white
        ${addBorderRight ? "border-r border-gray-300" : ""}
        ${addBorderBottom ? "border-b border-gray-300" : ""}
      `}
    >
      {icons[label]}
      <div className="flex-1">
        <p className={tailwindStyles.paragraph_b}>{value}</p>
        <p className={tailwindStyles.paragraph}>{label}</p>
      </div>
    </div>
  );
};

// ---------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------
const MyListingCardView: React.FC<MyListingCardViewProps> = ({
  property,
  timeText,
}) => {
  const navigate = useNavigate();
  const { setSelectedProperty } = useUserListingsStore();

  // Fix SSR window usage
  const [colCount, setColCount] = useState(4);

  useEffect(() => {
    const updateColumns = () => {
      setColCount(window.innerWidth < 1024 ? 2 : 4);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const convertDate = (userDate: string): string => {
    const date = new Date(userDate);
    date.setHours(date.getUTCHours() + 5, date.getUTCMinutes() + 30);

    return date.toISOString().replace("T", " ").slice(0, 19);
  };

  const { images, name, location, details } =
    mapBackendDataToComponent(property);

  const [mainImage, setMainImage] = useState(images[0]);

  const detailEntries = Object.entries(details);
   const { bg, text } =
    statusStyles[property.current_status] || statusStyles.Default;
  const status = statusStyles[property.current_status] || statusStyles.Default;

  const handleEdit = () => {
    setSelectedProperty(property);
    navigate(`${RENTALS_BASE}/postProperties`);
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mx-auto w-full max-w-[95%] sm:max-w-3xl lg:max-w-6xl overflow-hidden">
      {/* Status Badge */}
      <div
        className={`absolute top-0 left-0 z-10 ${bg} ${text} text-xs font-bold px-2 py-1 shadow-md`}
      >
        {property.current_status}
      </div>
      <div className="flex justify-center">
        <p
          className={`${tailwindStyles.heading_3} animate-bulb-glow bg-gradient-to-r from-yellow-400 via-gray-400 to-blue-200 rounded-md  px-2 py-1 mt-1`}
        >
          No Brokerage to be paid
        </p>
      </div>

      {/* Date */}
      <div className="absolute top-2 right-4 text-gray-600 text-xs sm:text-sm font-semibold">
        {timeText} - {convertDate(property.property_added_at)}
      </div>

      <div className="flex flex-col lg:flex-row gap-3 p-3 sm:p-4 lg:p-4">
        {/* Image Section */}
        <div className="flex flex-col md:flex-row md:gap-4 lg:flex-col lg:gap-2 pt-5 lg:pt-0">
          {/* Thumbnails */}
          <div className="order-2 md:order-1 lg:order-2 md:items-center flex md:flex-col lg:flex-row gap-1 sm:gap-2 overflow-x-auto md:overflow-y-auto md:h-52 lg:h-full lg:overflow-x-auto pb-2 md:pb-0 scrollbar-thin scrollbar-thumb-gray-300 mt-2 sm:mt-3 md:mt-0 md:w-1/4 lg:w-full">
            {images.map((image, index) => (
              <img
                key={index}
                className={`w-12 h-12 m-0.5 ml-0.5 sm:w-14 sm:h-14 md:w-3/4 md:h-14 lg:w-14 lg:h-14 object-cover rounded-md cursor-pointer flex-shrink-0 transition-all duration-200
                  ${mainImage === image ? "ring-2 ring-blue-500" : "opacity-75 hover:opacity-100"}`}
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                onClick={() => setMainImage(image)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="order-1 md:order-2 lg:order-1 relative group w-full md:w-3/4 lg:w-full">
            <img
              className="w-full lg:min-w-80 lg:max-w-80 h-40 sm:h-48 md:h-52 lg:h-56 object-cover rounded-lg transition-transform duration-300"
              src={mainImage}
              alt={name}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-2 relative flex-1">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <h2 className={`${tailwindStyles.heading_3}`}>{name}</h2>
                <a
                  href={property.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                >
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                </a>
               
              </div>
              <p className={`${tailwindStyles.paragraph}`}>{location}</p>
            </div>
          </div>

          {/* Property Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 bg-gray-200 rounded-lg overflow-hidden">
            {detailEntries.map(([key, value], index) => {
              const totalColumns = window.innerWidth < 1024 ? 2 : 4;
              const isLastColumn = (index + 1) % totalColumns === 0;
              const isLastRow =
                index >=
                detailEntries.length -
                  (detailEntries.length % totalColumns || totalColumns);

              return (
                <InfoItem
                  key={key}
                  value={value}
                  label={key}
                  addBorderRight={!isLastColumn}
                  addBorderBottom={!isLastRow}
                />
              );
            })}
          </div>

          {/* RM Details */}
          {property.current_status !== "Review" &&
            property.current_status !== "Rented" && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2 bg-blue-50 px-2 sm:px-4 py-1 sm:py-2 rounded-lg animate-rm-slide">
                  <p className={`${tailwindStyles.paragraph}`}>
                    {property.rm_name || "NA"} (RM):{" "}
                    {property.rm_mobile_no || "NA"}
                  </p>
                </div>
              </div>
            )}
        </div>
        <div className="flex items-end justify-end">
          <button
            type="button"
            className={`${tailwindStyles.secondaryButton}`}
            onClick={handleEdit}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------
// CUSTOM CSS ANIMATIONS
// ---------------------------------------------
const styles = `
  @keyframes slideIn {
    0% { transform: translateX(-100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  .animate-rm-slide {
    animation: slideIn 0.5s ease-out forwards;
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default MyListingCardView;
