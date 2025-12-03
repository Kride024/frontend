// EnquiryTabs.jsx
import React from "react";
import EnquiryInputField from "./EnquiryInputField"; 
/* ──────────────────────────────────────────
   REUSABLE HELPERS
────────────────────────────────────────── */
const renderField = (label, value) => (
  <div className="grid gap-2">
    <label className="text-sm font-medium text-gray-500">{label}</label>
    <div className="h-9 px-2 flex items-center border border-gray-200 rounded text-sm bg-gray-50 text-gray-600">
      {value || "-"}
    </div>
  </div>
);

const renderSelect = (id, label, value, options, disabled, handleChange) => (
  <div className="grid gap-2">
    <label htmlFor={id} className="text-sm font-medium">
      {label}
    </label>
    <select
      id={id}
      value={value ?? ""}
      onChange={handleChange(id)}
      disabled={disabled}
      className={`h-9 px-2 border rounded text-sm w-full ${
        disabled ? "bg-gray-50 text-gray-600 border-gray-200" : "bg-gray-100 border-gray-500"
      }`}
    >
      <option value="" disabled>
        Select {label.toLowerCase()}
      </option>
      {options?.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name ||
            o.home_type ||
            o.parking_type ||
            o.prop_type ||
            o.tenant_type ||
            o.nbaths ||
            o.parking_count ||
            o.prop_desc ||
            o.eat_pref ||
            o.prop_facing ||
            o.available}
        </option>
      ))}
    </select>
  </div>
);

const createInputField = (id, label, value, mode, onChange, type = "text") => {
  if (mode === "view") return renderField(label, value);
  return (
    <EnquiryInputField
      id={id}
      label={label}
      value={value}
      onChange={onChange(id)}
      type={type}
    />
  );
};

/* ──────────────────────────────────────────
   BASIC INFO TAB
────────────────────────────────────────── */
export const BasicInfoTab = React.memo(({ data, modalMode, handleFieldChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {createInputField("enq_name", "Name", data.enq_name, modalMode, handleFieldChange)}
      {createInputField("enq_mobile", "Mobile", data.enq_mobile, modalMode, handleFieldChange, "tel")}
      {createInputField("category_name", "Category", data.category_name, modalMode, handleFieldChange)}
    </div>
  );
});

/* ──────────────────────────────────────────
   PROPERTY DETAILS TAB
────────────────────────────────────────── */
export const PropertyDetailsTab = React.memo(
  ({ data, dropdownOptions, modalMode, handleFieldChange }) => {
    const isView = modalMode === "view";

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderSelect("enq_city", "City", data.enq_city, dropdownOptions.cities, isView, handleFieldChange)}
        {renderSelect("enq_builder", "Builder", data.enq_builder, dropdownOptions.builders, isView, handleFieldChange)}
        {renderSelect("enq_community", "Community", data.enq_community, dropdownOptions.communities, isView, handleFieldChange)}
        {renderSelect("enq_bhk_type", "BHK Type", data.enq_bhk_type, dropdownOptions.homeTypes, isView, handleFieldChange)}
        {renderSelect("enq_prop_type", "Property Type", data.enq_prop_type, dropdownOptions.propType, isView, handleFieldChange)}
        {renderSelect("enq_prop_desc", "Property Description", data.enq_prop_desc, dropdownOptions.propDesc, isView, handleFieldChange)}
        {renderSelect("enq_prop_facing", "Facing", data.enq_prop_facing, dropdownOptions.facing, isView, handleFieldChange)}
        {createInputField("enq_flat_details", "Flat/Property Address", data.enq_flat_details, modalMode, handleFieldChange)}
      </div>
    );
  }
);

/* ──────────────────────────────────────────
   PREFERENCES TAB
────────────────────────────────────────── */
export const PreferencesTab = React.memo(
  ({ data, dropdownOptions, modalMode, handleFieldChange, handleNumericFieldChange }) => {
    const isView = modalMode === "view";

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {createInputField("enq_rental_low", "Rental Low", data.enq_rental_low, modalMode, handleNumericFieldChange, "number")}
        {createInputField("enq_rental_high", "Rental High", data.enq_rental_high, modalMode, handleNumericFieldChange, "number")}
        {renderSelect("enq_parking_count", "Parking Count", data.enq_parking_count, dropdownOptions.parkingCounts, isView, handleFieldChange)}
        {renderSelect("enq_available", "Availability", data.enq_available, dropdownOptions.availability, isView, handleFieldChange)}
        {createInputField("enq_super_area", "Super Area", data.enq_super_area, modalMode, handleNumericFieldChange, "number")}
        {renderSelect("enq_tenant_type", "Tenant Type", data.enq_tenant_type, dropdownOptions.tenants, isView, handleFieldChange)}
        {renderSelect("enq_tenant_eat_pref", "Eating Preference", data.enq_tenant_eat_pref, dropdownOptions.tenantEatPrefs, isView, handleFieldChange)}
        {renderSelect("enq_no_baths", "Bathrooms", data.enq_no_baths, dropdownOptions.baths, isView, handleFieldChange)}
      </div>
    );
  }
);
