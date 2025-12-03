import React, { useEffect, useState } from "react";
import {
  fetchCities,
  fetchCommunities,
  fetchStatusOptions,
  fetchBuilders,
} from "@/app/shared/services/api/adminApi";

interface FilterBarProps {
  onFilterChange: (filters: Filters) => void;
}

interface Filters {
  searchQuery: string;
  status: string | number;
  city: string | number;
  builder: string | number;
  community: string | number;
}

interface ApiOption {
  id: number | string;
  name?: string;
  status_code?: string;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<Filters>({
    searchQuery: "",
    status: "All Status",
    city: "All City",
    builder: "All Builders",
    community: "All Community",
  });

  const [cities, setCities] = useState<ApiOption[]>([]);
  const [builders, setBuilders] = useState<ApiOption[]>([]);
  const [communities, setCommunities] = useState<ApiOption[]>([]);
  const [statusOptions, setStatusOptions] = useState<ApiOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load Cities and Status Options
  useEffect(() => {
    const loadCitiesAndStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        const [citiesData, statusData] = await Promise.all([
          (await fetchCities()).data,
          (await fetchStatusOptions()).data,
        ]);

        setCities(citiesData.result || []);
        setStatusOptions(statusData.result || []);

        const initialFilters = { ...filters, status: 1 };
        setFilters(initialFilters);
        onFilterChange(initialFilters);
      } catch (err: any) {
        console.error("Error loading cities and status options:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCitiesAndStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load Builders when City changes
  useEffect(() => {
    const loadBuilders = async () => {
      if (filters.city === "All City") return;

      try {
        setLoading(true);
        setError(null);
        const buildersData = await fetchBuilders(filters.city);
        setBuilders(buildersData.data.result || []);
      } catch (err: any) {
        console.error("Error while loading builders:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBuilders();
  }, [filters.city]);

  // Load Communities when Builder changes
  useEffect(() => {
    const loadCommunities = async () => {
      if (filters.builder === "All Builders") return;

      try {
        setLoading(true);
        setError(null);
        const communityData = await fetchCommunities(filters.builder);
        setCommunities(communityData.data.result || []);
      } catch (err: any) {
        console.error("Error loading communities:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCommunities();
  }, [filters.builder]);

  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    let newFilters: Filters = { ...filters, [key]: value };

    if (key === "city") {
      newFilters.builder = "All Builders";
      newFilters.community = "All Community";
    }
    if (key === "builder") {
      newFilters.community = "All Community";
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex items-center gap-4 py-6 justify-between overflow-auto">
      <h2 className="text-lg font-semibold w-auto whitespace-nowrap">
        Property Listings
      </h2>

      {loading && <p className="text-blue-500">Loading, please wait...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-4">
        {/* Status Select */}
        <select
          className="border rounded px-3 py-2"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", Number(e.target.value))}
        >
          {statusOptions.map((status) => (
            <option key={status.id} value={status.id}>
              {status.status_code}
            </option>
          ))}
        </select>

        {/* City Select */}
        <select
          className="border rounded px-3 py-2"
          value={filters.city}
          onChange={(e) => handleFilterChange("city", e.target.value)}
        >
          <option value="All City">All Cities</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>

        {/* Builder Select */}
        <select
          className="border rounded px-3 py-2"
          value={filters.builder}
          onChange={(e) => handleFilterChange("builder", e.target.value)}
        >
          <option value="All Builders">Select Builder</option>
          {builders.map((builder) => (
            <option key={builder.id} value={builder.id}>
              {builder.name}
            </option>
          ))}
        </select>

        {/* Community Select */}
        <select
          className="border rounded px-3 py-2"
          value={filters.community}
          onChange={(e) => handleFilterChange("community", e.target.value)}
          disabled={filters.builder === "All Builders"}
        >
          <option value="All Community">All Communities</option>
          {communities.map((community) => (
            <option key={community.id} value={community.id}>
              {community.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
