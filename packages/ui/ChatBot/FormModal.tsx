// FormModal.tsx
import React from "react";
import { FormDataState } from "./types";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent) => void;
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  formErrors: string | null;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  formErrors,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full relative shadow-xl transform transition-transform duration-300 scale-100">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Request Callback</h2>
        {formErrors && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
            {formErrors}
          </div>
        )}
        <div className="space-y-4">
          <select
            name="userType"
            value={formData.userType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, userType: e.target.value }))
            }
            required
            className="w-full p-2 border rounded text-gray-500 disabled:opacity-50"
            disabled={formData.loadingUserTypes}
          >
            <option value="" disabled hidden>
              {formData.loadingUserTypes ? "Loading..." : "Select"}
            </option>
            {formData.userTypes?.map((type) => (
              <option key={type.id} value={type.category}>
                {type.category}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Your Name"
            required
            className="w-full p-2 border rounded disabled:opacity-50"
            disabled={formData.isSubmitting}
          />

          <div className="flex items-center">
            <div className="relative w-1/3 mr-2">
              <button
                type="button"
                className="w-full p-2 border rounded flex items-center justify-between bg-white disabled:opacity-50"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isDropdownOpen: !prev.isDropdownOpen,
                  }))
                }
                disabled={formData.isSubmitting}
              >
                {formData.selectedCountry ? (
                  <div className="flex items-center space-x-2">
                    <img
                      src={formData.selectedCountry.flag}
                      alt={formData.selectedCountry.name}
                      className="w-5 h-5"
                    />
                    <span>{formData.selectedCountry.code}</span>
                  </div>
                ) : (
                  <span>Code</span>
                )}
              </button>
              {formData.isDropdownOpen && (
                <div className="absolute z-10 mt-1 bg-white border rounded shadow-lg w-full min-w-[240px]">
                  <div className="p-2 border-b">
                    <input
                      type="text"
                      placeholder="Search countries"
                      className="w-full p-2 border rounded text-gray-500"
                      value={formData.searchTerm}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          searchTerm: e.target.value,
                        }))
                      }
                      autoFocus
                    />
                  </div>
                  <ul className="max-h-60 overflow-y-auto">
                    {formData.filteredCountries?.map((country, index) => (
                      <li
                        key={index}
                        className="p-2 flex items-center cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            selectedCountry: country,
                            isDropdownOpen: false,
                            searchTerm: "",
                          }));
                        }}
                      >
                        <img
                          src={country.flag}
                          alt={country.name}
                          className="w-5 h-5 mr-2"
                        />
                        <span className="truncate">
                          {country.name} {country.code}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                  setFormData((prev) => ({
                    ...prev,
                    mobile: e.target.value,
                  }));
                }
              }}
              placeholder="10-digit number"
              required
              minLength={10}
              maxLength={10}
              className="w-2/3 p-2 border rounded disabled:opacity-50"
              disabled={formData.isSubmitting}
            />
          </div>
          <p className="text-xs text-gray-500">
            Enter your 10-digit mobile number
          </p>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              disabled={formData.isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={formData.isSubmitting || formData.loadingUserTypes}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formData.isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
