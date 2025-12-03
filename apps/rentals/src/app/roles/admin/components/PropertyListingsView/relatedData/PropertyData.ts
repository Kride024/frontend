import { useState, useEffect } from "react";
import {
  fetchProperties,
  updatePropertyStatus,
  deleteProperty,
} from "@/app/shared/services/api/adminApi";

// 📌 Define types for Filters and Property
interface Filters {
  status: string;
  city: string;
  builder: string;
  community: string;
  page?: number;
  limit?: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
}

interface Property {
  id: string | number;
  [key: string]: any; // Extend based on your actual property structure
}

interface FetchResponse {
  results: Property[];
  pagination: Pagination;
}

interface UsePropertyDataReturn {
  properties: Property[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  fetchData: (filters?: Partial<Filters>) => Promise<void>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  updateStatus: (propertyId: string | number, newStatusCode: string | number) => Promise<void>;
  deletePropertyData: (propertyId: string | number) => Promise<void>;
  appliedFilters: Filters;
}

export function PropertyData(): UsePropertyDataReturn {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    status: "All Status",
    city: "All City",
    builder: "All Builder",
    community: "All Community",
  });

  const fetchData = async (filters: Partial<Filters> = {}): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const pageToFetch = filters.page || currentPage;
      const finalFilters = { ...appliedFilters, ...filters };

      const response: FetchResponse | null = await fetchProperties({
        page: pageToFetch,
        limit: 6,
        ...finalFilters,
      });

      if (response) {
        setProperties(response.results || []);
        setCurrentPage(response.pagination?.currentPage || pageToFetch);
        setTotalPages(response.pagination?.totalPages || 1);
        setAppliedFilters(finalFilters as Filters);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      setProperties([]);
      setError("Failed to fetch properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData({ page: currentPage });
  }, [currentPage]);

  const updateStatus = async (
    propertyId: string | number,
    newStatusCode: string | number
  ): Promise<void> => {
    try {
      await updatePropertyStatus(propertyId, newStatusCode);
      fetchData({ page: currentPage });
    } catch (err) {
      console.error("Error updating property status:", err);
      setError("Failed to update property status.");
    }
  };

  const deletePropertyData = async (propertyId: string | number): Promise<void> => {
    try {
      await deleteProperty(propertyId);
      setTimeout(() => {
        fetchData({ ...appliedFilters, page: currentPage });
      }, 1500);
    } catch (err: any) {
      console.error("Failed to delete property:", err);
      setError(`Failed to delete property: ${err.message}`);
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
