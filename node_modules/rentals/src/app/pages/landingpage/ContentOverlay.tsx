

import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

import { fetchFiltersData } from "../../shared/services/api/index";
import useFilterStore from "../../store/filterStore";
import useListingStore from "../../store/listingsStore";

import tailwindStyles from "../../../../../../packages/styles/tailwindStyles";
import Dropdown from "../../shared/ui/Dropdown";

//import "../../styles/animations.css";
import CompactCallbackForm from "../landingpage/_components/CompactCallbackForm";
import TabNavigation from "../../../../../../packages/ui/Shared/TabNavigation";
import { RENTALS_BASE } from "../../../../../../packages/config/constants";


// -------- Types --------

interface FilterResponse {
  cities: string[];
  builders: { city_name: string; builder_name: string }[];
  communities: { builder_name: string; community_name: string }[];
  homeTypes: string[];
  availability: string[];
}

interface DataState {
  cities: any[];
  builders: any[];
  communities: any[];
  bhks: any[];
  availability: any[];
}

const ContentOverlay = () => {
  const navigate = useNavigate();
  const [searchClicked, setSearchClicked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [data, setData] = useState<DataState>({
    cities: [],
    builders: [],
    communities: [],
    bhks: [],
    availability: [],
  });

  const [dataFromDB, setDataFronDB] = useState<any[]>([]);
  const [city, setCity] = useState<string>("");
  const [builder, setBuilder] = useState<string>("");
  const [community, setCommunityType] = useState<string>("");
  const [hometype, setBhk] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);

  const { setFilterData, filterData } = useFilterStore();
  const { setCurrentPage } = useListingStore();

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetchFiltersData();
        const result: FilterResponse = response.data.result;

        setDataFronDB(result);
        setData((prev) => ({
          ...prev,
          cities: result.cities,
          bhks: result.homeTypes,
          availability: result.availability,
        }));
        setLoading(false);
      } catch (error) {
        console.error("Filters Fetching Failed", error);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    if (city) {
      // @ts-ignore – keeping your original data shape as-is
      const builders = dataFromDB.builders?.filter(
        (eachBuilder: any) => eachBuilder.city_name == city
      );
      setData((prev) => ({ ...prev, builders }));
    }
  }, [city]);

  useEffect(() => {
    if (builder) {
      // @ts-ignore – keeping your original data shape as-is
      const communities = dataFromDB.communities?.filter(
        (eachCommunity: any) => eachCommunity.builder_name == builder
      );
      setData((prev) => ({ ...prev, communities }));
    }
  }, [builder]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchClicked(true);
    await setCurrentPage(1);

    const queryParams = new URLSearchParams();

    if (city) queryParams.append("city", city);
    if (builder) queryParams.append("builders", builder);
    if (community) queryParams.append("community", community);
    if (hometype.length > 0) queryParams.append("hometype", hometype[0]);
    if (availability.length > 0)
      queryParams.append("availability", availability[0]);

    navigate(`${RENTALS_BASE}?${queryParams.toString()}`);
  };

  return (
    <>
      <TabNavigation />

      <div className="relative w-full flex flex-col items-center justify-center px-6 py-6 md:py-4 lg:py-10 bg-opacity-70">
        <div className="text-center text-white">
          <h1 className={`${tailwindStyles.heading_1} text-[#ffc107] mb-4`}>
            Rufrent - Your Smart Rental Platform ONLY for Premium Gated
            Communities
          </h1>
          <h1 className={`${tailwindStyles.heading_3} text-gray-200 mb-4`}>
            Find Your Perfect Rental in a Premium Gated Community in Hyderabad
          </h1>
        </div>

        <div className="relative z-10 p-4 rounded-md md:rounded-2xl shadow-lg bg-white text-[#001433] w-full md:w-auto">
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <form
              className="flex flex-col items-center gap-3"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-3">
                <Dropdown
                  label="City"
                  value={city}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setCity(e.target.value);
                    if (e.target.value === "") {
                      setData((prev) => ({
                        ...prev,
                        builders: [],
                        communities: [],
                      }));
                      setBuilder("");
                      setCommunityType("");
                    }
                  }}
                  options={data.cities}
                />

                <Dropdown
                  label="Builders"
                  value={builder}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setBuilder(e.target.value);
                    if (e.target.value === "") {
                      setData((prev) => ({
                        ...prev,
                        communities: [],
                      }));
                      setCommunityType("");
                    }
                  }}
                  options={data.builders}
                />

                <div className="col-span-2 md:col-span-1">
                  <Dropdown
                    label="Communities"
                    value={community}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setCommunityType(e.target.value)
                    }
                    options={data.communities}
                  />
                </div>
              </div>

              <div className="flex w-full md:w-3/4 gap-3">
                <Dropdown
                  label="BHK"
                  value={hometype[0]}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setBhk([e.target.value])
                  }
                  options={data.bhks}
                />

                <Dropdown
                  label="Availability"
                  value={availability[0]}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setAvailability([e.target.value])
                  }
                  options={data.availability}
                />

                <button
                  type="submit"
                  className={`${
                    searchClicked
                      ? "bg-gray-500 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  } px-4 py-0 text-sm font-semibold rounded-full text-center hidden md:block`}
                  disabled={searchClicked}
                >
                  {searchClicked ? (
                    <ThreeDots height="24" width="24" color="white" />
                  ) : (
                    "Search"
                  )}
                </button>
              </div>

              <button
                type="submit"
                className={`${
                  searchClicked
                    ? "bg-gray-500 text-white"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } px-4 py-1 text-sm font-semibold text-center block md:hidden w-full md:w-auto rounded-md transition duration-300`}
                disabled={searchClicked}
              >
                {searchClicked ? (
                  <div className="flex justify-center">
                    <ThreeDots height="24" width="24" color="white" />
                  </div>
                ) : (
                  "Search"
                )}
              </button>
            </form>
          )}
        </div>

        <div className="mt-10">
          <CompactCallbackForm />
        </div>
      </div>
    </>
  );
};

export default ContentOverlay;
