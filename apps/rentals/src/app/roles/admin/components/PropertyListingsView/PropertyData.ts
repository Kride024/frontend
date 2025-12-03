import { useState, useEffect } from "react";
import {
  fetchProperties,
  updatePropertyStatus,
  deleteProperty,
} from "@/app/shared/services/api/adminApi";

/* ---------- Types ---------- */

export interface Property {
  id: string;
  // Add your actual property fields here:
  // name: string;
  // price: number;
  [key: string]: unknown;
}

export interface AppliedFilters {
  status: string;
  city: string;
  builder: string;
  community: string;
}

export interface FetchFilters extends AppliedFilters {
  page?: number;
  limit?: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
}

interface FetchPropertiesResponse {
  results?: Property[];
  pagination?: Pagination;
}

/* ---------- Hook / Logic ---------- */

export function PropertyData() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    status: "All Status",
    city: "All City",
    builder: "All Builder",
    community: "All Community",
  });

  const fetchData = async (filters: Partial<FetchFilters> = {}): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const pageToFetch = filters.page ?? currentPage;

      const finalFilters: FetchFilters = {
        ...appliedFilters,
        ...filters,
      };

      const response = (await fetchProperties({
        page: pageToFetch,
        limit: 6,
        ...finalFilters,
      })) as FetchPropertiesResponse;

      if (response) {
        setProperties(response.results ?? []);
        setCurrentPage(response.pagination?.currentPage ?? pageToFetch);
        setTotalPages(response.pagination?.totalPages ?? 1);
        setAppliedFilters(finalFilters);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      setProperties([]);
      setError("Failed to fetch properties.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data whenever `currentPage` changes
  useEffect(() => {
    void fetchData({ page: currentPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const updateStatus = async (
    propertyId: string,
    newStatusCode: number | string
  ): Promise<void> => {
    try {
      await updatePropertyStatus(propertyId, newStatusCode);
      void fetchData({ page: currentPage });
    } catch (err) {
      console.error("Error updating property status:", err);
      setError("Failed to update property status.");
    }
  };

  const deletePropertyData = async (propertyId: string): Promise<void> => {
    try {
      await deleteProperty(propertyId);
      setTimeout(() => {
        void fetchData({ ...appliedFilters, page: currentPage });
      }, 1500);
    } catch (err: any) {
      console.error("Failed to delete property:", err);
      setError(`Failed to delete property: ${err?.message ?? "Unknown error"}`);
    }
  };

  return {
    properties,
    loading,
    error,
    currentPage,
    totalPages,
    fetchData,
    setCurrentPage,
    updateStatus,
    deletePropertyData,
    appliedFilters,
  };
}
