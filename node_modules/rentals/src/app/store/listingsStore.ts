// packages/store/src/listingStore.ts
import { create } from "zustand";
import apiStatusConstants from "../../../../../packages/servivces/utils/apiStatus";
import { fetchAllProperties } from "../shared/services/api/userApi";

interface Property {
  id: string | number;
  [key: string]: any;
}

interface ApiResponse<T = Property[]> {
  status: typeof apiStatusConstants[keyof typeof apiStatusConstants];
  data: T;
  count?: any;
  errorMsg: string | null;
}

interface Pagination {
  totalPages: number;
  totalRecords: number;
}

interface FilterData {
  city?: string;
  builders?: string | string[];
  community?: string;
  hometype?: string | string[];
  propertydescription?: string | string[];
  availability?: string | string[];
  tenanttype?: string | string[];
  [key: string]: any;
}

interface ListingStore {
  apiResponse: ApiResponse;
  pagination: Pagination;
  currentPage: number;
  pageLimit: number;
  filterData: FilterData;
  allListings: Property[];

  setCurrentPage: (page: number) => void;
  fetchListings: (filterData: FilterData, page?: number, pageLimit?: number) => Promise<void>;
  clearListings: () => void;
}

const useListingStore = create<ListingStore>((set, get) => ({
  apiResponse: {
    status: apiStatusConstants.initial,
    data: [],
    count: [],
    errorMsg: null,
  },
  pagination: { totalPages: 0, totalRecords: 0 },
  currentPage: 1,
  pageLimit: 6,
  filterData: {},
  allListings: [],

  setCurrentPage: (page) => set({ currentPage: page }),

  fetchListings: async (filterData, page = 1, pageLimit = 6) => {
    const { filterData: prevFilter, allListings } = get();
    const isNewFilterSet =
      page === 1 ||
      JSON.stringify(prevFilter) !== JSON.stringify(filterData);

    set({
      apiResponse: {
        status: apiStatusConstants.inProgress,
        data: isNewFilterSet ? [] : allListings,
        errorMsg: null,
      },
      filterData,
      currentPage: page,
    });

    try {
      const updatedFilterData = {
        ...filterData,
        hometype: Array.isArray(filterData.hometype)
          ? filterData.hometype.join(",")
          : filterData.hometype || "",
        propertydescription: Array.isArray(filterData.propertydescription)
          ? filterData.propertydescription.join(",")
          : filterData.propertydescription || "",
        availability: Array.isArray(filterData.availability)
          ? filterData.availability.join(",")
          : filterData.availability || "",
        tenanttype: Array.isArray(filterData.tenanttype)
          ? filterData.tenanttype.join(",")
          : filterData.tenanttype || "",
      };

      const result = await fetchAllProperties(updatedFilterData, { page, limit: pageLimit });

      const newListings = result.data.results || [];
      const updatedListings = isNewFilterSet
        ? newListings
        : [
            ...allListings,
            ...newListings.filter((nl: Property) => !allListings.some((cl) => cl.id === nl.id)),
          ];

      set({
        allListings: updatedListings,
        apiResponse: {
          status: apiStatusConstants.success,
          data: updatedListings,
          count: result.data.count,
          errorMsg: null,
        },
        pagination: {
          totalPages: result.data.pagination?.totalPages || 0,
          totalRecords: result.data.pagination?.totalRecords || 0,
        },
      });
    } catch (error: any) {
      set({
        apiResponse: {
          status: apiStatusConstants.failure,
          data: isNewFilterSet ? [] : allListings,
          errorMsg: error.message || "Failed to fetch properties",
        },
      });
    }
  },

  clearListings: () =>
    set({
      allListings: [],
      apiResponse: {
        status: apiStatusConstants.initial,
        data: [],
        count: [],
        errorMsg: null,
      },
      pagination: { totalPages: 0, totalRecords: 0 },
      currentPage: 1,
      filterData: {},
    }),
}));

export default useListingStore;