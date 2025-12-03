// services/adminServices.ts
import axios, { AxiosResponse } from "axios";
import {
  fetchDashboardDataApi,
  getRecords,
  fetchPropertiesApi,
  updatePropertyStatusApi,
  fetchAllRequest,
  fetchAllRmsFms,
  updateRecordInDB,
  ApiResponse,
  PropertyFilter,
} from "./crud/adminCrud";
import { deleteRecord } from "../../../../../../../packages/servivces/utils/apiCrud";
import { buildApiUrl } from "../../../../../../../packages/servivces/utils/apiHelper";

/* --------------------------
   Dashboard
   -------------------------- */

export const fetchDashboardData = async (): Promise<AxiosResponse<ApiResponse>> => {
  return fetchDashboardDataApi();
};

/* --------------------------
   Property Listings
   -------------------------- */

/** Fetch cities */
export const fetchCities = async (): Promise<AxiosResponse<ApiResponse> | []> => {
  try {
    const url = buildApiUrl("/getRecords", "crud");
    console.log("Fetching cities from:", url);
    const response = await axios.get(url, {
      params: {
        tableName: "st_city",
        fieldNames: "id,name",
        whereCondition: "rstatus=1",
      },
    });
    console.log("fetchCities response:", response.data);
    return response;
  } catch (error: any) {
    console.error("Error fetching cities:", error.response?.data || error.message);
    return [];
  }
};

/** Status options (delegates to getRecords) */
export const fetchStatusOptions = async (): Promise<AxiosResponse<ApiResponse>> => {
  return await getRecords("st_current_status", "id,status_code", 'status_category="ADM"');
};

/** Fetch builders by city */
export const fetchBuilders = async (cityId?: number | string): Promise<AxiosResponse<ApiResponse> | { result: any[] }> => {
  if (!cityId) return { result: [] };
  try {
    const url = buildApiUrl("/getRecords", "crud");
    console.log("Fetching builders from:", url);
    const response = await axios.get(url, {
      params: {
        tableName: "st_builder",
        fieldNames: "id,name",
        whereCondition: `rstatus=1 AND city_id=${cityId}`,
      },
    });
    console.log("fetchBuilders response:", response.data);
    return response;
  } catch (error: any) {
    console.error("Error fetching builders:", error.response?.data || error.message);
    return { result: [] };
  }
};

/** Fetch communities by builder */
export const fetchCommunities = async (builderId?: number | string): Promise<AxiosResponse<ApiResponse> | { result: any[] }> => {
  if (!builderId) return { result: [] };
  try {
    const url = buildApiUrl("/getRecords", "crud");
    console.log("Fetching communities from:", url);
    const response = await axios.get(url, {
      params: {
        tableName: "st_community",
        fieldNames: "id,name",
        whereCondition: `rstatus=1 AND builder_id=${builderId}`,
      },
    });
    console.log("fetchCommunities response:", response.data);
    return response;
  } catch (error: any) {
    console.error("Error fetching communities:", error.response?.data || error.message);
    return { result: [] };
  }
};

/** Fetch all communities */
export const fetchAllCommunities = async (): Promise<any[]> => {
  try {
    const url = buildApiUrl("/getRecords", "crud");
    console.log("Fetching all communities from:", url);
    const response = await axios.get(url, {
      params: {
        tableName: "st_community",
        fieldNames: "id,name,builder_id",
        whereCondition: "rstatus=1",
      },
    });
    console.log("fetchAllCommunities response:", response.data);
    return response.data?.result || [];
  } catch (error: any) {
    console.error("Error fetching all communities:", error.response?.data || error.message);
    return [];
  }
};

/** Fetch properties using filter */
export const fetchProperties = async (
  filters: PropertyFilter
): Promise<{ results?: any; pagination?: any } | { error: string }> => {
  try {
    const data = await fetchPropertiesApi(filters);
    if (!data || !data.results || !data.pagination) {
      throw new Error("Invalid response structure from API");
    }
    return data;
  } catch (error: any) {
    console.error("Error fetching properties:", error);
    return { error: error.message || "Unknown error" };
  }
};

/** Update property status */
export const updatePropertyStatus = async (propertyId: number | string, newStatus: number | string) => {
  try {
    const response = await updatePropertyStatusApi(propertyId, newStatus);
    return { success: true, data: response };
  } catch (error: any) {
    console.error("Error updating property status:", error);
    return { error: error.message || "Unknown error" };
  }
};

/** Delete property */
export const deleteProperty = async (propertyId: number | string) => {
  try {
    const response = await deleteRecord("dy_property", `id=${propertyId}`);
    return { message: response.message };
  } catch (error: any) {
    console.error("Error deleting property:", error);
    return { error: error.message || "Unknown error" };
  }
};

/* --------------------------
   Requests
   -------------------------- */

export const fetchRecords = async (
  page = 1,
  perPage = 10,
  filters: Record<string, any> = {}
) => {
  try {
    const { current_status, rm_id, builder_id, community_id } = filters;
    const params = new URLSearchParams({
      page: String(page),
      perPage: String(perPage),
      ...(current_status && { current_status: String(current_status) }),
      ...(rm_id && { rm_id: String(rm_id) }),
      ...(builder_id && { builder_id: String(builder_id) }),
      ...(community_id && { community_id: String(community_id) }),
    });
    const url = buildApiUrl(`/adminRequests?${params}`, "admin");
    console.log("Fetching records from:", url);
    const response = await axios.get(url);
    console.log("fetchRecords response:", response.data);
    const defaultPagination = {
      currentPage: page,
      totalPages: 1,
      totalRecords: response.data.result?.length || 0,
      limit: perPage,
    };
    return {
      ...response,
      data: {
        ...response.data,
        pagination: response.data.pagination || defaultPagination,
      },
    };
  } catch (error: any) {
    console.error("Error fetching records:", error);
    return {
      data: {
        result: [],
        status: [],
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalRecords: 0,
          limit: perPage,
        },
      },
    };
  }
};

export const fetchRmFms = async (): Promise<AxiosResponse<any>> => {
  try {
    const url = buildApiUrl("/staffDetails", "user");
    console.log("Fetching RM/FM details from:", url);
    const response = await axios.get(url);
    console.log("fetchRmsressssssssss:", response.data);
    return response;
  } catch (error: any) {
    console.error("Error fetching RM/FM details:", error);
    throw error;
  }
};

export const updateRequest = async (recordId: number | string, updateRecords: any) => {
  return updateRecordInDB(recordId, updateRecords);
};

/* --------------------------
   Reviews
   -------------------------- */

export const getTestimonials = async (id: number | null = null): Promise<any[]> => {
  try {
    const response = await axios.get(buildApiUrl("/getNewTestimonialRecord", "test"), {
      params: id ? { id } : {},
    });
    return response.data.result;
  } catch (error: any) {
    console.error("API Error:", error.response?.data, error.message);
    if (error.response?.status === 404) {
      throw new Error("No approved testimonials found.");
    } else {
      throw new Error(error.response?.data?.error || "Failed to fetch testimonials.");
    }
  }
};

export const updateTestimonial = async (id: number, updateData: Record<string, any>) => {
  const url = buildApiUrl("updateNewTestimonialRecord", "test");
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, ...updateData }),
  });

  if (!response.ok) {
    throw new Error("Failed to update testimonial");
  }

  return response.json();
};

export const deleteTestimonial = async (id: number) => {
  const url = buildApiUrl("deleteNewTestimonialRecord", "test") + `?id=${id}`;
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to delete testimonial");
  }
  return response.json();
};

/* --------------------------
   Communities / Amenities / Landmarks / Additional APIs
   -------------------------- */

export const fetchAmenityCategories = async (): Promise<any[]> => {
  try {
    const url = buildApiUrl("/getRecords", "crud");
    console.log("Fetching amenity categories from:", url);
    const response = await axios.get(url, {
      params: {
        tableName: "st_amenity_category",
        fieldNames: "id,amenity_category",
        whereCondition: "rstatus=1",
      },
    });
    console.log("fetchAmenityCategories response:", response.data);
    return response;
  } catch (error: any) {
    console.error("Error fetching amenity categories:", error.response?.data || error.message);
    return [];
  }
};

export const fetchAmenities = async (communityId?: number | string, categoryId?: number | string): Promise<any[]> => {
  if (!communityId || !categoryId) return [];
  try {
    const encodedWhereCondition = encodeURIComponent(`rstatus=1 AND amenity_category_id=${categoryId}`);
    const url = buildApiUrl(
      `/getRecords?tableName=st_amenities&fieldNames=id,amenity_name&whereCondition=${encodedWhereCondition}`,
      "crud"
    );
    console.log("Fetching amenities from:", url);
    const response = await axios.get(url);
    console.log("fetchAmenities response:", response.data);
    return response.data.result || [];
  } catch (error: any) {
    console.error("Error fetching amenities:", error.response?.data || error.message);
    return [];
  }
};

export const fetchLandmarkCategories = async (): Promise<any[]> => {
  try {
    const url = buildApiUrl("/getRecords", "crud");
    console.log("Fetching landmark categories from:", url);
    const response = await axios.get(url, {
      params: {
        tableName: "st_landmarks_category",
        fieldNames: "id,landmark_category",
        whereCondition: "rstatus=1",
      },
    });
    console.log("fetchLandmarkCategories response:", response.data);
    return response.data.result || [];
  } catch (error: any) {
    console.error("Error fetching landmark categories:", error.response?.data || error.message);
    return [];
  }
};

export const createCommunity = async (communityData: Record<string, any>, imageFile?: File) => {
  try {
    const url = buildApiUrl("/createCommunity", "user");
    console.log("Creating community at:", url);
    const formData = new FormData();
    formData.append("communityData", JSON.stringify(communityData));
    if (imageFile) formData.append("images", imageFile);
    const response = await axios.post(url, formData);
    console.log("createCommunity response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating community:", error.response?.data || error.message);
    throw error;
  }
};

export const addAmenities = async (payload: any) => {
  try {
    const url = buildApiUrl("/addamenities", "user");
    console.log("Adding amenities at:", url);
    const response = await axios.post(url, payload);
    console.log("addAmenities response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error adding amenities:", error.response?.data || error.message);
    throw error;
  }
};

export const addLandmarks = async (payload: any) => {
  try {
    const url = buildApiUrl("/landmarks", "user");
    console.log("Adding landmarks at:", url);
    const response = await axios.post(url, payload);
    console.log("addLandmarks response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error adding landmarks:", error.response?.data || error.message);
    throw error;
  }
};

export const importAmenities = async (sourceCommunityId: number | string, targetCommunityId: number | string) => {
  try {
    const url = buildApiUrl(
      `/importamenities?source_community_id=${sourceCommunityId}&target_community_id=${targetCommunityId}`,
      "user"
    );
    console.log("Importing amenities from:", url);
    const response = await axios.post(url);
    console.log("importAmenities response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error importing amenities:", error.response?.data || error.message);
    throw error;
  }
};

export const importLandmarks = async (sourceCommunityId: number | string, targetCommunityId: number | string) => {
  try {
    const url = buildApiUrl(
      `/importLandmarks?source_community_id=${sourceCommunityId}&target_community_id=${targetCommunityId}`,
      "user"
    );
    console.log("Importing landmarks from:", url);
    const response = await axios.post(url);
    console.log("importLandmarks response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error importing landmarks:", error.response?.data || error.message);
    throw error;
  }
};

/* --------------------------
   Additional APIs (map / tasks / RMs)
   -------------------------- */

export const fetchComMapDetails = async (communityId?: number | string) => {
  try {
    const url = buildApiUrl("/communityMapDetails", "fm");
    console.log("Fetching community map details from:", url);
    const response = await axios.get(url, { params: communityId ? { community_id: communityId } : {} });
    console.log("fetchComMapDetails response:", response.data);
    return response;
  } catch (error: any) {
    console.error("Error fetching community map details:", error);
    throw error;
  }
};

export const updateTask = async (payload: Record<string, any>) => {
  try {
    const url = buildApiUrl("/updateTask", "rm");
    console.log("Updating task at:", url);
    const response = await axios.put(url, payload);
    console.log("updateTask response:", response.data);
    return response;
  } catch (error: any) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const fetchRMs = async () => {
  try {
    const url = buildApiUrl("/getFmList", "fm");
    console.log("Fetching RMs/FMs from:", url);
    const response = await axios.get(url);
    console.log("fetchRMs response:", JSON.stringify(response.data, null, 2));
    const result = response.data.result || [];
    if (Array.isArray(result)) {
      const rmSet = new Set<number | string>();
      const fmSet = new Set<number | string>();
      const rms: { user_id: number | string; user_name: string }[] = [];
      const fms: { user_id: number | string; user_name: string }[] = [];
      result.forEach((item: any) => {
        if (item.rm_id && item.rm_name && !rmSet.has(item.rm_id)) {
          rms.push({ user_id: item.rm_id, user_name: item.rm_name });
          rmSet.add(item.rm_id);
        }
        if (item.fm_id && item.fm_name && !fmSet.has(item.fm_id)) {
          fms.push({ user_id: item.fm_id, user_name: item.fm_name });
          fmSet.add(item.fm_id);
        }
      });
      return { RMs: rms, FMs: fms };
    }
    console.warn("fetchRMs: Invalid response structure, returning default");
    return { RMs: [], FMs: [] };
  } catch (error: any) {
    console.error("Error fetching RMs/FMs:", error.response?.data || error.message);
    return { RMs: [], FMs: [] };
  }
};

export const fetchDyRmFmComMapIds = async (): Promise<any[]> => {
  try {
    const url = buildApiUrl("/getRecords", "crud");
    console.log("Fetching dy_rm_fm_com_map IDs from:", url);
    const response = await axios.get(url, {
      params: {
        tableName: "dy_rm_fm_com_map",
        fieldNames: "id",
      },
    });
    console.log("fetchDyRmFmComMapIds response:", response.data);
    return response.data.result || [];
  } catch (error: any) {
    console.error("Error fetching dy_rm_fm_com_map IDs:", error);
    return [];
  }
};

export const deleteRecords = async (rowId: number | string) => {
  try {
    const url = buildApiUrl("/deleteRecord", "crud");
    console.log("Deleting record at:", url);
    const response = await axios.delete(url, {
      data: {
        tableName: "dy_rm_fm_com_map",
        whereCondition: `id=${rowId}`,
      },
    });
    console.log("deleteRecord response:", response.data);
    return response;
  } catch (error: any) {
    console.error("Error deleting record:", error);
    return error;
  }
};

export const updateRecord = async (tableIndex: number | string, communityid: number | string, fmid: number | string, rmid: number | string) => {
  try {
    const url = buildApiUrl("/updateRecord", "crud");
    console.log("Updating record at:", url);
    const response = await axios.put(url, {
      tableName: "dy_rm_fm_com_map",
      fieldValuePairs: {
        community_id: communityid,
        fm_id: fmid,
        rm_id: rmid,
      },
      whereCondition: `id=${tableIndex}`,
    });
    console.log("updateRecord response:", response.data);
    return response;
  } catch (error: any) {
    console.error("Error updating record:", error);
    return error;
  }
};

export const addNewRecord = async (tableIndex: number, communityid: number | string, fmid: number | string, rmid: number | string) => {
  try {
    const url = buildApiUrl("/addNewRecord", "crud");
    console.log("Adding new record at:", url);
    const response = await axios.post(url, {
      tableName: "dy_rm_fm_com_map",
      fieldNames: "id,community_id,fm_id,rm_id",
      fieldValues: `${tableIndex},${communityid},${fmid},${rmid}`,
    });
    console.log("addNewRecord response:", response.data);
    return response;
  } catch (error: any) {
    console.error("Error adding new record:", error);
    return error;
  }
};

export const fetchid = async (): Promise<any[]> => {
  try {
    const url = buildApiUrl("/getRecords", "crud");
    console.log("Fetching IDs from:", url);
    const response = await axios.get(url, {
      params: {
        tableName: "dy_rm_fm_com_map",
        fieldNames: "id",
      },
    });
    console.log("fetchid response:", response.data);
    return response.data.result;
  } catch (error: any) {
    console.error("Error fetching IDs:", error);
    return error;
  }
};

/* --------------------------
   DB Tables APIs
   -------------------------- */

export const fetchTables = async (): Promise<any[]> => {
  try {
    const url = buildApiUrl("/st-tables", "admin");
    console.log("Fetching tables from:", url);
    const response = await axios.get(url);
    console.log("fetchTables response:", response.data);
    return Array.isArray(response.data.tables) ? response.data.tables : [];
  } catch (error: any) {
    console.error("Error fetching tables:", error.response?.data || error.message);
    return [];
  }
};

export const fetchTableData = async (tableName?: string) => {
  if (!tableName) return { result: [], headers: [] };
  try {
    const url = buildApiUrl("/getRecords", "crud");
    console.log("Fetching table data from:", url);
    const response = await axios.get(url, {
      params: {
        tableName,
        fieldNames: "*",
      },
    });
    console.log("fetchTableData response:", response.data);
    if (Array.isArray(response.data.result) && response.data.result.length > 0) {
      return {
        result: response.data.result,
        headers: Object.keys(response.data.result[0]),
      };
    }
    return { result: [], headers: [] };
  } catch (error: any) {
    console.error("Error fetching table data:", error.response?.data || error.message);
    return { result: [], headers: [] };
  }
};

export const saveRecords = async (tableName: string, selectedRows: number[], tableData: any[]) => {
  try {
    const results: any[] = [];
    for (const rowIndex of selectedRows) {
      const row = tableData[rowIndex];
      if (row.id && Number.isInteger(row.id)) {
        const url = buildApiUrl("/updateRecord", "crud");
        console.log("Updating record at:", url);
        const response = await axios.put(url, {
          tableName,
          fieldValuePairs: row,
          whereCondition: `id=${row.id}`,
        });
        console.log("saveRecords (PUT) response:", response.data);
        results.push(response.data);
      } else {
        const maxId = Math.max(...tableData.map((r: any) => (r.id ? r.id : 0)));
        row.id = maxId + 1;
        const url = buildApiUrl("/addNewRecord", "crud");
        console.log("Adding new record at:", url);
        const response = await axios.post(url, {
          tableName,
          fieldNames: Object.keys(row).join(","),
          fieldValues: Object.values(row).map((value) => `'${value}'`).join(","),
        });
        console.log("saveRecords (POST) response:", response.data);
        results.push(response.data);
      }
    }
    return { success: true, results };
  } catch (error: any) {
    console.error("Error saving records:", error.response?.data || error.message);
    return { error: error.message };
  }
};

export const deleteTableRecords = async (tableName: string, selectedRows: number[], tableData: any[]) => {
  try {
    const failedDeletes: number[] = [];
    for (const rowIndex of selectedRows) {
      const rowId = tableData[rowIndex]?.id;
      if (!rowId) {
        failedDeletes.push(rowIndex);
        continue;
      }
      const url = buildApiUrl("/deleteRecord", "crud");
      console.log("Deleting record at:", url);
      const response = await axios.delete(url, {
        data: {
          tableName,
          whereCondition: `id=${rowId}`,
        },
      });
      console.log("deleteTableRecords response:", response.data);
    }
    return { success: failedDeletes.length === 0, failed: failedDeletes };
  } catch (error: any) {
    console.error("Error deleting records:", error.response?.data || error.message);
    return { error: error.message, failed: selectedRows };
  }
};

/* --------------------------
   Enquiry Management
   -------------------------- */

export const fetchEnquiries = async (): Promise<any[]> => {
  try {
    const url = buildApiUrl("/getNewEnquiryRecord", "user");
    const response = await axios.get(url);
    return Array.isArray(response.data.result) ? response.data.result : [];
  } catch (error: any) {
    console.error("Error fetching enquiries:", error.response?.data || error.message);
    return [];
  }
};

export const fetchEnquiryDetails = async (enqId?: number | string) => {
  if (!enqId) return null;
  try {
    const url = buildApiUrl(`/getNewEnquiryRecord?enq_id=${enqId}`, "user");
    console.log("Fetching enquiry details from:", url);
    const response = await axios.get(url);
    return Array.isArray(response.data.result) && response.data.result.length > 0 ? response.data.result[0] : null;
  } catch (error: any) {
    console.error("Error fetching enquiry details:", error.response?.data || error.message);
    return null;
  }
};

export const updateEnquiry = async (payload: Record<string, any>) => {
  try {
    const url = buildApiUrl("/updatenq", "user");
    console.log("Updating enquiry at:", url);
    const response = await axios.put(url, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("updateEnquiry response:", response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error updating enquiry:", error.response?.data || error.message);
    return { error: error.response?.data?.error || error.message };
  }
};

export const fetchEnquiryDropdownOptions = async () => {
  try {
    const url = buildApiUrl("/getPostData", "user");
    console.log("Fetching enquiry dropdown options from:", url);
    const response = await axios.get(url);
    return (
      response.data.result || {
        cities: [],
        builders: [],
        communities: [],
        balconies: [],
        baths: [],
        beds: [],
        homeTypes: [],
        parkingCounts: [],
        propDesc: [],
        tenants: [],
        tenantEatPrefs: [],
        propType: [],
        availability: [],
        facing: [],
        parkingType: [],
      }
    );
  } catch (error: any) {
    console.error("Error fetching enquiry dropdown options:", error.response?.data || error.message);
    return {
      cities: [],
      builders: [],
      communities: [],
      balconies: [],
      baths: [],
      beds: [],
      homeTypes: [],
      parkingCounts: [],
      propDesc: [],
      tenants: [],
      tenantEatPrefs: [],
      propType: [],
      availability: [],
      facing: [],
      parkingType: [],
    };
  }
};
