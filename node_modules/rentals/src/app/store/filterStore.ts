import { create } from "zustand";
import { fetchFiltersData } from "../shared/services/api/index";

// --------- Types ---------

export interface DropdownData {
  cityList: any[];
  builderList: any[];
  communityList: any[];
  bedroomTypes: any[];
  propertyDescriptions: any[];
  availability: any[];
  tenanttype: any[];
}

export interface FiltersResponse {
  data: {
    result: {
      cities: any[];
      builders: any[];
      communities: any[];
      homeTypes: any[];
      propDesc: any[];
      availability: any[];
      tenantTypes: any[];
    };
  };
}

export interface FilterStoreState {
  allData: any[];

  dropdownData: DropdownData;

  setDropdownData: (data: Partial<DropdownData>) => void;

  fetchFilters: () => Promise<void>;
  fetchBuildersList: (cityId: string) => Promise<void>;
  fetchCommunitiesList: (builderId: string) => Promise<void>;

  resetStore: () => void;
}

// ---------- Zustand Store ----------

const useFilterStore = create<FilterStoreState>((set, get) => ({
  allData: [],

  dropdownData: {
    cityList: [],
    builderList: [],
    communityList: [],
    bedroomTypes: [],
    propertyDescriptions: [],
    availability: [],
    tenanttype: [],
  },

  setDropdownData: (data) =>
    set((state) => ({
      dropdownData: {
        ...state.dropdownData,
        ...data,
      },
    })),

  fetchFilters: async () => {
    try {
      const resp: FiltersResponse = await fetchFiltersData();

      set((state) => ({
        allData: resp.data.result,

        dropdownData: {
          ...state.dropdownData,
          cityList: resp.data.result.cities,
          builderList: resp.data.result.builders,
          communityList: resp.data.result.communities,
          bedroomTypes: resp.data.result.homeTypes,
          propertyDescriptions: resp.data.result.propDesc,
          availability: resp.data.result.availability,
          tenanttype: resp.data.result.tenantTypes,
        },
      }));
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  },

  fetchBuildersList: async (cityId) => {
    try {
      const state = get();

      const builders =
        state.allData?.builders?.filter(
          (eachBuilder: any) => eachBuilder.city_name === cityId
        ) || [];

      set({
        dropdownData: { ...state.dropdownData, builderList: builders },
      });
    } catch (error) {
      console.error("Error fetching builders:", error);
    }
  },

  fetchCommunitiesList: async (builderId) => {
    try {
      const state = get();

      const communities =
        state.allData?.communities?.filter(
          (eachBuilder: any) => eachBuilder.builder_name === builderId
        ) || [];

      set({
        dropdownData: { ...state.dropdownData, communityList: communities },
      });
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  },

  // Reset store state
  resetStore: () =>
  set(() => ({
    allData: [],

    dropdownData: {
      cityList: [],
      builderList: [],
      communityList: [],
      bedroomTypes: [],
      propertyDescriptions: [],
      availability: [],
      tenanttype: [],
    },
  })),

}));

export default useFilterStore;
