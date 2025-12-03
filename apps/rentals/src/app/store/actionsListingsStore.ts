// import { create } from "zustand";
// import apiStatusConstants from "../../../../../packages/servivces/utils/apiStatus";
// import { fetchUserActions } from "../shared/services/api/userApi";
// import { encryptData, decryptData } from "../../../../../packages/utils/crypto";

// // ---------- Types ----------

// export interface Property {
//   id: string | number;
//   [key: string]: any;
// }

// export interface ApiResponseType {
//   status: typeof apiStatusConstants[keyof typeof apiStatusConstants];
//   data: Property[];
//   errorMsg: string | null;
// }

// export interface ActionsListingsStore {
//   userProperties: Property[];
//   apiResponse: ApiResponseType;

//   fetchActionsListings: (id: string | number) => Promise<void>;
//   loadActionsListings: () => void;
//   clearActionsListings: () => void;
//   initializeStore: () => void;
// }

// // ---------- Zustand Store ----------

// export const useActionsListingsStore = create<ActionsListingsStore & {
//   resetStore: () => void;
// }>((set, get) => ({
//   userProperties: [],

//   apiResponse: {
//     status: apiStatusConstants.initial,
//     data: [],
//     errorMsg: null,
//   },

//   fetchActionsListings: async (id) => {
//     set({
//       apiResponse: {
//         status: apiStatusConstants.inProgress,
//         data: get().userProperties,
//         errorMsg: null,
//       },
//     });

//     try {
//       const result = await fetchUserActions(id);

//       if (result?.status && result.data?.userProperties) {
//         const properties = result.data.userProperties;

//         localStorage.setItem(
//           "userProperties",
//           encryptData({ userProperties: properties })
//         );

//         set({
//           userProperties: properties,
//           apiResponse: {
//             status: apiStatusConstants.success,
//             data: properties,
//             errorMsg: null,
//           },
//         });
//       } else {
//         set({
//           apiResponse: {
//             status: apiStatusConstants.failure,
//             data: get().userProperties,
//             errorMsg: "Invalid response",
//           },
//         });
//       }
//     } catch (error: any) {
//       set({
//         apiResponse: {
//           status: apiStatusConstants.failure,
//           data: get().userProperties,
//           errorMsg: error.message || "Network error",
//         },
//       });
//     }
//   },

//   loadActionsListings: () => {
//     const stored = localStorage.getItem("userProperties");
//     if (!stored) return;

//     try {
//       const data = decryptData(stored);
//       if (data?.userProperties) {
//         set({ userProperties: data.userProperties });
//       }
//     } catch (error) {
//       console.error("Failed to load userProperties:", error);
//     }
//   },

//   clearActionsListings: () => {
//     localStorage.removeItem("userProperties");

//     set({
//       userProperties: [],
//       apiResponse: {
//         status: apiStatusConstants.initial,
//         data: [],
//         errorMsg: null,
//       },
//     });
//   },

//   initializeStore: () => get().loadActionsListings(),

//   // ---------- NEW: Add this ----------
//   resetStore: () =>
//     set({
//       userProperties: [],
//       apiResponse: {
//         status: apiStatusConstants.initial,
//         data: [],
//         errorMsg: null,
//       },
//     }),
// }));
// // Auto-initialize store on load
// useActionsListingsStore.getState().initializeStore();


import { create } from "zustand";
import CryptoJS from "crypto-js";
import apiStatusConstants from "../../../../../packages/servivces/utils/apiStatus";
import { fetchUserActions } from "@/app/shared/services/api/index";

// -------------------- Types --------------------

export interface UserProperty {
  id: string;
  title?: string;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface FetchUserActionsResponse {
  status: boolean;
  data: {
    userProperties: UserProperty[];
  };
  errorMsg?: string;
}

interface ApiResponseState {
  status: string;
  data: UserProperty[];
  errorMsg: string | null;
}

interface EncryptedPropertiesCache {
  userProperties: UserProperty[];
}

interface ActionsListingsStore {
  userProperties: UserProperty[];
  apiResponse: ApiResponseState;

  fetchActionsListings: (id: string) => Promise<void>;
  loadActionsListings: () => void;
  clearActionsListings: () => void;
  resetStore: () => void;
  initializeStore: () => void;
}

// -------------------- Crypto Helpers --------------------

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

// -------------------- Zustand Store --------------------

const useActionsListingsStore = create<ActionsListingsStore>((set, get) => ({
  userProperties: [],
  apiResponse: {
    status: apiStatusConstants.initial,
    data: [],
    errorMsg: null,
  },

  // ---------------- Fetch User Actions ----------------
  fetchActionsListings: async (id: string) => {
    set({
      apiResponse: {
        status: apiStatusConstants.inProgress,
        data: get().userProperties,
        errorMsg: null,
      },
    });

    try {
      const result: FetchUserActionsResponse = await fetchUserActions(id);

      if (result.status) {
        const properties = result.data.userProperties;

        set(() => {
          const newState = {
            userProperties: properties,
            apiResponse: {
              status: apiStatusConstants.success,
              data: properties,
              errorMsg: null,
            },
          };

          // Encrypt and store data
          const encryptedData = encryptData({
            userProperties: properties,
          });
          localStorage.setItem("userProperties", encryptedData);

          return newState;
        });
      } else {
        set({
          apiResponse: {
            status: apiStatusConstants.failure,
            data: get().userProperties,
            errorMsg: result.errorMsg || "Invalid response format",
          },
        });
      }
    } catch (error: any) {
      console.error("Error fetching actions listings:", error);
      set({
        apiResponse: {
          status: apiStatusConstants.failure,
          data: get().userProperties,
          errorMsg: error?.message || "Failed to fetch actions listings",
        },
      });
    }
  },

  // ---------------- Load from LocalStorage ----------------
  loadActionsListings: () => {
    const encrypted = localStorage.getItem("userProperties");

    if (encrypted) {
      const decrypted = decryptData<EncryptedPropertiesCache>(encrypted);

      if (decrypted) {
        set({
          userProperties: decrypted.userProperties || [],
        });
      }
    }
  },

  // ---------------- Clear All Data ----------------
  clearActionsListings: () => {
    localStorage.removeItem("userProperties");
    set({
      userProperties: [],
      apiResponse: {
        status: apiStatusConstants.initial,
        data: [],
        errorMsg: null,
      },
    });
  },

  // ---------------- Reset Store ----------------
  resetStore: () => {
    localStorage.removeItem("userProperties");
    set({
      userProperties: [],
      apiResponse: {
        status: apiStatusConstants.initial,
        data: [],
        errorMsg: null,
      },
    });
  },

  // ---------------- Initialize on Load ----------------
  initializeStore: () => {
    get().loadActionsListings();
  },
}));

// Run initialization
useActionsListingsStore.getState().initializeStore();

export default useActionsListingsStore;
