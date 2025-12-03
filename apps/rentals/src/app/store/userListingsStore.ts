// // packages/store/src/userListingsStore.ts
// import { create } from "zustand";
// import apiStatusConstants from "../../../../../packages/servivces/utils/apiStatus";
// import { fetchUserListings } from "../shared/services/api/userApi";
// import { encryptData, decryptData } from "../../../../../packages/utils/crypto";

// interface Property {
//   id: string | number;
//   [key: string]: any;
// }

// interface UserListingsStore {
//   listings: Property[];
//   selectedProperty: Property | null;
//   currentPage: number;
//   totalPages: number;
//   limit: number;
//   apiResponse: {
//     status: typeof apiStatusConstants[keyof typeof apiStatusConstants];
//     data: Property[];
//     errorMsg: string | null;
//   };

//   fetchUserListings: (userId: string | number) => Promise<void>;
//   setCurrentPage: (page: number) => void;
//   setSelectedProperty: (property: Property | null) => void;
//   clearSelectedProperty: () => void;
//   loadUserListings: () => void;
//   clearUserListings: () => void;
//   initializeStore: () => void;
// }

// export const useUserListingsStore = create<UserListingsStore>((set, get) => ({
//   listings: [],
//   selectedProperty: null,
//   currentPage: 1,
//   totalPages: 0,
//   limit: 6,
//   apiResponse: {
//     status: apiStatusConstants.initial,
//     data: [],
//     errorMsg: null,
//   },

//   fetchUserListings: async (userId) => {
//     set({
//       apiResponse: { status: apiStatusConstants.inProgress, data: get().listings, errorMsg: null },
//     });

//     try {
//       const res = await fetchUserListings(userId, get().currentPage, get().limit);
//       if (res.status && res.data?.results) {
//         const listings = res.data.results;
//         const totalPages = res.data.pagination?.totalPages || 0;

//         const saveData = { listings, currentPage: get().currentPage, totalPages };
//         localStorage.setItem("userListings", encryptData(saveData));

//         set({
//           listings,
//           totalPages,
//           apiResponse: { status: apiStatusConstants.success, data: listings, errorMsg: null },
//         });
//       }
//     } catch (error: any) {
//       set({
//         apiResponse: { status: apiStatusConstants.failure, data: get().listings, errorMsg: error.message },
//       });
//     }
//   },

//   setCurrentPage: (page) => {
//     set({ currentPage: page });
//     const state = get();
//     localStorage.setItem("userListings", encryptData({
//       listings: state.listings,
//       currentPage: page,
//       totalPages: state.totalPages,
//     }));
//   },

//   setSelectedProperty: (property) => {
//     set({ selectedProperty: property });
//     if (property) {
//       localStorage.setItem("selectedProperty", encryptData({ selectedProperty: property }));
//     } else {
//       localStorage.removeItem("selectedProperty");
//     }
//   },

//   clearSelectedProperty: () => {
//     set({ selectedProperty: null });
//     localStorage.removeItem("selectedProperty");
//   },

//   loadUserListings: () => {
//     const data = decryptData(localStorage.getItem("userListings") || "");
//     if (data) {
//       set({
//         listings: data.listings || [],
//         currentPage: data.currentPage || 1,
//         totalPages: data.totalPages || 0,
//       });
//     }

//     const selected = decryptData(localStorage.getItem("selectedProperty") || "");
//     if (selected?.selectedProperty) {
//       set({ selectedProperty: selected.selectedProperty });
//     }
//   },

//   clearUserListings: () => {
//     localStorage.removeItem("userListings");
//     localStorage.removeItem("selectedProperty");
//     set({
//       listings: [],
//       selectedProperty: null,
//       currentPage: 1,
//       totalPages: 0,
//       apiResponse: { status: apiStatusConstants.initial, data: [], errorMsg: null },
//     });
//   },

//   initializeStore: () => get().loadUserListings(),
// }));

// useUserListingsStore.getState().initializeStore();

import { create } from "zustand";
import apiStatusConstants from "../../../../../packages/servivces/utils/apiStatus";
import { fetchUserListings } from "../shared/services/api/index";
import CryptoJS from "crypto-js";

// ---------- Types ----------
export interface ListingItem {
  id: string;
  title?: string;
  price?: number;
  [key: string]: any; // extendable
}

interface PaginationData {
  totalPages: number;
}

interface ListingsApiResponse {
  status: boolean;
  data: {
    results: ListingItem[];
    pagination: PaginationData;
  };
  errorMsg?: string;
}

interface ApiState {
  status: string;
  data: ListingItem[];
  errorMsg: string | null;
}

interface EncryptedListingsCache {
  listings: ListingItem[];
  currentPage: number;
  totalPages: number;
}

interface EncryptedSelectedPropertyCache {
  selectedProperty: ListingItem | null;
}

// ---------- Crypto Helpers ----------
const secretKey = `${import.meta.env.VITE_CRYPTO_SECRET_KEY}`;

const encryptData = (data: object): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = <T>(data: string): T | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as T;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

// ---------- Zustand Store ----------
interface UserListingsStore {
  listings: ListingItem[];
  apiResponse: ApiState;
  currentPage: number;
  totalPages: number;
  limit: number;
  selectedProperty: ListingItem | null;

  fetchUserListings: (userId: string) => Promise<void>;
  loadUserListings: () => void;
  clearUserListings: () => void;
  setCurrentPage: (page: number) => void;

  setSelectedProperty: (property: ListingItem | null) => void;
  clearSelectedProperty: () => void;
  loadSelectedProperty: () => void;

  initializeStore: () => void;
}

const useUserListingsStore = create<UserListingsStore>((set, get) => ({
  listings: [],
  apiResponse: {
    status: apiStatusConstants.initial,
    data: [],
    errorMsg: null,
  },
  currentPage: 1,
  totalPages: 0,
  limit: 6,
  selectedProperty: null,

  // ------------ Fetch Listings ------------
  fetchUserListings: async (userId: string) => {
    set({
      apiResponse: {
        status: apiStatusConstants.inProgress,
        data: get().listings,
      
        errorMsg: null,
      },
        
    });

    try {
      const listings: ListingsApiResponse = await fetchUserListings(
        userId,
        get().currentPage,
        get().limit
      );

      if (listings.status) {
        const newListings = listings.data.results;

        set((state) => {
          const nextState = {
            listings: newListings,
            totalPages: listings.data.pagination.totalPages,
            apiResponse: {
              status: apiStatusConstants.success,
              data: newListings,
              errorMsg: null,
            },
          };

          const encrypted = encryptData({
            listings: newListings,
            currentPage: state.currentPage,
            totalPages: listings.data.pagination.totalPages,
          });

          localStorage.setItem("userListings", encrypted);
          return nextState;
        });
      } else {
        set({
          apiResponse: {
            status: apiStatusConstants.failure,
            data: get().listings,
            errorMsg: listings.errorMsg || "Failed to fetch Listings",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      set({
        apiResponse: {
          status: apiStatusConstants.failure,
          data: get().listings,
          errorMsg: "Failed to fetch Listings",
        },
      });
    }
  },

  // ------------ Load Cached Listings ------------
  loadUserListings: () => {
    const encrypted = localStorage.getItem("userListings");
    if (encrypted) {
      const decrypted = decryptData<EncryptedListingsCache>(encrypted);
      if (decrypted) {
        set({
          listings: decrypted.listings ?? [],
          currentPage: decrypted.currentPage ?? 1,
          totalPages: decrypted.totalPages ?? 0,
          apiResponse: {
            status: apiStatusConstants.success,
            data: decrypted.listings ?? [],
            errorMsg: null,
          },
        });
      }
    }
  },

  // ------------ Clear And Reset Listings ------------
  clearUserListings: () => {
    localStorage.removeItem("userListings");
    set({
      listings: [],
      currentPage: 1,
      totalPages: 0,
      apiResponse: {
        status: apiStatusConstants.initial,
        data: [],
        errorMsg: null,
      },
      selectedProperty: null,
    });
  },

  // ------------ Page Setter ------------
  setCurrentPage: (page: number) => {
    set({ currentPage: page });
    const state = get();
    const encrypted = encryptData({
      listings: state.listings,
      currentPage: page,
      totalPages: state.totalPages,
    });
    localStorage.setItem("userListings", encrypted);
  },

  // ------------ Edit Property ------------
  setSelectedProperty: (property: ListingItem | null) => {
    set({ selectedProperty: property });
    const encrypted = encryptData({ selectedProperty: property });
    localStorage.setItem("selectedProperty", encrypted);
  },

  clearSelectedProperty: () => {
    set({ selectedProperty: null });
    localStorage.removeItem("selectedProperty");
  },

  loadSelectedProperty: () => {
    const encrypted = localStorage.getItem("selectedProperty");
    if (encrypted) {
      const decrypted =
        decryptData<EncryptedSelectedPropertyCache>(encrypted);
      if (decrypted) {
        set({ selectedProperty: decrypted.selectedProperty });
      }
    }
  },

  // ------------ Init Store ------------
  initializeStore: () => {
    get().loadUserListings();
    get().loadSelectedProperty();
  },
}));

useUserListingsStore.getState().initializeStore();

export default useUserListingsStore;
