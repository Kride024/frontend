import React, { useEffect, useState } from "react";
import { Eye, Trash } from "lucide-react";
import { fetchStatusOptions } from "@/app/shared/services/api/adminApi";
import ImageModal from "./PropertyImageModal";
import tailwindStyles from "@packages/styles/tailwindStyles";

interface StatusOption {
  id: string | number;
  status_code: string;
}

export interface Property {
  id: string | number;
  community_name?: string;
  city_name?: string;
  builder_name?: string;
  rental_high?: number;
  rental_low?: number;
  current_status?: string;
  property_added_at?: string | Date | null;
  property_updated_at?: string | Date | null;

  // Additional fields used in details section
  owner_name?: string;
  owner_mobile_no?: string;
  address?: string;
  pincode?: string | number;
  deposit_amount?: string | number;
  maintenance_type?: string;
  available_date?: string;
  prop_type?: string;
  home_type?: string;
  prop_desc?: string;
  total_area?: number | string;
  open_area?: number | string;
  nblocks?: number | string;
  nfloors_per_block?: number | string;
  nhouses_per_floor?: number | string;
  totflats?: number | string;
  nbaths?: number | string;
  nbalcony?: number | string;
  eat_pref?: string;
  parking_count?: number | string;
  super_area?: number | string;

  images?: unknown[]; // adjust type if you have a specific image shape
}

export interface AppliedFilters {
  // shape is unknown from the snippet, adjust to your real filters type
  [key: string]: unknown;
}

interface PropertyTableProps {
  properties: Property[];
  onStatusChange: (propertyId: Property["id"], newStatus: string) => Promise<void> | void;
  fetchData?: () => Promise<void> | void; // present in props list but unused in component
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  deletePropertyData: (
    propertyId: Property["id"],
    appliedFilters?: AppliedFilters
  ) => Promise<void> | void;
  appliedFilters?: AppliedFilters;
}

type SelectedStatusState = {
  [key: string]: string | undefined;
};

export function PropertyTable({
  properties,
  onStatusChange,
  fetchData: _fetchData, // kept for compatibility, currently unused
  currentPage,
  totalPages,
  onPageChange,
  deletePropertyData,
  appliedFilters,
}: PropertyTableProps) {
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<SelectedStatusState>({});
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [expandedPropertyId, setExpandedPropertyId] = useState<Property["id"] | null>(null);

  // Delete confirmation modal state
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  // Delete success modal state
  const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);
  const [deletedPropertyName, setDeletedPropertyName] = useState("");

  useEffect(() => {
    const loadStatusOptions = async () => {
      try {
        const options = await fetchStatusOptions();
        setStatusOptions(options.data.result as StatusOption[]);
      } catch (error) {
        console.error("Error fetching status options:", error);
      }
    };

    loadStatusOptions();
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property);
    setDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (propertyToDelete) {
        await deletePropertyData(propertyToDelete.id, appliedFilters);
        setDeletedPropertyName(propertyToDelete.community_name || "Property");
        setDeleteConfirmModal(false);
        setDeleteSuccessModal(true);
        setPropertyToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      setDeleteConfirmModal(false);
    }
  };

  const closeAllModals = () => {
    setDeleteConfirmModal(false);
    setDeleteSuccessModal(false);
    setPropertyToDelete(null);
  };

  const handleDelete = (indexToDelete: number) => {
    console.log("delete_image...", indexToDelete);
  };

  const handleStatusSelect = (propertyId: Property["id"], status: string) => {
    const key = String(propertyId);
    setSelectedStatus((prev) => ({
      ...prev,
      [key]: status,
    }));
  };

  const handleStatusUpdate = async (propertyId: Property["id"]) => {
    const key = String(propertyId);
    const newStatus = selectedStatus[key];
    const currentProperty = properties.find((p) => p.id === propertyId);

    if (newStatus && newStatus !== currentProperty?.current_status) {
      try {
        setUpdateError(null);
        await onStatusChange(propertyId, newStatus);

        if (newStatus === "Invalid-Input") {
          setExpandedPropertyId(null);
        }

        setSelectedStatus((prev) => ({
          ...prev,
          [key]: undefined,
        }));
      } catch (error: any) {
        console.error("Failed to update status:", error);
        setUpdateError(`Failed to update status: ${error?.message ?? "Unknown error"}`);
      }
    }
  };

  const togglePropertyDetails = (property: Property) => {
    if (expandedPropertyId === property.id) {
      setExpandedPropertyId(null);
      const key = String(property.id);
      setSelectedStatus((prev) => ({
        ...prev,
        [key]: undefined,
      }));
    } else {
      setExpandedPropertyId(property.id);
    }
  };

  const formatDate = (dateValue?: string | Date | null) => {
    if (!dateValue) return "N/A";
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
  };

  return (
    <div className="overflow-auto max-h-[calc(100vh-230px)] rounded-lg border">
      {updateError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {updateError}</span>
        </div>
      )}
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50 overflow-auto">
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold text-gray-500">
              PROPERTY ID
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold text-gray-500">
              COMMUNITY
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold text-gray-500">
              CITY
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold text-gray-500">
              PRICE
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold text-gray-500">
              CURRENT STATUS
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold text-gray-500">
              PROPERTY ADD DATE
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold text-gray-500">
              PROPERTY UPDATED DATE
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold text-gray-500">
              ACTION
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {properties.map((property) => {
            const key = String(property.id);
            const currentStatus = selectedStatus[key] || property.current_status;

            return (
              <React.Fragment key={property.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{property.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {property.community_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {property.city_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {property.rental_high
                      ? `${property.rental_high.toLocaleString()} INR`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        property.current_status
                      )}`}
                    >
                      {property.current_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(property.property_added_at)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(property.property_updated_at)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {property.current_status === "Invalid-Input" ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => togglePropertyDetails(property)}
                          className="p-1 rounded-full hover:bg-blue-50 text-blue-600"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(property)}
                          className="p-2 rounded-md hover:bg-red-50 text-red-600"
                          title="Delete Property"
                        >
                          <Trash className="h-6 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => togglePropertyDetails(property)}
                        className="p-1 rounded-full hover:bg-blue-50 text-blue-600"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>

                {expandedPropertyId === property.id && (
                  <tr>
                    {/* NOTE: colSpan can be 8 to cover all columns; using 8 here */}
                    <td colSpan={8} className="p-0">
                      <div className="border-t border-b border-gray-200 bg-white">
                        <div className="p-4">
                          {(!property.images || property.images.length < 1) && (
                            <div className="mb-4">
                              <p
                                className={`${tailwindStyles.paragraph} text-center`}
                              >
                                No Images Available
                              </p>
                            </div>
                          )}

                          {property.images && property.images.length > 0 && (
                            <div className="mb-4">
                              <ImageModal
                                modalData={property}
                                handleDelete={handleDelete}
                              />
                            </div>
                          )}

                          {/* Property Details */}
                          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="text-md font-semibold mb-4 text-gray-900 border-b pb-2">
                              Property Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm">
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  ID:
                                </span>
                                <span className="flex-1">
                                  {property.id ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Community Name:
                                </span>
                                <span className="flex-1">
                                  {property.community_name ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Owner Name:
                                </span>
                                <span className="flex-1">
                                  {property.owner_name ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Owner MobileNo:
                                </span>
                                <span className="flex-1">
                                  {property.owner_mobile_no ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Address:
                                </span>
                                <span className="flex-1 break-words">
                                  {property.address ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Pincode:
                                </span>
                                <span className="flex-1">
                                  {property.pincode ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Rental Range:
                                </span>
                                <span className="flex-1">
                                  {`${property.rental_low ?? "N/A"} - ${
                                    property.rental_high ?? "N/A"
                                  } INR`}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Deposit:
                                </span>
                                <span className="flex-1">
                                  {property.deposit_amount ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Maintenance:
                                </span>
                                <span className="flex-1">
                                  {property.maintenance_type ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Availability:
                                </span>
                                <span className="flex-1">
                                  {property.available_date ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Property Type:
                                </span>
                                <span className="flex-1">
                                  {property.prop_type ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Home Type:
                                </span>
                                <span className="flex-1">
                                  {property.home_type ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Description:
                                </span>
                                <span className="flex-1">
                                  {property.prop_desc ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Current Status:
                                </span>
                                <span className="flex-1">
                                  {property.current_status ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Total Area:
                                </span>
                                <span className="flex-1">
                                  {property.total_area
                                    ? `${property.total_area} acres`
                                    : "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Open Area:
                                </span>
                                <span className="flex-1">
                                  {property.open_area
                                    ? `${property.open_area}%`
                                    : "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Blocks:
                                </span>
                                <span className="flex-1">
                                  {property.nblocks ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Floors/Block:
                                </span>
                                <span className="flex-1">
                                  {property.nfloors_per_block ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Houses/Floor:
                                </span>
                                <span className="flex-1">
                                  {property.nhouses_per_floor ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Total Flats:
                                </span>
                                <span className="flex-1">
                                  {property.totflats ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Bathrooms:
                                </span>
                                <span className="flex-1">
                                  {property.nbaths ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Balconies:
                                </span>
                                <span className="flex-1">
                                  {property.nbalcony ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Eating Pref:
                                </span>
                                <span className="flex-1">
                                  {property.eat_pref ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Parking:
                                </span>
                                <span className="flex-1">
                                  {property.parking_count ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-900 w-32">
                                  Area in SQFT:
                                </span>
                                <span className="flex-1">
                                  {property.super_area ?? "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status Update Section */}
                          <div className="mt-4 flex flex-wrap items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center space-x-4">
                              <h3 className="text-sm font-semibold text-gray-700">
                                Current Status:
                              </h3>
                              <select
                                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                  currentStatus
                                )}`}
                                value={currentStatus}
                                onChange={(e) =>
                                  handleStatusSelect(property.id, e.target.value)
                                }
                              >
                                {property.current_status && (
                                  <option value={property.current_status}>
                                    {property.current_status}
                                  </option>
                                )}
                                {statusOptions.map((status) => (
                                  <option
                                    key={status.status_code}
                                    value={String(status.id)}
                                  >
                                    {status.status_code}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleStatusUpdate(property.id)}
                                className={`px-3 py-1 rounded text-xs transition-colors ${
                                  currentStatus &&
                                  currentStatus !== property.current_status
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-gray-300 text-gray-500"
                                }`}
                                disabled={
                                  !currentStatus ||
                                  currentStatus === property.current_status
                                }
                              >
                                Update Status
                              </button>
                            </div>
                            <button
                              onClick={() => setExpandedPropertyId(null)}
                              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition duration-200"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-11/12 max-w-md shadow-lg">
            <div className="text-center">
              <Trash className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
              <p className="mb-6">
                Are you sure you want to delete the property "
                {propertyToDelete?.community_name}"? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={closeAllModals}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {deleteSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-11/12 max-w-md shadow-lg">
            <div className="text-center">
              <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Deletion Successful</h2>
              <p className="mb-6">
                The property "{deletedPropertyName}" has been successfully deleted.
              </p>
              <button
                onClick={closeAllModals}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between p-4 items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-2 rounded ${
                pageNum === currentPage
                  ? "bg-blue-700 text-white font-bold"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <span className="text-sm font-semibold">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PropertyTable;
