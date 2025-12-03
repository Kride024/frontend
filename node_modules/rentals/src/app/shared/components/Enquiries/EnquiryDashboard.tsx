// EnquiryManagementDashboard.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  fetchEnquiries,
  fetchEnquiryDetails,
  updateEnquiry,
  fetchEnquiryDropdownOptions,
} from "../../services/api/index";
import tailwindStyles from "@packages/styles/tailwindStyles";
import {
  BasicInfoTab,
  PropertyDetailsTab,
  PreferencesTab,
} from "./EnquiryTabs";

// ==================== Types ====================
interface Enquiry {
  enq_id: number;
  category_name: string;
  enq_name: string;
  enq_mobile: string;
  enq_rec_create_time?: string;
  enq_rental_low?: number | string | null;
  enq_rental_high?: number | string | null;
  enq_super_area?: number | string | null;
  enq_flat_details?: string | null;
  // Add other fields as they exist in your actual API response
  [key: string]: any;
}

interface DropdownOptions {
  cities: string[];
  builders: string[];
  communities: string[];
  balconies: string[];
  baths: string[];
  beds: string[];
  homeTypes: string[];
  parkingCounts: string[];
  propDesc: string[];
  tenants: string[];
  tenantEatPrefs: string[];
  propType: string[];
  availability: string[];
  facing: string[];
}

// ==================== Component ====================
const EnquiryManagementDashboard: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [activeTab, setActiveTab] = useState<"basic-info" | "property-details" | "preferences">("basic-info");
  const [currentEnquiry, setCurrentEnquiry] = useState<Enquiry | null>(null);
  const [editForm, setEditForm] = useState<Enquiry | null>(null);

  const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({
    cities: [],
    builders: [],
    communities: [],
    balconies: [],
    baths: [],
    beds: [],
    homeTypes: [],
    parkingCounts: [],
    propDesc: [],
    tenants: [],
    tenantEatPrefs: [],
    propType: [],
    availability: [],
    facing: [],
  });

  // Fetch enquiries on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchEnquiries();
        setEnquiries(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch enquiries");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch dropdown options when entering edit mode
  useEffect(() => {
    if (modalMode !== "edit" || dropdownOptions.cities.length > 0) return;

    const fetchOptions = async () => {
      try {
        const data = await fetchEnquiryDropdownOptions();
        setDropdownOptions(data);
      } catch (err: any) {
        console.error("Error fetching dropdown options:", err);
      }
    };

    fetchOptions();
  }, [modalMode, dropdownOptions.cities.length]);

  // Handlers
  const handleMoreInfoClick = async (enquiry: Enquiry) => {
    try {
      const details = await fetchEnquiryDetails(enquiry.enq_id);
      if (details) {
        setCurrentEnquiry(details);
        setEditForm(null);
        setModalMode("view");
        setActiveTab("basic-info");
        setIsModalOpen(true);
      }
    } catch (err: any) {
      alert("Failed to load enquiry details");
      console.error(err);
    }
  };

  const handleEditClick = () => {
    if (!currentEnquiry) return;

    setEditForm({
      ...currentEnquiry,
      enq_rental_low: currentEnquiry.enq_rental_low ?? "",
      enq_rental_high: currentEnquiry.enq_rental_high ?? "",
      enq_super_area: currentEnquiry.enq_super_area ?? "",
      enq_flat_details: currentEnquiry.enq_flat_details ?? "",
    });
    setModalMode("edit");
  };

  const handleFieldChange = useCallback(
    (field: keyof Enquiry) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev));
      },
    []
  );

  const handleNumericFieldChange = useCallback(
    (field: keyof Enquiry) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || /^[0-9]*$/.test(value)) {
        setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev));
      }
    },
    []
  );

  const handleUpdate = async () => {
    if (!editForm) return;

    const payload: Partial<Enquiry> & { enq_id: number; enq_status: number } = {
      ...editForm,
      enq_id: editForm.enq_id,
      enq_status: 26,
      enq_rental_low: editForm.enq_rental_low === "" ? null : Number(editForm.enq_rental_low),
      enq_rental_high: editForm.enq_rental_high === "" ? null : Number(editForm.enq_rental_high),
      enq_super_area: editForm.enq_super_area === "" ? null : Number(editForm.enq_super_area),
    };

    try {
      const result = await updateEnquiry(payload);
      if (result.success) {
        setEnquiries((prev) =>
          prev.map((item) => (item.enq_id === payload.enq_id ? { ...item, ...payload } : item))
        );
        setCurrentEnquiry(payload as Enquiry);
        setIsModalOpen(false);
        setEditForm(null);
        setModalMode("view");
      } else {
        throw new Error(result.error || "Update failed");
      }
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode("view");
    setEditForm(null);
    setActiveTab("basic-info");
  };

  return (
    <div className={`container mx-auto py-6 px-3 sm:px-4 lg:px-6 ${tailwindStyles.mainBackground}`}>
      <h1 className={`text-xl sm:text-2xl font-semibold mb-6 ${tailwindStyles.heading}`}>
        Dashboard for Enquiry Management
      </h1>

      {/* Loading / Error / Empty States */}
      {loading && <div className="text-center py-8">Loading enquiries...</div>}
      {error && <div className="text-red-600 text-center py-8">Error: {error}</div>}
      {!loading && !error && enquiries.length === 0 && (
        <div className="text-center py-8 text-gray-500">No enquiries found</div>
      )}

      {/* Enquiries Table */}
      {!loading && !error && enquiries.length > 0 && (
        <div className={`rounded-lg shadow overflow-hidden ${tailwindStyles.whiteCard}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
              <thead className={tailwindStyles.header}>
                <tr>
                  {["Enquiry ID", "Category", "Name", "Mobile", "Created At", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-4 sm:px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enquiries.map((e) => (
                  <tr key={e.enq_id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 text-gray-600">{e.enq_id}</td>
                    <td className="px-4 sm:px-6 py-4 text-gray-600">{e.category_name}</td>
                    <td className="px-4 sm:px-6 py-4 font-medium text-gray-900">{e.enq_name}</td>
                    <td className="px-4 sm:px-6 py-4 text-gray-600">{e.enq_mobile}</td>
                    <td className="px-4 sm:px-6 py-4 text-gray-600">
                      {e.enq_rec_create_time
                        ? new Date(e.enq_rec_create_time).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <button
                        onClick={() => handleMoreInfoClick(e)}
                        className={`${tailwindStyles.secondaryButton} text-xs`}
                      >
                        Add Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && currentEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className={`text-lg font-semibold ${tailwindStyles.heading}`}>
                {modalMode === "view" ? "Enquiry Details" : "Edit Enquiry"} #{currentEnquiry.enq_id}
              </h2>
              <div className="flex gap-3">
                {modalMode === "view" && (
                  <button onClick={handleEditClick} className={tailwindStyles.secondaryButton}>
                    Edit
                  </button>
                )}
                <button onClick={closeModal} className={tailwindStyles.thirdButton}>
                  Close
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="sticky top-[73px] bg-white border-b z-10 flex">
              {([
                { id: "basic-info", label: "Basic Info" },
                { id: "property-details", label: "Property Details" },
                { id: "preferences", label: "Preferences" },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "basic-info" && (
                <BasicInfoTab
                  data={modalMode === "view" ? currentEnquiry : editForm!}
                  modalMode={modalMode}
                  handleFieldChange={handleFieldChange}
                />
              )}
              {activeTab === "property-details" && (
                <PropertyDetailsTab
                  data={modalMode === "view" ? currentEnquiry : editForm!}
                  dropdownOptions={dropdownOptions}
                  modalMode={modalMode}
                  handleFieldChange={handleFieldChange}
                />
              )}
              {activeTab === "preferences" && (
                <PreferencesTab
                  data={modalMode === "view" ? currentEnquiry : editForm!}
                  dropdownOptions={dropdownOptions}
                  modalMode={modalMode}
                  handleFieldChange={handleFieldChange}
                  handleNumericFieldChange={handleNumericFieldChange}
                />
              )}
            </div>

            {/* Edit Mode Actions */}
            {modalMode === "edit" && (
              <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
                <button onClick={closeModal} className={tailwindStyles.thirdButton}>
                  Cancel
                </button>
                <button onClick={handleUpdate} className={tailwindStyles.secondaryButton}>
                  Update Enquiry
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryManagementDashboard;