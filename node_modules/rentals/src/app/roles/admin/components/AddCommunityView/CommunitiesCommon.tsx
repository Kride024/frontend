// src/pages/Admin/Communities/CommunitiesCommon.tsx

import React from "react";

// Types
interface SelectOption {
  id: string | number;
  name: string;
}

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
}

interface SelectProps {
  id: string;
  label?: string;
  value: string | number;
  onChange: (newValue: string) => void;
  cities?: SelectOption[];
  builders?: SelectOption[];
  communities?: SelectOption[];
  placeholder?: string;
}

// Components

export const SectionCard: React.FC<SectionCardProps> = ({ title, children }) => (
  <div className="mb-8 p-6 border rounded-lg shadow-sm bg-gray-50">
    {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
    {children}
  </div>
);

export const CitySelect: React.FC<Pick<SelectProps, "id" | "label" | "value" | "onChange" | "cities">> = ({
  id,
  label = "Select City:",
  value,
  onChange,
  cities,
}) => (
  <div>
    <label htmlFor={id} className="block font-medium mb-1">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 block w-full border px-3 py-2 rounded-md"
    >
      <option value="">Select a city</option>
      {cities?.map((city) => (
        <option key={city.id} value={city.id}>
          {city.name}
        </option>
      ))}
    </select>
  </div>
);

export const BuilderSelect: React.FC<Pick<SelectProps, "id" | "label" | "value" | "onChange" | "builders">> = ({
  id,
  label = "Select Builder:",
  value,
  onChange,
  builders,
}) => (
  <div>
    <label htmlFor={id} className="block font-medium mb-1">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 block w-full border px-3 py-2 rounded-md"
    >
      <option value="">Select a builder</option>
      {Array.isArray(builders) ? (
        builders.map((builder) => (
          <option key={builder.id} value={builder.id}>
            {builder.name}
          </option>
        ))
      ) : (
        <option disabled>No builders available</option>
      )}
    </select>
  </div>
);

export const CommunitySelect: React.FC<Pick<SelectProps, "id" | "label" | "value" | "onChange" | "communities" | "placeholder">> = ({
  id,
  label = "Select Community:",
  value,
  onChange,
  communities,
  placeholder = "Select Community",
}) => (
  <div>
    <label htmlFor={id} className="block font-medium mb-1">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 block w-full border px-3 py-2 rounded-md"
    >
      <option value="">{placeholder}</option>
      {Array.isArray(communities) ? (
        communities.map((community) => (
          <option key={community.id} value={community.id}>
            {community.name}
          </option>
        ))
      ) : (
        <option disabled>No communities available</option>
      )}
    </select>
  </div>
);
